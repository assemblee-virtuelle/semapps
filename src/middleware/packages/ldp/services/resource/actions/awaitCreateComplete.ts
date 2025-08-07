import { defineAction } from 'moleculer';
import { waitForResource } from '../../../utils.ts';

/** @type {import('moleculer').ServiceActionsSchema} */
const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    // @ts-expect-error TS(2322): Type '{ type: "array"; optional: true; }' is not a... Remove this comment to see the full error message
    predicates: { type: 'array', optional: true },
    delayMs: { type: 'number', optional: true },
    maxTries: { type: 'number', optional: true },

    // Optional get-action parameters
    webId: { type: 'string', optional: true },
    jsonContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    forceSemantic: { type: 'boolean', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, predicates = [], delayMs = 1000, maxTries = 30, webId = 'system', ...rest } = ctx.params;

    return await waitForResource(delayMs, predicates, maxTries, () =>
      ctx.call(
        'ldp.resource.get',
        {
          resourceUri: resourceUri,
          webId,
          ...rest
        },
        { meta: { $cache: false } }
      )
    );
  }
});

export default Schema;
