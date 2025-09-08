import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  cache: true,
  handler() {
    return Object.values(this.ontologies);
  }
} satisfies ActionSchema;

export default Schema;
