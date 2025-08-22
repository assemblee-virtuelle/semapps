import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    uri: { type: 'string' },
    type: { type: 'enum', values: ['resource', 'container', 'custom'], default: 'resource' },
    mode: { type: 'enum', values: ['acl:Read', 'acl:Write', 'acl:Append', 'acl:Control'], default: 'acl:Read' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { uri, type, mode } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    // If no authorizers have been registered, assume user can access everything
    if (this.authorizers.length === 0) return true;

    if (webId === 'system') return true;

    for (const authorizer of this.authorizers) {
      const result = await ctx.call(authorizer.actionName, { uri, type, mode, webId });

      // As soon as a guard returns true, stop here.
      if (result === true) return true;
    }

    // If no guards returned a positive
    return false;
  }
} satisfies ActionSchema;

export default Schema;
