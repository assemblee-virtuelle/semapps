import type { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    uri: { type: 'string' },
    type: { type: 'enum', values: ['resource', 'container', 'custom'], default: 'resource' },
    mode: { type: 'enum', values: ['acl:Read', 'acl:Write', 'acl:Append', 'acl:Control'], default: 'acl:Read' },
    webId: { type: 'string', optional: true },
    clientId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { uri, type, mode } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (webId === 'system') return true;

    // An explicit webId doesn't mean the call is internal, so we only ignore the client if it is another user
    const clientId = ctx.params.clientId ?? (webId === (ctx.meta.webId || 'anon') ? ctx.meta.clientId : undefined);

    if (clientId && clientId !== webId) {
      for (const authorizer of this.clientAuthorizers) {
        const result = await ctx.call(authorizer.actionName, { uri, type, mode, webId, clientId });
        if (result !== true) return false;
      }

      if (!(await this.isUserAuthorized(ctx, { uri, type, mode, webId: clientId }))) return false;
    }

    return this.isUserAuthorized(ctx, { uri, type, mode, webId });
  }
} satisfies ActionSchema;

export default Schema;
