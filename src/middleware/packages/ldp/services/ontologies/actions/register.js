module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string',
    url: 'string',
    owl: { type: 'string', optional: true },
    jsonldContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    overwrite: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    let { prefix, url, owl, jsonldContext, overwrite } = ctx.params;

    const ontology = await this.actions.getByPrefix({ prefix, url }, { parentCtx: ctx });

    // Check that jsonldContext doesn't conflict with existing context
    if (jsonldContext) {
      const existingContext = await this.actions.getJsonLdContext({}, { parentCtx: ctx });

      // We do not use jsonld.mergeContexts because we don't want object properties to be overwritten
      const newContext = Array.isArray(existingContext)
        ? [...existingContext, jsonldContext]
        : [existingContext, jsonldContext];

      const isValid = await ctx.call('jsonld.validate', { context: newContext });

      if (!isValid) throw new Error('The ontology JSON-LD context is in conflict with the existing JSON-LD context');
    }

    // Stringify JSON-LD context if it is not an URL
    if (typeof jsonldContext !== 'string' && !(jsonldContext instanceof String)) {
      jsonldContext = JSON.stringify(jsonldContext);
    }

    if (!overwrite && ontology) {
      throw new Error('An ontology with this prefix or URL is already registered');
    }

    if (ontology) {
      return await this._update(ctx, {
        '@id': ontology['@id'],
        url,
        owl,
        jsonldContext
      });
    } else {
      return await this._create(ctx, {
        prefix,
        url,
        owl,
        jsonldContext
      });
    }
  }
};
