import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' }
  },
  handler(ctx) {
    const { actionName } = ctx.params;
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    this.registeredActionNames.push(actionName);
  }
} satisfies ActionSchema;

export default Schema;
