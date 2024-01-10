const { getAclUriFromResourceUri } = require('../../../utils');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      uri: { type: 'string', optional: false }
    },
    handler(ctx) {
      const { uri } = ctx.params;
      return {
        uri: getAclUriFromResourceUri(this.settings.baseUrl, uri),
        rel: 'acl'
      };
    }
  }
};
