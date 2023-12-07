const { isObject } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    parse: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    const { parse } = ctx.params;
    let context = [];

    const ontologies = await ctx.call('ldp.ontologies.list');

    // Merge contexts
    for (const ontology of ontologies) {
      if (!ontology.jsonldContext) {
        // If no context is defined for the ontology, simply add its prefix
        ontology.jsonldContext = { [ontology.prefix]: ontology.url };
      } else if (isObject(ontology.jsonldContext)) {
        // If the context is an object, ensure the prefix is included
        ontology.jsonldContext[ontology.prefix] = ontology.url;
      }

      if (parse) {
        // If we want to parse, we don't need a special merge operation
        context = [].concat(context, ontology.jsonldContext);
      } else {
        // Merge objects together, keep URIs distinct
        context = await ctx.call('jsonld.context.merge', { a: context, b: ontology.jsonldContext });
      }
    }

    if (parse) {
      context = await ctx.call('jsonld.context.parse', { context });
    }

    return context;
  }
};
