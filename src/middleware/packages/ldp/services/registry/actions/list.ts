import { ActionSchema } from 'moleculer';

const ListAction = {
  visibility: 'public',
  handler() {
    return this.registrations;
  }
} satisfies ActionSchema;

export default ListAction;
