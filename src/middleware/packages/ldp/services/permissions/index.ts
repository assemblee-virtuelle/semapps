import { ServiceSchema, defineAction } from 'moleculer';
import addAuthorizerAction from './actions/addAuthorizer.ts';
import checkAction from './actions/check.ts';
import hasAction from './actions/has.ts';

const PermissionsSchema = {
  name: 'permissions' as const,
  actions: {
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ actionName: { type: "string";... Remove this comment to see the full error message
    addAuthorizer: addAuthorizerAction,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ uri: { type: "string"; }; typ... Remove this comment to see the full error message
    check: checkAction,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ uri: { type: "string"; }; typ... Remove this comment to see the full error message
    has: hasAction
  },
  async started() {
    this.authorizers = [];
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
