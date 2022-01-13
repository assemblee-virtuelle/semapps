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

    if (slug) {
      // Slugify
      slug = createSlug(slug, { lang: 'fr', custom: { '.': '.' } });
    } else {
      // Generate a MongoDB-like object ID
      slug = new ObjectID().toString();
    }

    let preferredUri = urlJoin(containerUri, slug);
    let resourceAlreadyExists = await ctx.call('ldp.resource.exist', { resourceUri: preferredUri, webId: 'system' });

    let counter = 0;
    if (resourceAlreadyExists) {
      // If preferredUri is already used, find another available URI
      do {
        counter++;
        resourceAlreadyExists = await ctx.call('ldp.resource.exist', {
          resourceUri: preferredUri + counter,
          webId: 'system'
        });
      } while (resourceAlreadyExists);
      preferredUri = preferredUri + counter;
    }

    return preferredUri;
  }
};
