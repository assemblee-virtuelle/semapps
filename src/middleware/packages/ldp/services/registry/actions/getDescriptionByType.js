const { MIME_TYPES } = require('@semapps/mime-types');

/**
 * Get the description for a resource type
 * Use the schema:knowsLanguage property of the webId to know which language to choose
 * Return null if no description is found for this resource type
 */
module.exports = {
  visibility: 'public',
  params: {
    type: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] },
    webId: { type: 'string' }
  },
  async handler(ctx) {
    const { type, webId } = ctx.params;

    const containerOptions = await this.actions.getByType({ type }, { parentCtx: ctx });

    if (containerOptions?.description) {
      const userData = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        webId
      });

      const userLocale = userData['schema:knowsLanguage'];

      return {
        label: containerOptions.description.labelMap?.[userLocale] || containerOptions?.description.labelMap?.en,
        labelPredicate: containerOptions.description.labelPredicate
      };
    } else {
      return {};
    }
  }
};
