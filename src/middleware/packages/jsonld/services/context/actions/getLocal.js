const { isObject } = require('../../../utils');

module.exports = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    let context = [];

    const ontologies = await ctx.call('ontologies.list');

    for (const ontology of ontologies) {
      // Do not include in local contexts URIs we want to preserve explicitely
      if (ontology.preserveContextUri !== true) {
        if (!ontology.jsonldContext) {
          // If no context is defined for the ontology, simply add its prefix
          ontology.jsonldContext = { [ontology.prefix]: ontology.url };
        } else if (isObject(ontology.jsonldContext)) {
          // If the context is an object, ensure the prefix is included
          ontology.jsonldContext[ontology.prefix] = ontology.url;
        }

        context = [].concat(context, ontology.jsonldContext);
      }
    }

    context = await ctx.call('jsonld.context.parse', { context });

    return {
      '@context': context
    };
  }
};
