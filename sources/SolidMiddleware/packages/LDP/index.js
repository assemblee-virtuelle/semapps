'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const fetch = require('node-fetch');

module.exports = {
  name: 'ldp',
  routes: {
    aliases: {
      'GET ldp': 'ldp.list'
    }
  },
  actions: {
    async list() {
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
      return new Promise((resolve, reject) => async {
        try {
          let result= await fetch(this.settings.sparqlEndpoint + 'query', {
            method: 'POST',
            body: query,
            headers: {
              'Content-Type': 'application/sparql-query'
            }
          })
          resolve(result);
        } catch (e) {
          reject(e);
        } finally {

        }
      })
    }
  }
};
