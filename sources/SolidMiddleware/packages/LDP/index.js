'use strict';


const fetch = require('node-fetch');

module.exports = {
  name: 'ldp',
  routes: {
    aliases: {
      'GET activities': 'ldp.list'
    }
  },
  actions: {
    async list(ctx) {
      ctx.meta.$responseType = "text/turtle";
      let result =  await this.getTriples(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX as: <https://www.w3.org/ns/activitystreams#>
        CONSTRUCT {
        	?activity rdf:type as:Create.
        	?activity as:object ?object.
        	?object rdf:type ?typeObject.
        	?object as:content ?content.
        	?object as:name ?name.
        	?object as:published ?published.
        }
        WHERE {
        	?activity rdf:type as:Create ;
        	as:object ?object.
        	?object rdf:type ?typeObject;
        	as:content ?content;
        	as:name ?name;
        	as:published ?published.
        }
            `);
      console.log(result);
      return result;
    }
  },
  methods: {
    getTriples(query) {
      console.log(query);
      return new Promise(async (resolve, reject) => {
        try {
          let response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset+'/query', {
            method: 'POST',
            body: query,
            headers: {
              'Content-Type': 'application/sparql-query'
            }
          })
          let result = response.text();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      })
    }
  }
};
