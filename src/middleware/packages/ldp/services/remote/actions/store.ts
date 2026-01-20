// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ActionSchema } from 'moleculer';
import { getSlugFromUri, hasType } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: true },
    resource: { type: 'object', optional: true },
    keepInSync: { type: 'boolean', default: false },
    webId: { type: 'string', optional: true },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { resourceUri, resource, keepInSync } = ctx.params;
    let dataset = ctx.params.dataset || ctx.meta.dataset;

    if (!resource && !resourceUri) {
      throw new Error('You must provide the resourceUri or resource param');
    }

    if (!resource) {
      const webId = await ctx.call('webid.getUri');
      resource = await this.actions.getNetwork({ resourceUri, webId }, { parentCtx: ctx });
    }

    if (ctx.params.webId || ctx.params.dataset) {
      this.logger.warn(`The webId and dataset params are deprecated for ldp.remote.store`, resource);
    }

    // Do not store Tombstone (throw 404 error)
    if (hasType(resource, 'Tombstone')) {
      throw new E.NotFoundError();
    }

    if (!resourceUri) {
      resourceUri = resource.id || resource['@id'];
    }

    if (!(await this.actions.isRemote({ resourceUri, dataset }, { parentCtx: ctx }))) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (dataset ${dataset}))`);
    }

    // Adds the default context, if it is missing
    if (!resource['@context']) {
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        ...resource
      };
    }

    let namedGraphUri = getSlugFromUri(resourceUri);

    // Check if the remote resource is already stored
    const exist = await ctx.call('triplestore.named-graph.exist', { uri: namedGraphUri, dataset });

    if (!exist) {
      namedGraphUri = await ctx.call('triplestore.named-graph.create', { dataset });
    } else {
      await ctx.call('triplestore.named-graph.clear', { uri: namedGraphUri, dataset });
    }

    if (keepInSync) {
      resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;
    }

    await ctx.call('triplestore.insert', {
      resource: resource,
      graphName: namedGraphUri,
      webId: 'system',
      dataset
    });

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.remote.stored', { resourceUri, resource, dataset, keepInSync });
    }

    return resource;
  }
} satisfies ActionSchema;

export default Schema;
