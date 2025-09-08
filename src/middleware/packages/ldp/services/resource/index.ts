import { ServiceSchema, defineAction } from 'moleculer';
import awaitCreateCompleteAction from './actions/awaitCreateComplete.ts';
import getAction from './actions/get.ts';
import createAction from './actions/create.ts';
import patchAction from './actions/patch.ts';
import putAction from './actions/put.ts';
import deleteAction from './actions/delete.ts';
import existAction from './actions/exist.ts';
import generateIdAction from './actions/generateId.ts';
import getContainersAction from './actions/getContainers.ts';
import getTypesAction from './actions/getTypes.ts';
import uploadAction from './actions/upload.ts';
<<<<<<< HEAD
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
=======
>>>>>>> 2.0
import methods from './methods.ts';
import { getDatasetFromUri } from '../../utils.ts';

const LdpResourceSchema = {
  name: 'ldp.resource' as const,
  settings: {
    baseUrl: null,
    podProvider: false,
    mirrorGraphName: null,
    preferredViewForResource: null,
    binary: {
      maxSize: '50Mb'
    }
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
<<<<<<< HEAD
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    awaitCreateComplete: awaitCreateCompleteAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resource: ... Remove this comment to see the full error message
    create: createAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    delete: deleteAction,
    exist: existAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { containerU... Remove this comment to see the full error message
    generateId: generateIdAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    get: getAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    getContainers: getContainersAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    getTypes: getTypesAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    patch: patchAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resource: ... Remove this comment to see the full error message
    put: putAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
=======
    awaitCreateComplete: awaitCreateCompleteAction,
    create: createAction,
    delete: deleteAction,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ resourceUri: { type: "string"... Remove this comment to see the full error message
    exist: existAction,
    generateId: generateIdAction,
    get: getAction,
    getContainers: getContainersAction,
    getTypes: getTypesAction,
    patch: patchAction,
    put: putAction,
>>>>>>> 2.0
    upload: uploadAction
  },
  hooks: {
    before: {
      '*'(ctx) {
        // @ts-expect-error TS(2339): Property 'podProvider' does not exist on type 'str... Remove this comment to see the full error message
        if (this.settings.podProvider && !ctx.meta.dataset) {
          // If we have a pod provider, guess the dataset from the URI
          const uri =
            ctx.params.resourceUri || (ctx.params.resource && (ctx.params.resource.id || ctx.params.resource['@id']));
          // @ts-expect-error TS(2339): Property 'baseUrl' does not exist on type 'string ... Remove this comment to see the full error message
          if (uri && uri.startsWith(this.settings.baseUrl)) {
            ctx.meta.dataset = getDatasetFromUri(uri);
          }
        }
      }
    }
  },
  methods
} satisfies ServiceSchema;

export default LdpResourceSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpResourceSchema.name]: typeof LdpResourceSchema;
    }
  }
}
