import type { ActionSchema } from 'moleculer';

/**
 * Client authorizers are called when an application acts on behalf of a user.
 * They can only restrict rights: all of them must return true (e.g. the application is registered by the user)
 */
const Schema = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' }
  },
  async handler(ctx) {
    this.clientAuthorizers.push({ actionName: ctx.params.actionName });
  }
} satisfies ActionSchema;

export default Schema;
