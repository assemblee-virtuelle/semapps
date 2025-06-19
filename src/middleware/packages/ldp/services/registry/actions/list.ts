import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  handler() {
    return this.registeredContainers;
  }
});

export default Schema;
