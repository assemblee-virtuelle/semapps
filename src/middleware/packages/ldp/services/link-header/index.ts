import getAction from './actions/get.ts';
import registerAction from './actions/register.ts';

const LdpLinkHeaderSchema = {
  name: 'ldp.link-header',
  actions: {
    get: getAction,
    register: registerAction
  },
  async started() {
    this.registeredActionNames = [];
  }
};

export default LdpLinkHeaderSchema;
