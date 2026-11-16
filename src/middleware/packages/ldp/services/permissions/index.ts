import moleculer from 'moleculer';
const { defineAction } = moleculer;
import type { ServiceSchema } from 'moleculer';
import addUserAuthorizerAction from './actions/addUserAuthorizer.ts';
import addClientAuthorizerAction from './actions/addClientAuthorizer.ts';
import checkAction from './actions/check.ts';
import hasAction from './actions/has.ts';

const PermissionsSchema = {
  name: 'permissions' as const,
  actions: {
    addUserAuthorizer: addUserAuthorizerAction,
    addClientAuthorizer: addClientAuthorizerAction,
    check: checkAction,
    has: hasAction
  },
  async started() {
    this.userAuthorizers = [];
    this.clientAuthorizers = [];
  },
  methods: {
    async isUserAuthorized(ctx, { uri, type, mode, webId }) {
      // If no authorizers have been registered, assume user can access everything
      if (this.userAuthorizers.length === 0) return true;

      for (const authorizer of this.userAuthorizers) {
        // As soon as an authorizer returns true, stop here
        if ((await ctx.call(authorizer.actionName, { uri, type, mode, webId })) === true) return true;
      }

      return false;
    }
  }
} satisfies ServiceSchema;

export default PermissionsSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [PermissionsSchema.name]: typeof PermissionsSchema;
    }
  }
}
