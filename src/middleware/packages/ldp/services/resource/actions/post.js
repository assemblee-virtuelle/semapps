const { MIME_TYPES } = require('@semapps/mime-types');
const { generateId } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    let { containerUri, typeURL } = ctx.params;
    try {
      const resource = await ctx.call('ldp.resource.post', {
        containerUri: containerUri || `${this.settings.baseUrl}${typeURL}/`,
        slug: ctx.meta.headers.slug,
        resource: ctx.meta.body,
        contentType: ctx.meta.headers['content-type'],
        accept: MIME_TYPES.JSON
      });

      ctx.meta.$statusCode = 201;
      ctx.meta.$responseHeaders = {
        Location: resource['@id'],
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: 'object',
      webId: {
        type: 'string',
        optional: true
      },
      accept: {
        type: 'string'
      },
      contentType: {
        type: 'string'
      },
      containerUri: {
        type: 'string'
      },
      slug: {
        type: 'string',
        optional: true
      }
    },
    async handler(ctx) {
      const { resource, containerUri, slug, accept, contentType, webId } = ctx.params;

      if (webId) ctx.meta.webId = webId;

      // Generate ID and make sure it doesn't exist already
      resource['@id'] = resource['@id'] || `${containerUri}${slug || generateId()}`;
      resource['@id'] = await this.findUnusedUri(ctx, resource['@id']);

      await ctx.call('triplestore.insert', {
        resource,
        contentType
      });

      await ctx.call('ldp.container.attach', {
        resourceUri: resource['@id'],
        containerUri
      });

      return await ctx.call('ldp.resource.get', {
        resourceUri: resource['@id'],
        accept
      });
    }
  }
};
