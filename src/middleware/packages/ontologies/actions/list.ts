import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  cache: true,
  handler() {
    // @ts-expect-error TS(2769): No overload matches this call.
    return Object.values(this.ontologies);
  }
} satisfies ActionSchema;

export default Schema;
