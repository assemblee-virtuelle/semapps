type Check = { uri: string; type: 'resource' | 'container'; mode: string } | undefined;

const getResourceUri = (params: any) => params.resourceUri || params.resource?.id || params.resource?.['@id'];

const checks: Record<string, (params: any) => Check> = {
  'ldp.resource.get': params => ({ uri: getResourceUri(params), type: 'resource', mode: 'acl:Read' }),
  'ldp.resource.put': params => ({ uri: getResourceUri(params), type: 'resource', mode: 'acl:Write' }),
  'ldp.resource.patch': params => ({
    uri: params.resourceUri,
    type: 'resource',
    mode: params.triplesToRemove?.length > 0 ? 'acl:Write' : 'acl:Append'
  }),
  'ldp.resource.delete': params => ({ uri: params.resourceUri, type: 'resource', mode: 'acl:Write' }),
  'ldp.container.post': params => ({ uri: params.containerUri, type: 'container', mode: 'acl:Append' }),
  'ldp.container.patch': params => ({
    uri: params.containerUri,
    type: 'container',
    mode: params.triplesToRemove?.length > 0 ? 'acl:Write' : 'acl:Append'
  })
};

/**
 * Check the permissions before the LDP actions are called, so that cached results are also checked.
 * Must be registered after the cacher middleware.
 */
const PermissionsMiddleware = () => ({
  name: 'PermissionsMiddleware',
  localAction: (next: any, action: any) => {
    const getCheck = checks[action.name];
    if (!getCheck) return next;

    return async (ctx: any) => {
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';
      if (webId === 'system') {
        if (action.name === 'ldp.resource.get') ctx.params.aclVerified = true;
        return next(ctx);
      }

      const { uri, type, mode } = getCheck(ctx.params)!;

      // Remote resources are not protected by the authorizers
      if (await ctx.call('ldp.remote.isRemote', { resourceUri: uri })) {
        // WebACL are not activated in the mirror graph
        if (
          action.name === 'ldp.resource.get' &&
          (await ctx.call('ldp.remote.getGraph', { resourceUri: uri })) === 'http://semapps.org/mirror'
        ) {
          ctx.params.aclVerified = true;
        }
        return next(ctx);
      }

      await ctx.call('permissions.check', { uri, type, mode, webId });

      // The triplestore can then be queried without checking the permissions again
      if (action.name === 'ldp.resource.get') ctx.params.aclVerified = true;

      return next(ctx);
    };
  }
});

export default PermissionsMiddleware;
