'use strict';

const jsonld = require('jsonld');

module.exports = {
  name: 'activitypub.collection',
  dependencies: ['triplestore'],
  actions: {
    /*
     * Create a persisted collection
     * @param collectionUri The full URI of the collection
     * @param summary An optional description of the collection
     */
    async create(ctx) {
      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: ctx.params.collectionUri,
        type: ['Collection', 'OrderedCollection'],
        summary: ctx.params.summary
      };

      return await ctx.call('triplestore.insert', {
        resource: collection,
        accept: 'json'
      });
    },
    /*
     * Checks if the collection exists
     * @param collectionUri The full URI of the collection
     * @return true if the collection exists
     */
    async exist(ctx) {
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          ASK
          WHERE {
            <${ctx.params.collectionUri}> a as:Collection .
          }
        `,
        accept: 'json'
      });
    },
    /*
     * Attach an object to a collection
     * @param collectionUri The full URI of the collection
     * @param objectUri The full URI of the object to add to the collection
     */
    async attach(ctx) {
      const collectionExist = ctx.call('activitypub.collection.exist', {
        collectionUri: ctx.params.collectionUri
      });
      if (!collectionExist) throw new Error('Cannot attach to an unexisting collection !');

      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: ctx.params.collectionUri,
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
            <${ctx.params.collectionUri}> a as:OrderedCollection .
            OPTIONAL { 
              <${ctx.params.collectionUri}> as:items ?item .
              ?item ?itemP ?itemO .
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

      if (!framed) {
        // If no items was attached, the collection wasn't created
        return null;
      } else {
        if (!framed.items) framed.items = [];
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
      }
    },
    /*
     * Returns a JSON-LD formatted Collection stored in the triple store
     * @param collectionUri The full URI of the collection
     */
    async queryCollection(ctx) {
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${ctx.params.collectionUri}> 
              a as:Collection ;
              as:items ?item
          }
          WHERE {
            <${ctx.params.collectionUri}> a as:Collection .
            OPTIONAL { <${ctx.params.collectionUri}> as:items ?item . }
          }
        `,
        accept: 'json'
      });

      let framed = await jsonld.frame(result, {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'Collection'
      });
      framed = framed['@graph'][0];

      if (!framed) {
        // If no items was attached, the collection wasn't created
        return null;
      } else {
        if (!framed.items) framed.items = [];
        // If there is only one item, we receive it as an object so put it in an array
        else if (!Array.isArray(framed.items)) framed.items = [framed.items];

        return {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: framed.id,
          type: framed.type,
          summary: framed.summary,
          totalItems: framed.items ? framed.items.length : 0,
          items: framed.items
        };
      }
    },
    /*
     * Returns a simple array of the resources URIs contained in the collection
     * @param collectionUri The full URI of the collection
     */
    async queryItems(ctx) {
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT ?item
          WHERE {
            <${ctx.params.collectionUri}> 
              a as:Collection ;
              as:items ?item
          }
        `,
        accept: 'json'
      });

      return results ? results.map(item => item.item.value) : [];
    }
  }
};
