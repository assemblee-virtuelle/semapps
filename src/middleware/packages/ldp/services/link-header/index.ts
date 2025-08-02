import { ServiceSchema, defineAction } from 'moleculer';
import getAction from './actions/get.ts';
import registerAction from './actions/register.ts';

const LdpLinkHeaderSchema = {
  name: 'ldp.link-header' as const,
  actions: {
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ uri: { type: "string"; }; }, ... Remove this comment to see the full error message
    get: getAction,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ actionName: { type: "string";... Remove this comment to see the full error message
    register: registerAction
  },
  async started() {
    this.registeredActionNames = [];
  }
} satisfies ServiceSchema;

export default LdpLinkHeaderSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpLinkHeaderSchema.name]: typeof LdpLinkHeaderSchema;
    }
  }
}
