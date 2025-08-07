import { ServiceSchema, defineAction } from 'moleculer';

const SolidAuthorizerSchema = {
  name: 'solid-authorizer' as const,
  dependencies: 'permissions',
  async started() {
    await this.broker.call('permissions.addAuthorizer', { actionName: `${this.name}.hasPermission`, priority: 1 });
  },
  actions: {
    hasPermission: defineAction({
      async handler(ctx) {
        const { uri, webId } = ctx.params;

        // The owner has access to all resources on their Pod
        if (uri.startsWith(`${webId}/`)) {
          return true;
        }

        return undefined;
      }
    })
  }
} satisfies ServiceSchema;

export default SolidAuthorizerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SolidAuthorizerSchema.name]: typeof SolidAuthorizerSchema;
    }
  }
}
