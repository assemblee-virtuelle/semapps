import { ServiceSchema } from 'moleculer';
import storeAction from './actions/store.ts';
import deleteAction from './actions/delete.ts';
import getAction from './actions/get.ts';
import isBinaryAction from './actions/isBinary.ts';

const LdpBinaryService = {
  name: 'ldp.binary' as const,
  settings: {
    adapter: null
  },
  actions: {
    store: storeAction,
    delete: deleteAction,
    get: getAction,
    isBinary: isBinaryAction
  },
  async started() {
    await this.settings.adapter.init({ broker: this.broker });
  }
} satisfies ServiceSchema;

export default LdpBinaryService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpBinaryService.name]: typeof LdpBinaryService;
    }
  }
}
