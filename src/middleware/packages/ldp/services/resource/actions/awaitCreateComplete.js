const { waitForResource } = require('../../../utils');

/** @type {import('moleculer').ServiceActionsSchema} */
module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    predicates: { type: 'array', optional: true },
    delayMs: { type: 'number', optional: true },
    maxTries: { type: 'number', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, predicates = [], delayMs = 1000, maxTries = 30 } = ctx.params;

    return await waitForResource(
      delayMs,
      predicates,
      maxTries,
      async () =>
        (object = await ctx.call(
          'ldp.resource.get',
          {
            resourceUri: resourceUri,
            accept: MIME_TYPES.JSON,
            webId: 'system'
          },
          { meta: { $cache: false } }
        ))
    );
  }
};
