import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    let context: any = [];

    const ontologies = await ctx.call('ontologies.list');

    for (const ontology of ontologies) {
      if (ontology.preserveContextUri === true) {
        // If we want to parse, we don't need a special merge operation
        context = context.concat(ontology.jsonldContext);
      }
    }

    const localContext = await this.actions.getLocal({}, { parentCtx: ctx });
    // Include the local context only if it is not empty
    if (Object.keys(localContext['@context']).length > 0) {
      context = context.concat(this.settings.localContextUri);
    }

    return context;
  }
});

export default Schema;
