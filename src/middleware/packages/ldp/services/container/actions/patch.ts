import { defineAction } from 'moleculer';
import { isMirror } from '../../../utils.ts';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const checkTripleValidity = (triple: any, containerUri: any) => {
  if (triple.subject.value !== containerUri) {
    throw new MoleculerError(
      `The subject must be the container URI. Provided ${triple.subject.value}`,
      400,
      'BAD_REQUEST'
    );
  } else if (triple.predicate.value !== 'http://www.w3.org/ns/ldp#contains') {
    throw new MoleculerError(
      `The predicate must be "http://www.w3.org/ns/ldp#contains". Provided ${triple.predicate.value}`,
      400,
      'BAD_REQUEST'
    );
  }
};

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: {
      type: 'string'
    },
    // @ts-expect-error TS(2322): Type '{ type: "array"; optional: true; }' is not a... Remove this comment to see the full error message
    triplesToAdd: {
      type: 'array',
      optional: true
    },
    // @ts-expect-error TS(2322): Type '{ type: "array"; optional: true; }' is not a... Remove this comment to see the full error message
    triplesToRemove: {
      type: 'array',
      optional: true
    },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { containerUri, triplesToAdd, triplesToRemove } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const resourcesAdded = [];
    const resourcesRemoved = [];

    const containerExist = await ctx.call('ldp.container.exist', { containerUri });
    if (!containerExist) {
      throw new MoleculerError(`Cannot update content of non-existing container ${containerUri}`, 400, 'BAD_REQUEST');
    }

    if (!triplesToAdd && !triplesToRemove)
      throw new MoleculerError('No triples to add or to remove', 400, 'BAD_REQUEST');

    if (triplesToRemove) {
      await ctx.call('permissions.check', { uri: containerUri, type: 'container', mode: 'acl:Write', webId });
    } else {
      await ctx.call('permissions.check', { uri: containerUri, type: 'container', mode: 'acl:Append', webId });
    }

    if (triplesToAdd) {
      for (const triple of triplesToAdd) {
        checkTripleValidity(triple, containerUri);

        const resourceUri = triple.object.value;
        try {
          await ctx.call('ldp.container.attach', { containerUri, resourceUri, webId });
          resourcesAdded.push(resourceUri);
        } catch (e) {
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
          if (e.code === 404 && isMirror(resourceUri, this.settings.baseUrl)) {
            // We need to import the remote resource
            this.logger.info(`Importing ${resourceUri}...`);
            try {
              await ctx.call('ldp.remote.store', {
                resourceUri,
                keepInSync: true,
                mirrorGraph: true,
                webId
              });

              // Now if the import went well, we can retry the attach
              await ctx.call('ldp.container.attach', { containerUri, resourceUri, webId });
              resourcesAdded.push(resourceUri);
            } catch (e2) {
              // @ts-expect-error TS(18046): 'e2' is of type 'unknown'.
              this.logger.warn(`Error while importing ${resourceUri} : ${e2.message}`);
            }
          }
        }
      }
    }

    if (triplesToRemove) {
      for (const triple of triplesToRemove) {
        checkTripleValidity(triple, containerUri);

        const resourceUri = triple.object.value;
        try {
          await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId });

          // If the mirrored resource is not attached to any container anymore, it must be deleted.
          const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
          if (containers.length === 0 && isMirror(resourceUri, this.settings.baseUrl)) {
            await ctx.call('ldp.remote.delete', { resourceUri });
          }

          resourcesRemoved.push(resourceUri);
        } catch (e) {
          // Fail silently
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
          this.logger.warn(`Error when detaching ${resourceUri} from ${containerUri}: ${e.message}`);
        }
      }
    }
    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit(
        'ldp.container.patched',
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        { containerUri, resourcesAdded, resourcesRemoved, dataset: ctx.meta.dataset },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
});

export default Schema;
