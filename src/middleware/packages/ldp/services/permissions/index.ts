const addAuthorizerAction = require('./actions/addAuthorizer');
const checkAction = require('./actions/check');
const hasAction = require('./actions/has');

module.exports = {
  name: 'permissions',
  actions: {
    addAuthorizer: addAuthorizerAction,
    check: checkAction,
    has: hasAction
  },
  async started() {
    this.authorizers = [];
  }
};
