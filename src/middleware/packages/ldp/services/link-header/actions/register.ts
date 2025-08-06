import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    actionName: { type: 'string' }
  },
  handler(ctx) {
    const { actionName } = ctx.params;
    this.registeredActionNames.push(actionName);
  }
});

export default Schema;
