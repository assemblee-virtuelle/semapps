const { MIME_TYPES } = require('@semapps/mime-types');
const { waitForResource } = require('../../../utils');

/** @type {import('moleculer').ServiceActionsSchema} */
module.exports = {
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
    forceSemantic: { type: 'boolean', optional: true },
    aclVerified: { type: 'boolean', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, predicates = [], delayMs = 1000, maxTries = 30, webId = 'system', ...rest } = ctx.params;

    return await waitForResource(delayMs, predicates, maxTries, () =>
      ctx.call(
        'ldp.resource.get',
        {
          resourceUri: resourceUri,
          accept: MIME_TYPES.JSON,
          webId,
          ...rest
        },
        { meta: { $cache: false } }
      )
    );
  }
};
