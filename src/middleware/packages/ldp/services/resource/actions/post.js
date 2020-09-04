const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const createSlug = require('speakingurl');
const { MIME_TYPES } = require('@semapps/mime-types');
const { generateId } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    let { containerUri, ...resource } = ctx.params;
    try {
      const resourceUri = await ctx.call('ldp.resource.post', {
        containerUri: containerUri,
        slug: ctx.meta.headers.slug,
        resource,
        contentType: ctx.meta.headers['content-type'],
        accept: MIME_TYPES.JSON
      });

      ctx.meta.$statusCode = 201;
      ctx.meta.$responseHeaders = {
        Location: resourceUri,
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
      const { resource, containerUri, slug, contentType, webId } = ctx.params;

      // Generate ID and make sure it doesn't exist already
      resource['@id'] = urlJoin(containerUri, slug ? createSlug(slug, { lang: 'fr' }) : generateId());
      resource['@id'] = await this.findAvailableUri(ctx, resource['@id']);

      const containerExist = await ctx.call('ldp.container.exist', { containerUri });
      if (!containerExist) {
        throw new MoleculerError(
          `Cannot create resource in non-existing container ${containerUri}`,
          400,
          'BAD_REQUEST'
        );
      }

      if (!resource['@context']) {
        throw new MoleculerError(`No @context is provided for the resource ${resource['@id']}`, 400, 'BAD_REQUEST');
      }

      await ctx.call('triplestore.insert', {
        resource,
        contentType,
        webId
      });

      await ctx.call('ldp.container.attach', {
        resourceUri: resource['@id'],
        containerUri,
        webId
      });

      // Get the standard-formatted data to send with event
      const newData = await ctx.call('ldp.resource.get', {
        resourceUri: resource['@id'],
        accept: MIME_TYPES.JSON,
        queryDepth: 1
      });

      ctx.emit('ldp.resource.created', {
        resourceUri: resource['@id'],
        newData,
        webId
      });

      return resource['@id'];
    }
  }
};
