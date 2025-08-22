import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  handler() {
    return this.registeredContainers;
  }
} satisfies ActionSchema;

export default Schema;
