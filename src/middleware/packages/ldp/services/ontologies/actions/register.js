const { isURL, arrayOf } = require('../../../utils');

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
    preserveContextUri: { type: 'boolean', default: false },
    overwrite: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    let { prefix, url, owl, jsonldContext, preserveContextUri, overwrite } = ctx.params;

    const ontology = await this.actions.getByPrefix({ prefix }, { parentCtx: ctx });

    if (preserveContextUri === true) {
      if (!jsonldContext || !arrayOf(jsonldContext).every(context => isURL(context))) {
        throw new Error('If preserveContextUri is true, jsonldContext must be one or more URI');
      }
    }

    // Check that jsonldContext doesn't conflict with existing context
    if (jsonldContext) {
      const existingContext = await ctx.call('jsonld.context.get');

      // Do not use the jsonld.context.merge action to avoid object properties being overwritten
      const newContext = [].concat(existingContext, jsonldContext);

      const isValid = await ctx.call('jsonld.context.validate', { context: newContext });

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
      await this._update(ctx, {
        '@id': ontology['@id'],
        url,
        owl,
        jsonldContext,
        preserveContextUri
      });
    } else {
      await this._create(ctx, {
        prefix,
        url,
        owl,
        jsonldContext,
        preserveContextUri
      });
    }

    await ctx.emit('ldp.ontologies.registered', {
      prefix,
      url,
      owl,
      jsonldContext,
      preserveContextUri
    });
  }
};
