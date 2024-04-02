module.exports = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    let context = [];

    const ontologies = await ctx.call('ontologies.list');

    for (const ontology of ontologies) {
      // Do not include in local contexts URIs we want to preserve explicitely
      if (ontology.jsonldContext && ontology.preserveContextUri !== true) {
        context = [].concat(ontology.jsonldContext, context);
      }
    }

    const prefixes = Object.fromEntries(ontologies.map(ont => [ont.prefix, ont.namespace]));

    context = await ctx.call('jsonld.context.parse', {
      context: [...context, prefixes]
    });

    return {
      '@context': context
    };
  }
};
