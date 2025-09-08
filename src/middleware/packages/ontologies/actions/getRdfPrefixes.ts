import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
<<<<<<< HEAD
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
=======
>>>>>>> 2.0
    const ontologies = await this.actions.list({}, { parentCtx: ctx });
    return ontologies
      .sort((a: any, b: any) => (a.prefix < b.prefix ? -1 : a.prefix > b.prefix ? 1 : 0))
      .map((ontology: any) => `PREFIX ${ontology.prefix}: <${ontology.namespace}>`)
      .join('\n');
  }
} satisfies ActionSchema;

export default Schema;
