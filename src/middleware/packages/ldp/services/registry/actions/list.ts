import { ActionSchema } from 'moleculer';

const ListAction = {
  visibility: 'public',
  params: {
    isContainer: { type: 'boolean', optional: true }
  },
  handler(ctx) {
    const { isContainer } = ctx.params;

    if (isContainer === true) {
      return this.registrations.filter(r => r.isContainer);
    } else if (isContainer === false) {
      return this.registrations.filter(r => !r.isContainer);
    } else {
      return this.registrations;
    }
  }
} satisfies ActionSchema;

export default ListAction;
