const urlJoin = require("url-join");
const fetch = require("node-fetch");
const { MoleculerError } = require('moleculer').Errors;
const { createFragmentURL, defaultToArray } = require("@semapps/ldp");

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

module.exports = {
  visibility: 'public',
  params: {
    serverUrl: { type: 'string', optional: false }
  },
  async handler(ctx) {
    let { serverUrl } = ctx.params;

    // check if the server is already followed, in which case, we already did the mirror, we can skip.

    const serverDomainName = new URL(serverUrl).host;
    const remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', { account: 'relay@' + serverDomainName });

    const alreadyFollowing = await ctx.call('activitypub.relay.isFollowing', {
      remoteRelayActorUri
    });

    if (alreadyFollowing) {
      this.logger.info('Already mirrored and following: ' + serverUrl);
      return remoteRelayActorUri;
    }

    // if not, we will now mirror and then follow the remote relay actor

    this.logger.info('Mirroring ' + serverUrl);

    const voidUrl = urlJoin(serverUrl, '/.well-known/void');

    const response = await fetch(voidUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/ld+json'
      }
    });

    if (!response.ok) throw new MoleculerError('No VOID endpoint on the server ' + serverUrl, 404, 'NOT_FOUND');

    const json = await response.json();
    let mapServers = {};
    for (let s of json['@graph']) {
      mapServers[s['@id']] = s;
    }
    const server = mapServers[createFragmentURL('', serverUrl)];
    if (!server)
      throw new MoleculerError(
        'The VOID answer does not contain valid information for ' + serverUrl,
        400,
        'INVALID'
      );

    // We mirror only the relevant server, meaning, not the mirrored data of the remote server.
    // If A mirrors B, and B also contains a mirror of C, then when A mirrors B,
    // A will only mirror what is proper to B, not the mirrored data of C

    const partitions = server['void:classPartition'];

    if (partitions) {
      for (const p of defaultToArray(partitions)) {
        // we skip empty containers and doNotMirror containers
        if (p['semapps:doNotMirror']) continue;

        const rep = await fetch(p['void:uriSpace'], {
          method: 'GET',
          headers: {
            Accept: 'text/turtle'
          }
        });

        if (rep.ok) {
          let container = await rep.text();

          const prefixes = [...container.matchAll(regexPrefix)];

          let sparqlQuery = '';
          for (const pref of prefixes) {
            sparqlQuery += 'PREFIX ' + pref[1] + '\n';
          }
          sparqlQuery += `INSERT DATA { GRAPH <${this.settings.graphName}> { \n`;
          sparqlQuery += container.replace(regexPrefix, '');
          sparqlQuery += '} }';

          await ctx.call('triplestore.update', { query: sparqlQuery });
        }
      }
    }

    // unmarking any single mirrored resources that belong to this server we just mirrored
    // because we don't need to periodically watch them anymore
    let singles = await this.broker.call('triplestore.query', {
      query: `SELECT DISTINCT ?s WHERE { 
          GRAPH <${this.settings.graphName}> { 
          ?s <http://semapps.org/ns/core#singleMirroredResource> <${serverUrl}> } }`
    });

    for (const single of singles) {
      try {
        const resourceUri = single.s.value;
        await this.broker.call('triplestore.update', {
          webId: 'system',
          query: `DELETE WHERE { GRAPH <${this.settings.graphName}> { 
              <${resourceUri}> <http://semapps.org/ns/core#singleMirroredResource> ?q. } }`
        });
      } catch (e) {
        // fail silently
      }
    }

    this.logger.info('Mirroring done.');

    // now subscribing to the relay actor in order to receive updates (updateBot)

    this.logger.info('Following remote relay actor ' + remoteRelayActorUri);

    const activity = await ctx.call('activitypub.relay.follow', {
      remoteRelayActorUri
    });

    return remoteRelayActorUri;
  }
};
