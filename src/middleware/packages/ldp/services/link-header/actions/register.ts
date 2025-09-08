import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' }
  },
  handler(ctx) {
    const { actionName } = ctx.params;
    this.registeredActionNames.push(actionName);
  }
} satisfies ActionSchema;

export default Schema;
