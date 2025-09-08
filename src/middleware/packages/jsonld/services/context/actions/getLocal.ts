import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    let context = [];

    let ontologies = await ctx.call('ontologies.list');

    // Do not include ontologies which want to preserve their context URI
    ontologies = ontologies.filter(ont => ont.preserveContextUri !== true);

    for (const ontology of ontologies) {
      if (ontology.jsonldContext) {
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
});

export default Schema;
