const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    // PATCH have to stay in same container and @id can't be different
    // TODO generate an error instead of overwriting the ID
    resource['@id'] = `${containerUri}/${id}`;

    try {
      await ctx.call('ldp.resource.patch', {
        resource,
        contentType: ctx.meta.headers['content-type'],
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
      resource: {
        type: 'object'
      },
      webId: {
        type: 'string',
        optional: true
      },
      contentType: {
        type: 'string'
      }
    },
    async handler(ctx) {
      let { resource, contentType, webId } = ctx.params;
      const resourceUri = resource.id || resource['@id'];
      const { queryDepth, jsonContext } = await ctx.call('ldp.getContainerOptions', { uri: resourceUri });

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        queryDepth
      });

      // Adds a default context, if it is missing
      if (contentType === MIME_TYPES.JSON) {
        resource = {
          '@context': jsonContext,
          ...resource
        };
      }

      const query = await this.buildDeleteQueryFromResource(resource);
      await ctx.call('triplestore.update', {
        query,
        webId
      });

      await ctx.call('triplestore.insert', {
        resource,
        contentType,
        webId
      });

      // Get the new data, with the same formatting as the old data
      const newData = await ctx.call(
        'ldp.resource.get',
        {
          resourceUri,
          accept: MIME_TYPES.JSON,
          queryDepth
        },
        { meta: { $cache: false } }
      );

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
