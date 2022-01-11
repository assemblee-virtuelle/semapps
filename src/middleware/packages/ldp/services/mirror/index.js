const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const {
    createFragmentURL
  } = require('../../utils');

const regexPrefix = new RegExp('^@prefix ([\\w]*: +<.*>) .','gm')

  module.exports = {
  name: 'ldp.mirror',
  settings: {
    baseUrl: null,
    mirrorGraphName: null,
    servers: [],
  },
  dependencies: ['triplestore'],
  actions: {
    mirror: {
      visibility: 'public',
      params: {
        serverUrl: { type: 'string', optional: false },
      },
      async handler(ctx) {

        let { serverUrl } = ctx.params;
        console.log('MIRRORING ',serverUrl)

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

      }
    }
  },
  async started() {

    this.mirroredServers = [];
    if (this.settings.servers.length > 0) {
      for (let server of this.settings.servers) {
        await this.actions.mirror( { serverUrl:server } );
      }
    }

  },
  methods: {
  }
};
