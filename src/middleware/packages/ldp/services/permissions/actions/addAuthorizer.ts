import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' },
<<<<<<< HEAD
    // @ts-expect-error TS(2322): Type '{ type: "number"; default: number; }' is not... Remove this comment to see the full error message
=======
>>>>>>> 2.0
    priority: { type: 'number', default: 5 }
  },
  async handler(ctx) {
    const { actionName, priority } = ctx.params;

<<<<<<< HEAD
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    this.authorizers.push({ actionName, priority });

    // Re-order all authorizers by priority
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
=======
    this.authorizers.push({ actionName, priority });

    // Re-order all authorizers by priority
>>>>>>> 2.0
    this.authorizers.sort((a: any, b: any) => b.priority - a.priority);
  }
} satisfies ActionSchema;

export default Schema;
