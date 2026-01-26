import type { ActionSchema } from 'moleculer';
import type { Ontology } from '@semapps/ontologies';

const Schema = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    let context: any = [];

    let ontologies: Ontology[] = await ctx.call('ontologies.list');

    // Do not include ontologies which want to preserve their context URI
    ontologies = ontologies.filter((ont: any) => ont.preserveContextUri !== true);

    for (const ontology of ontologies) {
      if (ontology.jsonldContext) {
        context = [].concat(ontology.jsonldContext, context);
      }
    }

    const prefixes = Object.fromEntries(ontologies.map((ont: any) => [ont.prefix, ont.namespace]));

    context = await ctx.call('jsonld.context.parse', {
      context: [...context, prefixes]
    });

    return {
      '@context': context
    };
  }
} satisfies ActionSchema;

export default Schema;
