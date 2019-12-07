'use strict';


const fetch = require('node-fetch');

module.exports = {
  name: 'ldp',
  routes: {
    aliases: {
      'GET ldp': 'ldp.list'
    }
  },
  actions: {
    async list(ctx) {
      ctx.meta.$responseType = "text/turtle";
      return await this.getTriples(`
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
    }
  },
  methods: {
    getTriples(query) {
      console.log(query);
      return new Promise(async (resolve, reject) =>  {
        try {
          let response= await fetch(this.settings.sparqlEndpoint + 'query', {
            method: 'POST',
            body: query,
            headers: {
              'Content-Type': 'application/sparql-query'
            }
          })
          let result=response.text()
          console.log(result);
          resolve(result);
        } catch (e) {
          reject(e);
        } finally {

        }
      })
    }
  }
};
