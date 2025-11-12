import { ActionSchema } from 'moleculer';
import { Registration } from '../../../types.ts';

const ListAction = {
  visibility: 'public',
  params: {
    isContainer: { type: 'boolean', optional: true }
  },
  handler(ctx) {
    const { isContainer } = ctx.params;

    if (isContainer === true) {
      return this.registrations.filter((r: Registration) => r.isContainer);
    } else if (isContainer === false) {
      return this.registrations.filter((r: Registration) => !r.isContainer);
    } else {
      return this.registrations;
    }
  }
} satisfies ActionSchema;

export default ListAction;
