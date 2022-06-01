const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const { ACTOR_TYPES, ACTIVITY_TYPES } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');

const {
    createFragmentURL,
    getContainerFromUri
  } = require('@semapps/ldp/utils');


const regexPrefix = new RegExp('^@prefix ([\\w]*: +<.*>) .','gm')

module.exports = {
  name: 'mirror',
  settings: {
    baseUrl: null,
    mirrorGraphName: 'http://semapps.org/mirror',
    servers: [],
    actor: {
      username: 'relay',
      name: 'Relay actor for Mirror service'
    }
  },
  dependencies: ['triplestore','webfinger','activitypub','ldp.void','auth.account','ldp.container'],

  async started() {

    // Ensure services have been started
    await this.broker.waitForServices(['ldp.container', 'auth.account','activitypub.follow']);

    const actorSettings = this.settings.actor;

    const actorExist = await this.broker.call('auth.account.usernameExists', { username: actorSettings.username });

    this.logger.info('actorExist '+ actorExist)

    const uri = urlJoin(this.settings.baseUrl,'/users',actorSettings.username)
    this.relayActorUri = uri;

    if (!actorExist) {
      this.logger.info(`MirrorService > Actor "${actorSettings.name}" does not exist yet, creating it...`);

      await this.broker.call('auth.account.create', { 
        username: actorSettings.username,
        webId: uri,
      },{ meta:{ isSystemCall:true } } );

      await this.broker.call('ldp.container.post', {
        containerUri: getContainerFromUri(uri),
        slug: actorSettings.username,
        resource: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          type: ACTOR_TYPES.APPLICATION,
          preferredUsername: actorSettings.username,
          name: actorSettings.name
        },
        contentType: MIME_TYPES.JSON
      });

    }

    // keep the outbox collection uri
    this.relayOutboxUri = await this.broker.call('activitypub.actor.getCollectionUri', {
      actorUri: uri,
      predicate: 'outbox',
      webId: 'system'
    });

    this.mirroredServers = [];
    if (this.settings.servers.length > 0) {
      for (let server of this.settings.servers) {
        try {

          // we do not await because we don't want to bloc the startup of the services.
          const promise = this.actions.mirror( { serverUrl:server } );
          promise.then( () =>  {this.mirroredServers.push(server);} )
                 .catch(e => this.logger.error("Mirroring failed for "+server+" : "+e.message));
        } catch(e) {
          this.logger.error("Mirroring failed for "+server+" : "+e.message)
        }
      }
    }
  },
  actions: {
    mirror: {
      visibility: 'public',
      params: {
        serverUrl: { type: 'string', optional: false },
      },
      async handler(ctx) {

        let { serverUrl } = ctx.params;

        // check if the server is already followed, in which case, we already did the mirror, we can skip.

        const serverDomainName = new URL(serverUrl).host
        const remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', { account: 'relay@'+serverDomainName });

        const alreadyFollowing = await ctx.call('activitypub.follow.isFollowing', { follower: this.relayActorUri, following: remoteRelayActorUri});

        if (alreadyFollowing) {
          this.logger.info("Already mirrored and following: "+serverUrl)
          return;
        }

        // if not, we will now mirror and then follow the relay actor

        this.logger.info("Mirroring "+serverUrl)

        const voidUrl = urlJoin(serverUrl,'/.well-known/void')

        const response = await fetch(voidUrl, {
            method: 'GET',
            headers: {
                'Accept':'application/ld+json'
            }
        });

        if (!response.ok)
            throw new MoleculerError('No VOID endpoint on the server ' + serverUrl, 404, 'NOT_FOUND');
        
        const json = await response.json();
        const firstServer = json['@graph'][0];
        if (!firstServer || firstServer['@id'] !== createFragmentURL('',serverUrl))
            throw new MoleculerError('The VOID answer does not contain valid information for ' + serverUrl, 400, 'INVALID');
        
        const partitions = firstServer['void:classPartition']

        for (const p of partitions) {
            //console.log(p['void:class'], p['void:entities'], p['void:uriSpace'])

            const rep = await fetch(p['void:uriSpace'], {
                method: 'GET',
                headers: {
                    'Accept':'text/turtle'
                }
            });

            if (rep.ok) {
                let container = await rep.text();
                //console.log(container)

                const prefixes = [...container.matchAll(regexPrefix)];

                let sparqlQuery = ''
                for (const pref of prefixes) {
                    sparqlQuery += 'PREFIX '+pref[1]+'\n'
                }
                sparqlQuery += `INSERT DATA { GRAPH <${this.settings.mirrorGraphName}> { \n`
                sparqlQuery += container.replace(regexPrefix, '')
                sparqlQuery += '} }'

                await ctx.call('triplestore.update', { query:sparqlQuery })
            }
        }

        this.logger.info("Mirroring done.")

        // now subscribing to the relay actor in order to receive updates (updateBot)

        this.logger.info("Following remote relay actor "+remoteRelayActorUri)

        const followActivity = await ctx.call('activitypub.outbox.post', {
          collectionUri: this.relayOutboxUri,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: this.relayActorUri,
          type: ACTIVITY_TYPES.FOLLOW,
          object: remoteRelayActorUri,
          to: [remoteRelayActorUri]
        });
        
      }
    }
  },
  events: {
    'activitypub.inbox.received'(ctx) {
      if (this.inboxReceived) {
        if (ctx.params.recipients.includes(this.relayActorUri)) {
          this.inboxReceived(ctx);
        }
      }
    }
  },
  methods: {

    async getFollowers() {
      const result = await this.broker.call('activitypub.follow.listFollowers', {
        collectionUri: urlJoin(this.uri, 'followers')
      });
      return result ? defaultToArray(result.items) : [];
    },
    inboxReceived(ctx) {
       //console.log('Received ',ctx.params.activity)
    }
  }
};
