'use strict';

const jsonld = require('jsonld');

module.exports = {
  name: 'activitypub.collection',
  dependencies: ['triplestore'],
  actions: {
    async attach(ctx) {
      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: ctx.params.collectionUri,
        type: ['Collection', 'OrderedCollection'],
        summary: ctx.params.summary,
        items: ctx.params.objectUri
      };

      return await ctx.call('triplestore.insert', {
        resource: collection,
        accept: 'json'
      });
    },
    async queryOrderedCollection(ctx) {
      // TODO make this data agnostic, by passing the object-related query as an optional parameter
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${ctx.params.collectionUri}> 
              a as:OrderedCollection ;
              as:items ?item .
            ?item a ?type .
            ?item as:published ?published .
            ?item as:object ?object .
            ?object ?predicate ?objectProp .
          }
          WHERE {
            <${ctx.params.collectionUri}> 
              a as:OrderedCollection ;
              as:items ?item .
            ?item a ?type .
            ?item as:published ?published .
            ?item as:object ?object .
            OPTIONAL {
              ?object ?predicate ?objectProp .
            }
          }
          ORDER BY ?published  # Order by activities publication
        `,
        accept: 'json'
      });

      let framed = await jsonld.frame(result, {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'OrderedCollection'
      });
      framed = framed['@graph'][0];

      // If no items was attached, the collection wasn't created, so use an an empty collection
      if (!framed) framed = { id: ctx.params.collectionUri, type: 'OrderedCollection', items: [] };
      // If there is only one item, we receive it as an object so put it in an array
      else if (!Array.isArray(framed.items)) framed.items = [framed.items];

      return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: framed.id,
        type: framed.type,
        summary: framed.summary,
        totalItems: framed.items.length,
        orderedItems: framed.items
      };
    },
    async queryCollection(ctx) {
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT
          WHERE {
            <${ctx.params.collectionUri}> 
              a as:Collection ;
              as:items ?item
          }
        `,
        accept: 'json'
      });

      let framed = await jsonld.frame(result, {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'Collection'
      });
      framed = framed['@graph'][0];

      // If no items was attached, the collection wasn't created, so use an an empty collection
      if (!framed) framed = { id: ctx.params.collectionUri, type: 'Collection', items: [] };
      // If there is only one item, we receive it as an object so put it in an array
      else if (!Array.isArray(framed.items)) framed.items = [framed.items];

      return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: framed.id,
        type: framed.type,
        summary: framed.summary,
        totalItems: framed.items.length,
        items: framed.items
      };
    }
  }
};
