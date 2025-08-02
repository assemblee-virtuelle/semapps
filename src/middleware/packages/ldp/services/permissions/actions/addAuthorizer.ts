import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    actionName: { type: 'string' },
    priority: { type: 'number', default: 5 }
  },
  async handler(ctx) {
    const { actionName, priority } = ctx.params;

    this.authorizers.push({ actionName, priority });

    // Re-order all authorizers by priority
    this.authorizers.sort((a: any, b: any) => b.priority - a.priority);
  }
});

export default Schema;
