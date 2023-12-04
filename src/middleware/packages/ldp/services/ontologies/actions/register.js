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

    let ontology;

    try {
      ontology = await this.actions.getOne({ prefix, url }, { parentCtx: ctx });
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }

    // Check that jsonldContext doesn't conflict with existing context
    if (jsonldContext) {
      const existingContext = await this.actions.getJsonLdContext({}, { parentCtx: ctx });
      let newContext;

      if (Array.isArray(existingContext)) {
        newContext = [...existingContext, jsonldContext];
      } else if (
        (typeof jsonldContext === 'string' || jsonldContext instanceof String) &&
        jsonldContext.startsWith('http')
      ) {
        newContext = [existingContext, jsonldContext];
      } else {
        newContext = {
          ...existingContext,
          ...jsonldContext
        };
      }
    }

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
