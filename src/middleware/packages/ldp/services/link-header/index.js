const getAction = require('./actions/get');
const registerAction = require('./actions/register');

module.exports = {
  name: 'ldp.link-header',
  actions: {
    get: getAction,
    register: registerAction
  },
  async started() {
    this.registeredActionNames = [];
  }
};
