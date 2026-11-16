import type { ActionSchema } from 'moleculer';

/**
 * User authorizers can only grant rights: the first one returning true wins.
 * When an application acts on behalf of a user, they are called for both of them.
 */
const Schema = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' },
    // The authorizers with the lowest priority are called first
    priority: { type: 'number', default: 10 }
  },
  async handler(ctx) {
    const { actionName, priority } = ctx.params;

    this.userAuthorizers.push({ actionName, priority });
    this.userAuthorizers.sort((a: any, b: any) => a.priority - b.priority);
  }
} satisfies ActionSchema;

export default Schema;
