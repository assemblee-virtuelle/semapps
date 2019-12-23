'use strict';

const jsonld = require('jsonld');

module.exports = {
  name: 'activitypub.collection',
  dependencies: ['triplestore'],
  actions: {
    /*
     * Attach an object to a collection
     * @param collectionUri The full URI of the collection
     * @param objectUri The full URI of the object to add to the collection
     * @param summary An optional description of the collection
     */
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
    /*
     * Returns a JSON-LD formatted OrderedCollection stored in the triple store
     * @param collectionUri The full URI of the collection
     * @param optionalTriplesToFetch RDF-formatted triples to fetch (use ?item for the base item)
     */
    async queryOrderedCollection(ctx) {
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            # We need to define the CONSTRUCT clause because it doesn't work 
            # when there is an OPTIONAL parameter in the WHERE clause 
            <${ctx.params.collectionUri}> 
              a as:OrderedCollection ;
              as:items ?item .
            ?item ?itemP ?itemO .
            ${ctx.params.optionalTriplesToFetch || ''}
          }
          WHERE {
            <${ctx.params.collectionUri}> 
              a as:OrderedCollection ;
              as:items ?item .
            ?item ?itemP ?itemO .
            OPTIONAL { 
              ${ctx.params.optionalTriplesToFetch || ''}
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
    /*
     * Returns a JSON-LD formatted Collection stored in the triple store
     * @param collectionUri The full URI of the collection
     */
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
