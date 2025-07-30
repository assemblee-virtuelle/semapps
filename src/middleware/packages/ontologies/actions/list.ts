import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  cache: true,
  handler() {
    return Object.values(this.ontologies);
  }
});

export default Schema;
