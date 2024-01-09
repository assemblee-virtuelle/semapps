const { getAclUriFromResourceUri } = require('../../../utils');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      uri: { type: 'string', optional: false }
    },
    handler(ctx) {
      const { uri } = ctx.params;
      const link = getAclUriFromResourceUri(this.settings.baseUrl, uri);
      return {
        link,
        params: { rel: 'acl' }
      };
    }
  }
};
