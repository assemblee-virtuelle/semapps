module.exports = {
  visibility: 'public',
  params: {},
  async handler(ctx) {
    const ontologies = await this.actions.list({}, { parentCtx: ctx });
    let context;

    for (const ontology of ontologies) {
      if (ontology.jsonldContext) {
        context = await ctx.call('jsonld.mergeContexts', { a: context, b: ontology.jsonldContext });
      } else {
        // If no context is defined for the ontology, simply add its prefix
        context = await ctx.call('jsonld.mergeContexts', { a: context, b: { [ontology.prefix]: ontology.url } });
      }
    }

    return context;
  }
};
