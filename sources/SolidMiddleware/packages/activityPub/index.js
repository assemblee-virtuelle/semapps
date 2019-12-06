"use strict";

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const fetch = require('node-fetch');

module.exports = {
  name: "outbox",
  settings: {
    homeUrl: process.env.HOME_URL || 'http://localhost:3000/',
    sparqlEndpoint: process.env.SPARQL_ENDPOINT
  },
  routes: {
    aliases: {
      "POST outbox": "outbox.post",
      "GET outbox": "outbox.list"
    }
  },
  actions: {
    async post({
      params
    }) {
      let activity = params;

      if (activity.type !== 'Create') {
        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          'id': this.generateId('activity/'),
          type: 'Create',
          object: {
            'id': this.generateId('object/'),
            ...activity
          }
        }
      } else {
        activity['id'] = this.generateId('activity/');
      }

      const rdf = await jsonld.toRDF(activity, {
        format: 'application/n-quads'
      });

      const result = await this.storeTriples(rdf);

      if (result.status >= 200 && result.status < 300) {
        return await jsonld.compact(activity, 'https://www.w3.org/ns/activitystreams');
      } else {
        throw result;
      }
    },
    async list() {
      return await this.getTriples(`
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX as: <https://www.w3.org/ns/activitystreams#>
                JSON {
                  "activity": ?activity,
                  "type": ?type,
                  "object": ?object
                }
                WHERE {
                  ?activity rdf:type as:Create ;
                            rdf:type ?type ;
                            as:object ?object .
                }
            `);
    }
  },
  methods: {
    generateId(path = '') {
      return this.settings.homeUrl + path + uuid();
    },
    storeTriples(rdf) {
      const insertQuery = `
                INSERT DATA
                {
                    ${rdf}
                }
            `;
      return fetch(this.settings.sparqlEndpoint + 'update', {
        method: 'POST',
        body: insertQuery,
        headers: {
          'Content-Type': 'application/sparql-update',
          'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64')
        }
      });
    },
    getTriples(query) {
      return fetch(this.settings.sparqlEndpoint + 'query', {
        method: 'POST',
        body: 'query=' + query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64')
        }
      }).then(result => result.json());
    }
  }
};
