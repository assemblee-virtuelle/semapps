import { ContextParser } from 'jsonld-context-parser';
import { ServiceSchema, defineAction } from 'moleculer';
import getAction from './actions/get.ts';
import getLocalAction from './actions/getLocal.ts';
import mergeAction from './actions/merge.ts';
import parseAction from './actions/parse.ts';
import validateAction from './actions/validate.ts';

const JsonldContextSchema = {
  name: 'jsonld.context' as const,
  settings: {
    localContextUri: null
  },
  dependencies: ['jsonld.document-loader'],
  async started() {
    this.contextParser = new ContextParser({
      documentLoader: {
        load: async url => {
          const result = await this.broker
            .call('jsonld.document-loader.loadWithCache', { url })
            .then(context => context.document);

          // Manually clear the contextParser inner cache as we don't want to use it
          // See https://github.com/rubensworks/jsonld-context-parser.js/issues/75
          this.contextParser.documentCache = {};

          return result;
        }
      }
    });
  },
  actions: {
    get: getAction,
    getLocal: getLocalAction,
<<<<<<< HEAD
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { a: { type:... Remove this comment to see the full error message
    merge: mergeAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { context: {... Remove this comment to see the full error message
    parse: parseAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { context: {... Remove this comment to see the full error message
=======
    merge: mergeAction,
    parse: parseAction,
>>>>>>> 2.0
    validate: validateAction
  }
} satisfies ServiceSchema;

export default JsonldContextSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [JsonldContextSchema.name]: typeof JsonldContextSchema;
    }
  }
}
