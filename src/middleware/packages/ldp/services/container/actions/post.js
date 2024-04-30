const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: {
      type: 'string'
    },
    slug: {
      type: 'string',
      optional: true
    },
    resource: {
      type: 'object',
      optional: true
    },
    file: {
      type: 'object',
      optional: true
    },
    contentType: {
      type: 'string'
    },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { resource, containerUri, slug, contentType, file } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    let isContainer = false;
    let expandedResource;

    if (!file) {
      // Adds the default context, if it is missing
      if (contentType === MIME_TYPES.JSON && !resource['@context']) {
        resource = {
          '@context': await ctx.call('jsonld.context.get'),
          ...resource
        };
      }

      [expandedResource] = await ctx.call('jsonld.parser.expand', { input: resource });
      if (!expandedResource['@type']) {
        throw new MoleculerError('The resource must have a type', 400, 'BAD_REQUEST');
      }
      isContainer = expandedResource['@type'].includes('http://www.w3.org/ns/ldp#Container');

      if (isContainer) {
        if (
          expandedResource['@type'].includes('http://www.w3.org/ns/ldp#DirectContainer') ||
          expandedResource['@type'].includes('http://www.w3.org/ns/ldp#IndirectContainer')
        ) {
          throw new MoleculerError('Only LDP Basic Containers can be created on this server');
        }
      }
    }

    // The forcedResourceUri meta allows Moleculer service to bypass URI generation
    // It is used by ActivityStreams collections to provide URIs like {actorUri}/inbox
    const resourceUri =
      ctx.meta.forcedResourceUri || (await ctx.call('ldp.resource.generateId', { containerUri, slug, isContainer }));

    const containerExist = await ctx.call('ldp.container.exist', { containerUri, webId });
    if (!containerExist) {
      throw new MoleculerError(`Cannot create resource in non-existing container ${containerUri}`, 400, 'BAD_REQUEST');
    }

    // We must add this first, so that the container's ACLs are taken into account
    // But this create race conditions, especially when testing, since uncreated resources are linked to containers
    // TODO Add temporary ACLs to the resource so that it can be created, then link it to the container ?
    await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`,
      webId
    });

    try {
      if (file) {
        resource = await ctx.call('ldp.resource.upload', { resourceUri, file });
      }

      if (isContainer) {
        await ctx.call('ldp.container.create', {
          containerUri: resourceUri,
          title: expandedResource['http://purl.org/dc/terms/title']?.[0]['@value'],
          description: expandedResource['http://purl.org/dc/terms/description']?.[0]['@value'],
          webId
        });
      } else {
        const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });
        await ctx.call(controlledActions.create || 'ldp.resource.create', {
          resource: {
            '@id': resourceUri,
            ...resource
          },
          contentType,
          webId
        });
      }
    } catch (e) {
      // If there was an error inserting the resource, detach it from the container
      await ctx.call('triplestore.update', {
        query: `DELETE WHERE { <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> }`,
        webId
      });

      // Re-throw the error so that it's displayed by the API function
      throw e;
    }

    ctx.emit(
      'ldp.container.attached',
      {
        containerUri,
        resourceUri,
        fromContainerPost: true
      },
      { meta: { webId: null } }
    );

    return resourceUri;
  }
};
