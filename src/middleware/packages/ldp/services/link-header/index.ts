import getAction from './actions/get.ts';
import registerAction from './actions/register.ts';
import { ServiceSchema, defineAction } from 'moleculer';

const LdpLinkHeaderSchema = {
  name: 'ldp.link-header' as const,
  actions: {
    get: getAction,
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
