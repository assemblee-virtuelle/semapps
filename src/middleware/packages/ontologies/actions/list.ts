import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  cache: true,
  handler() {
    // @ts-expect-error TS(2769): No overload matches this call.
    return Object.values(this.ontologies);
  }
});

export default Schema;
