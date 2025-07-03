import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
import { cleanUndefined } from '../../../utils.ts';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: {
      type: 'string'
    },
    slug: {
      type: 'string',
      optional: true
    },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    resource: {
      type: 'object',
      optional: true
    },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    file: {
      type: 'object',
      optional: true
    },
    contentType: {
      type: 'string',
      optional: true
    },
    webId: {
      type: 'string',
      optional: true
    },
    forcedResourceUri: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { resource, containerUri, slug, contentType, file, forcedResourceUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    let isContainer = false;
    let expandedResource;

    if (contentType && contentType !== MIME_TYPES.JSON)
      throw new Error(`The ldp.container.post action now only support JSON-LD. Provided: ${contentType}`);

    await ctx.call('permissions.check', { uri: containerUri, type: 'container', mode: 'acl:Append', webId });

    // Remove undefined values as this may cause problems
    resource = resource && cleanUndefined(resource);

    if (!file) {
      // Adds the default context, if it is missing
      if (!resource['@context']) {
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

    // The forcedResourceUri param allows Moleculer service to bypass URI generation
    // It is used by ActivityStreams collections to provide URIs like {actorUri}/inbox
    const resourceUri =
      forcedResourceUri || (await ctx.call('ldp.resource.generateId', { containerUri, slug, isContainer }));

    const containerExist = await ctx.call('ldp.container.exist', { containerUri });
    if (!containerExist) {
      throw new MoleculerError(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        `Cannot create resource in non-existing container ${containerUri} (webId ${webId} / dataset ${ctx.meta.dataset})`,
        400,
        'BAD_REQUEST'
      );
    }

    // We must add this first, so that the container's ACLs are taken into account
    // But this create race conditions, especially when testing, since uncreated resources are linked to containers
    // TODO Add temporary ACLs to the resource so that it can be created, then link it to the container ?
    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        INSERT DATA {
          <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>
        }
      `,
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

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit(
        'ldp.container.attached',
        {
          containerUri,
          resourceUri,
          fromContainerPost: true
        },
        { meta: { webId: null } }
      );
    }

    return resourceUri;
  }
});

export default Schema;
