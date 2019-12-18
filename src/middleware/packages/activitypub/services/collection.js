'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');

module.exports = {
  name: 'activitypub.collection',
  dependencies: ['triplestore'],
  actions: {
    async attach(ctx) {
      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: ctx.params.collectionUri,
        type: 'OrderedCollection',
        summary: ctx.params.summary,
        items: ctx.params.activityUri
      };

      return await ctx.call('triplestore.insert', {
        resource: collection,
        accept: 'json'
      });
    },
    async query(ctx) {
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            ?collection as:items ?activity .
            ?collection a as:OrderedCollection .
            ?activity as:object ?object .
            ?activity a ?type .
            ?object ?predicate ?objectProp .
          }
          WHERE {
            <${ctx.params.collectionUri}> 
              a as:OrderedCollection ;
              as:items ?activity .
            ?collection as:items ?activity .
            ?activity a ?type .
            ?activity as:published ?published .
            ?activity as:object ?object .
            ?object ?predicate ?objectProp .
          }
          ORDER BY ?published  # Order by activities publication
        `,
        accept: 'json'
      });

      let framed = await jsonld.frame(result, {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'OrderedCollection',
        items: [
          {
            object: {}
          }
        ]
      });
      framed = framed['@graph'][0];

      // If no items was attached, the collection wasn't created, so use an an empty collection
      if (!framed) framed = { id: ctx.params.collectionUri, type: 'OrderedCollection', items: [] };
      // If there is only one item, we receive it as an object so put it in an array
      else if (!framed.items.length) framed.items = [framed.items];

      return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: framed.id,
        type: framed.type,
        summary: framed.summary,
        totalItems: framed.items.length,
        orderedItems: framed.items
      };
    }
  }
};
