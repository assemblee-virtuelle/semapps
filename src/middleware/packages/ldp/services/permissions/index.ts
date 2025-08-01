import addAuthorizerAction from './actions/addAuthorizer.ts';
import checkAction from './actions/check.ts';
import hasAction from './actions/has.ts';

const PermissionsSchema = {
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

export default PermissionsSchema;
