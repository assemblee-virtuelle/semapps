'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');

const { ACTIVITY_TYPES } = require('../constants');

module.exports = {
  name: 'activitypub.outbox',
  settings: {
    homeUrl: null
  },
  dependencies: ['triplestore'],
  actions: {
    async post({ params, broker }) {
      let activity;

      if (!ACTIVITY_TYPES.includes(params.type)) {
        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: this.generateId('subject/'),
          type: 'Create',
          object: {
            id: this.generateId('subject/'),
            ...params
          }
        };
      } else {
        activity = {
          id: this.generateId('subject/'),
          ...params
        };
      }

      const result = await broker.call('triplestore.insert', {
        resource: activity,
        accept: 'json'
      });

      if (result.status >= 200 && result.status < 300) {
        return await jsonld.compact(activity, 'https://www.w3.org/ns/activitystreams');
      } else {
        throw result;
      }
    },
    async list({ broker }) {
      const results = await broker.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT  ?activity ?object ?type
          WHERE {
            ?activity rdf:type as:Create ;
                      rdf:type ?type ;
                      as:object ?object .
          }
        `,
        accept: 'json'
      });

      const orderedCollection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'OrderedCollection',
        totalItems: results.length,
        orderedItems: results.map(result => ({
          id: result.activity.value,
          type: result.type.value,
          object: result.object.value
        }))
      };

      return await jsonld.compact(orderedCollection, 'https://www.w3.org/ns/activitystreams');
    }
  },
  methods: {
    generateId(path = '') {
      return this.settings.homeUrl + path + uuid().substring(0, 8)+'/';
    }
  }
};
