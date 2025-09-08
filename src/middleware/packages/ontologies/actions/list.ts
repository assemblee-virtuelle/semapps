import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  cache: true,
  handler() {
<<<<<<< HEAD
    // @ts-expect-error TS(2769): No overload matches this call.
=======
>>>>>>> 2.0
    return Object.values(this.ontologies);
  }
} satisfies ActionSchema;

export default Schema;
