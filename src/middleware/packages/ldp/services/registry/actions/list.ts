<<<<<<< HEAD
export const visibility = 'public';
=======
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  handler() {
    return this.registeredContainers;
  }
} satisfies ActionSchema;

export default Schema;
>>>>>>> 2.0
