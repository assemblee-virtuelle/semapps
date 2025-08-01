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
import methods from './methods.ts';
import { getDatasetFromUri } from '../../utils.ts';
import { ServiceSchema, defineAction } from 'moleculer';

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
    awaitCreateComplete: awaitCreateCompleteAction,
    create: createAction,
    delete: deleteAction,
    exist: existAction,
    generateId: generateIdAction,
    get: getAction,
    getContainers: getContainersAction,
    getTypes: getTypesAction,
    patch: patchAction,
    put: putAction,
    upload: uploadAction
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider && !ctx.meta.dataset) {
          // If we have a pod provider, guess the dataset from the URI
          const uri =
            ctx.params.resourceUri || (ctx.params.resource && (ctx.params.resource.id || ctx.params.resource['@id']));
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
