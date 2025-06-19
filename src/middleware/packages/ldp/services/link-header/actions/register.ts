import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    actionName: { type: 'string' }
  },
  handler(ctx) {
    const { actionName } = ctx.params;
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    this.registeredActionNames.push(actionName);
  }
});

export default Schema;
