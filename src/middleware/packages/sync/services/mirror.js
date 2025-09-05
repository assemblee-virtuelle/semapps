const urlJoin = require('url-join');
const fetch = require('node-fetch');
const { MoleculerError } = require('moleculer').Errors;
const { createFragmentURL, arrayOf, getId } = require('@semapps/ldp');
const { ACTIVITY_TYPES } = require('@semapps/activitypub');
const SynchronizerService = require('./synchronizer');

module.exports = {
  name: 'mirror',
  settings: {
    servers: []
  },
  dependencies: [
    'triplestore',
    'webfinger',
    'activitypub',
    'activitypub.relay',
    'auth.account',
    'ldp.container',
    'ldp.registry'
  ],
  created() {
    this.broker.createService({
      mixins: [SynchronizerService],
      settings: {
        podProvider: false,
        synchronizeContainers: true,
        attachToLocalContainers: false
      }
    });
  },
  async started() {
    this.relayActor = await this.broker.call('activitypub.relay.getActor');
    if (this.settings.servers.length > 0) {
      for (const serverUrl of this.settings.servers) {
        // Do not await because we don't want to block the startup of the services.
        this.actions
          .mirror({ serverUrl })
          .catch(e => this.logger.warn(`Mirroring failed for ${serverUrl} : ${e.message}`));
      }
    }
  },
  actions: {
    mirror: {
      visibility: 'public',
      params: {
        serverUrl: { type: 'string', optional: false }
      },
      async handler(ctx) {
        const { serverUrl } = ctx.params;

        // Check if the server is already followed, in which case, we already did the mirror, we can skip.

        const serverDomainName = new URL(serverUrl).host;
        const remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', { account: `relay@${serverDomainName}` });

        const alreadyFollowing = await ctx.call('activitypub.follow.isFollowing', {
          follower: this.relayActor.id,
          following: remoteRelayActorUri
        });

        if (alreadyFollowing) {
          this.logger.info(`Already mirrored and following: ${serverUrl}`);
          return remoteRelayActorUri;
        }

        // If not, we will now mirror and then follow the remote relay actor

        this.logger.info(`Mirroring ${serverUrl}`);

        const voidUrl = urlJoin(serverUrl, '/.well-known/void');

        const response = await fetch(voidUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/ld+json'
          }
        });

        if (!response.ok) throw new MoleculerError(`No VOID endpoint on the server ${serverUrl}`, 404, 'NOT_FOUND');

        const json = await response.json();
        const mapServers = {};
        for (const s of json['@graph']) {
          mapServers[s['@id']] = s;
        }
        const server = mapServers[createFragmentURL('', serverUrl)];
        if (!server)
          throw new MoleculerError(
            `The VOID answer does not contain valid information for ${serverUrl}`,
            400,
            'INVALID'
          );

        // We mirror only the relevant server, meaning, not the mirrored data of the remote server.
        // If A mirrors B, and B also contains a mirror of C, then when A mirrors B,
        // A will only mirror what is proper to B, not the mirrored data of C

        const partitions = server['void:classPartition'];

        if (partitions) {
          for (const p of arrayOf(partitions)) {
            // Skip containers marked as "doNotMirror"
            if (p['semapps:doNotMirror']) continue;

            const rep = await fetch(p['void:uriSpace'], {
              method: 'GET',
              headers: {
                Accept: 'application/ld+json'
              }
            });

            if (rep.ok) {
              const container = await rep.json();
              const containerUri = getId(container);

              this.logger.info(`Storing remote container ${containerUri}...`);

              // Don't use ldp.container.create to avoid side effects
              await ctx.call('triplestore.update', {
                query: `
                  PREFIX ldp: <http://www.w3.org/ns/ldp#>
                  INSERT DATA {
                    GRAPH <${containerUri}> {
                      <${containerUri}> a ldp:Container, ldp:BasicContainer .
                    }
                  }
                `,
                webId: 'system'
              });

              for (const resource of arrayOf(container['ldp:contains'])) {
                const resourceUri = getId(resource);
                this.logger.info(`Storing remote resource ${resourceUri}...`);

                await ctx.call('ldp.remote.store', { resource });

                // Don't use ldp.container.attach to avoid side effects
                await ctx.call('triplestore.update', {
                  query: `
                    PREFIX ldp: <http://www.w3.org/ns/ldp#>
                    INSERT DATA {
                      GRAPH <${containerUri}> {
                        <${containerUri}> ldp:contains <${resourceUri}> .
                      }
                    }
                  `,
                  webId: 'system'
                });
              }
            }
          }
        }

        // Unmark any single mirrored resources that belong to this server we just mirrored
        // because we don't need to periodically watch them anymore
        const singles = await this.broker.call('triplestore.query', {
          query: `
            SELECT DISTINCT ?s 
            WHERE { 
              GRAPH ?g { 
                ?s <http://semapps.org/ns/core#singleMirroredResource> <${serverUrl}> 
              }
            }
          `,
          webId: 'system'
        });

        for (const single of singles) {
          try {
            const resourceUri = single.s.value;
            await this.broker.call('triplestore.update', {
              query: `
                DELETE WHERE { 
                  GRAPH ?g { 
                    <${resourceUri}> <http://semapps.org/ns/core#singleMirroredResource> ?q . 
                  }
                }
              `,
              webId: 'system'
            });
          } catch (e) {
            // Fail silently
          }
        }

        this.logger.info('Mirroring done.');

        // Now subscribing to the Relay actor in order to receive updates

        this.logger.info(`Following remote relay actor ${remoteRelayActorUri}`);

        await ctx.call('activitypub.outbox.post', {
          collectionUri: this.relayActor.outbox,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: this.relayActor.id,
          type: ACTIVITY_TYPES.FOLLOW,
          object: remoteRelayActorUri,
          to: [remoteRelayActorUri]
        });

        return remoteRelayActorUri;
      }
    }
  }
};
