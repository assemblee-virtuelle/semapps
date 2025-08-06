import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    const ontologies = await this.actions.list({}, { parentCtx: ctx });
    return Object.fromEntries(
      ontologies
        .sort((a: any, b: any) => (a.prefix < b.prefix ? -1 : a.prefix > b.prefix ? 1 : 0))
        .map((ontology: any) => [ontology.prefix, ontology.namespace])
    );
  }
});

export default Schema;
