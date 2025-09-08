// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ActionSchema } from 'moleculer';
import { hasType } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    resource: { type: 'object', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: false; }' is not... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      resource = await this.actions.getNetwork({ resourceUri, webId }, { parentCtx: ctx });
    }

    // Do not store Tombstone (throw 404 error)
    if (hasType(resource, 'Tombstone')) {
      throw new E.NotFoundError();
    }

    if (!resourceUri) {
      resourceUri = resource.id || resource['@id'];
    }

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit(
        'ldp.remote.stored',
        { resourceUri, resource, dataset, keepInSync, webId },
        { meta: { webId: null, dataset } }
      );
    }

    return resource;
  }
} satisfies ActionSchema;

export default Schema;
