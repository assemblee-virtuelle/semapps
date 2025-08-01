import { ServiceSchema, defineAction } from 'moleculer';

// A acl:Write permission implicitly gives acl:Read and acl:Append permissions
const modeMapping = {
  'acl:Read': ['read', 'write'],
  'acl:Append': ['append', 'write'],
  'acl:Write': ['write'],
  'acl:Control': ['control']
};

const WebaclAuthorizerSchema = {
  name: 'webacl.authorizer' as const,
  dependencies: 'permissions',
  async started() {
    await this.broker.call('permissions.addAuthorizer', { actionName: `${this.name}.hasPermission` });
  },
  actions: {
    hasPermission: defineAction({
      async handler(ctx) {
        const { uri, type, mode, webId } = ctx.params;

        if (type === 'resource' || type === 'container') {
          const modesToCheck = modeMapping[mode];

          const rights = await ctx.call('webacl.resource.hasRights', {
            resourceUri: uri,
            webId,
            rights: Object.fromEntries(modesToCheck.map(m => [m, true]))
          });

          // Return true if there is at least one true value
          return Object.values(rights).some(r => r);
        }

        return undefined;
      }
    })
  }
} satisfies ServiceSchema;

export default WebaclAuthorizerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebaclAuthorizerSchema.name]: typeof WebaclAuthorizerSchema;
    }
  }
}
