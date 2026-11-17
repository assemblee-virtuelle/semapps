import type { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' },
    // The authorizers with the lowest priority are called first
    priority: { type: 'number', default: 10 }
  },
  async handler(ctx) {
    const { actionName, priority } = ctx.params;

    this.authorizers.push({ actionName, priority });
    this.authorizers.sort((a: any, b: any) => a.priority - b.priority);
  }
} satisfies ActionSchema;

export default Schema;
