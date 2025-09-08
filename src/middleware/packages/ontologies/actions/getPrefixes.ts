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
    return Object.fromEntries(
      ontologies
        .sort((a: any, b: any) => (a.prefix < b.prefix ? -1 : a.prefix > b.prefix ? 1 : 0))
        .map((ontology: any) => [ontology.prefix, ontology.namespace])
    );
  }
} satisfies ActionSchema;

export default Schema;
