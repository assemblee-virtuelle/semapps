import { waitForResource } from '../../../utils.ts';
import { defineAction } from 'moleculer';

/** @type {import('moleculer').ServiceActionsSchema} */
const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    predicates: { type: 'array', optional: true },
    delayMs: { type: 'number', optional: true },
    maxTries: { type: 'number', optional: true },

    // Optional get-action parameters
    webId: { type: 'string', optional: true },
    jsonContext: {
      type: 'multi',
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
