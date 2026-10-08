import moleculer from 'moleculer';
const { defineAction } = moleculer;
import type { ServiceSchema } from 'moleculer';
import attachAction from './actions/attach.ts';
import clearAction from './actions/clear.ts';
import createAction from './actions/create.ts';
import createAndAttachAction from './actions/createAndAttach.ts';
import deleteAction from './actions/delete.ts';
import detachAction from './actions/detach.ts';
import existAction from './actions/exist.ts';
import isEmptyAction from './actions/isEmpty.ts';
import getAction from './actions/get.ts';
import getAllAction from './actions/getAll.ts';
import getPathAction from './actions/getPath.ts';
import getUrisAction from './actions/getUris.ts';
import includesAction from './actions/includes.ts';
import postAction from './actions/post.ts';
import patchAction from './actions/patch.ts';
import countAction from './actions/count.ts';
import {
  getDatasetFromUri,
  arrayOf,
  buildFiltersQuery,
  buildSearchQuery,
  buildNearQuery,
  isValidIri
} from '../../utils.ts';

const { Errors } = moleculer;
const { MoleculerError } = Errors;

const LdpContainerSchema = {
  name: 'ldp.container' as const,
  settings: {
    baseUrl: null,
    podProvider: false,
    mirrorGraphName: null
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    attach: attachAction,
    count: countAction,
    clear: clearAction,
    create: createAction,
    createAndAttach: createAndAttachAction,
    delete: deleteAction,
    detach: detachAction,
    exist: existAction,
    get: getAction,
    getAll: getAllAction,
    getPath: getPathAction,
    getUris: getUrisAction,
    includes: includesAction,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ containerUri: { type: "string... Remove this comment to see the full error message
    isEmpty: isEmptyAction,
    post: postAction,
    patch: patchAction
  },
  methods: {
    // Build the SPARQL query filtering the resources (?s1) with the resourcesFiltersParams
    async buildResourcesFiltersQuery(ctx: any) {
      const { filters, search, searchPredicates, near } = ctx.params;

      let searchPredicatesUris: string[] | undefined;
      if (search && searchPredicates) {
        searchPredicatesUris = await Promise.all(
          arrayOf(searchPredicates).map(predicate => ctx.call('jsonld.parser.expandPredicate', { predicate }))
        );
        // The predicates may come from the query string, so make sure they cannot be used for SPARQL injection
        if (!searchPredicatesUris!.every(isValidIri)) {
          throw new MoleculerError('Invalid search predicate', 400, 'BAD_REQUEST');
        }
      }

      return `
        ${buildFiltersQuery(filters).where}
        ${buildSearchQuery(search, searchPredicatesUris)}
        ${buildNearQuery(near)}
      `;
    }
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (
          // @ts-expect-error TS(2339): Property 'podProvider' does not exist on type 'str... Remove this comment to see the full error message
          this.settings.podProvider &&
          !ctx.meta.dataset &&
          ctx.params.containerUri &&
          // @ts-expect-error TS(2339): Property 'baseUrl' does not exist on type 'string ... Remove this comment to see the full error message
          ctx.params.containerUri.startsWith(this.settings.baseUrl)
        ) {
          // this.logger.warn(`No dataset found when calling ${ctx.action.name} with URI ${ctx.params.containerUri}`);
          ctx.meta.dataset = getDatasetFromUri(ctx.params.containerUri);
        }
      }
    }
  }
} satisfies ServiceSchema;

export default LdpContainerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpContainerSchema.name]: typeof LdpContainerSchema;
    }
  }
}
