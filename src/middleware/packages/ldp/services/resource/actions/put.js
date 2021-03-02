const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri,getContainerFromUri } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    // PUT have to stay in same container and @id can't be different
    // TODO generate an error instead of overwriting the ID
    resource['@id'] = `${containerUri}/${id}`;
    if (ctx.meta.parser === 'file') {
      throw new MoleculerError(`PUT method is not supported for non-RDF resources`, 400, 'BAD_REQUEST');
    }

    try {
      await ctx.call('ldp.resource.put', {
        resource,
        contentType: ctx.meta.headers['content-type'],
        containerUri,
        slug: id,
        webId: ctx.meta.webId
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
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
      resource: { type: 'object' },
      webId: { type: 'string', optional: true },
      contentType: { type: 'string' },
      disassembly: {
        type: 'array',
        optional: true
      },
    },
    async handler(ctx) {
      const resourceUri = ctx.params.resource.id || ctx.params.resource['@id'];
      if (!resourceUri) throw new MoleculerError('No resource ID provided', 400, 'BAD_REQUEST');
      const containerUri = getContainerFromUri(resourceUri);
      const { resource, contentType, webId, disassembly } = {
        ...(await ctx.call('ldp.container.getOptions', { uri: containerUri })),
        ...ctx.params
      };

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      // If the new data are badly formatted, old data will be reinserted before throwing a 400 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON
      });

      // First delete the whole resource
      await ctx.call('ldp.resource.delete', {
        resourceUri,
        webId
      });

      let newData;
      try {
        // ... then insert back all the data
        newData = await ctx.call('ldp.resource.post', {
          resource,
          contentType,
          containerUri,
          webId,
          slug : getSlugFromUri(resourceUri)
        });
      } catch (e) {
        // If the insertion of new data fails, inserts back old data
        newData = await ctx.call('ldp.resource.post', {
          resource: oldData,
          contentType: MIME_TYPES.JSON,
          containerUri,
          webId,
          slug : getSlugFromUri(oldData['@id'])
        });

        // ... then rethrows an error
        throw new MoleculerError('Could not put resource: ' + e.message, 400, 'BAD_REQUEST');
      }

      ctx.emit('ldp.resource.updated', {
        resourceUri,
        oldData,
        newData,
        webId
      });

      return resourceUri;
    }
  }
};
