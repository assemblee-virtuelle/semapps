const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const { ACTOR_TYPES } = require('@semapps/activitypub');
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
  dependencies: ['triplestore','webfinger','activitypub','ldp.void','auth.account'],

  async started() {

    // Ensure LDP sub-services have been started
    await this.broker.waitForServices(['ldp.container', 'ldp.resource','auth.account']);

    const actorSettings = this.settings.actor;

    const actorExist = await this.broker.call('auth.account.usernameExists', { username: actorSettings.username });

    this.logger.info('actorExist '+ actorExist)
    // const actorExist = await this.broker.call('auth.account', {
    //   resourceUri: actorSettings.uri
    // });

    if (!actorExist) {
      this.logger.info(`MirrorService > Actor ${actorSettings.name} does not exist yet, creating it...`);

      const uri = urlJoin(this.settings.baseUrl,'/users',actorSettings.username)

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

    this.mirroredServers = [];
    if (this.settings.servers.length > 0) {
      for (let server of this.settings.servers) {
        try {
          await this.actions.mirror( { serverUrl:server } );
        } catch(e) {
          this.logger.error("Mirroring failed: "+e.message)
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

      }
    }
  },

  methods: {
  }
};
