const createSlug = require('speakingurl');
const ObjectID = require('bson').ObjectID;
const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: 'string',
    slug: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, slug } = ctx.params;

    if( slug ) {
      // Slugify
      slug = createSlug(slug, { lang: 'fr', custom: { '.': '.' } });
    } else {
      // Generate a MongoDB-like object ID
      slug = new ObjectID().toString()
    }

    const preferredUri = urlJoin(containerUri, slug);

    let resourcesStartingWithUri = await ctx.call('triplestore.query', {
      query: `
        ${getPrefixRdf(this.settings.ontologies)}
        SELECT distinct ?uri
        WHERE {
          ?uri ?predicate ?object.
          FILTER regex(str(?uri), "^${preferredUri}")
        }
      `,
      accept: MIME_TYPES.JSON
    });

    let counter = 0;
    if (resourcesStartingWithUri.length > 0) {
      resourcesStartingWithUri = resourcesStartingWithUri.map(r => r.uri.value);
      // If preferredUri is already used, find another available URI
      if (resourcesStartingWithUri.includes(preferredUri)) {
        do {
          counter++;
        } while (resourcesStartingWithUri.includes(preferredUri + counter));
      }
    }

    return preferredUri + (counter > 0 ? counter : '');
  }
};
