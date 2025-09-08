import { Errors as E } from 'moleculer-web';
import { hasType } from '../../../utils.ts';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: true },
    resource: { type: 'object', optional: true },
    keepInSync: { type: 'boolean', default: false },
    webId: { type: 'string', optional: true },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { resourceUri, resource, keepInSync, webId, dataset } = ctx.params;

    if (!resource && !resourceUri) {
      throw new Error('You must provide the resourceUri or resource param');
    }

    if (!resource) {
      resource = await this.actions.getNetwork({ resourceUri, webId }, { parentCtx: ctx });
    }

    // Do not store Tombstone (throw 404 error)
    if (hasType(resource, 'Tombstone')) {
      throw new E.NotFoundError();
    }

    if (!resourceUri) {
      resourceUri = resource.id || resource['@id'];
    }

    if (!(await this.actions.isRemote({ resourceUri, dataset }, { parentCtx: ctx }))) {
      throw new Error(
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${dataset}))`
      );
    }

    // Adds the default context, if it is missing
    if (!resource['@context']) {
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        ...resource
      };
    }

    if (!dataset && this.settings.podProvider) {
      if (!webId) {
        throw new Error(`In Pod provider config, a webId or dataset param must be provided to ldp.remote.store`);
      }
      const account = await ctx.call('auth.account.findByWebId', { webId });
      dataset = account.username;
    }

    // Check if the remote resource is already stored
    const exist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri, dataset });

    if (!exist) {
      await ctx.call('triplestore.document.create', { documentUri: resourceUri, dataset });
    } else {
      await ctx.call('triplestore.document.clear', { documentUri: resourceUri, dataset });
    }

    if (keepInSync) {
      resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;
    }

    await ctx.call('triplestore.insert', {
      resource: resource,
      graphName: resourceUri,
      webId: 'system',
      dataset
    });

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit(
        'ldp.remote.stored',
        { resourceUri, resource, dataset, keepInSync, webId },
        { meta: { webId: null, dataset } }
      );
    }

    return resource;
  }
});

export default Schema;
