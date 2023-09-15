const { getAclUriFromResourceUri } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri } = ctx.params;
    const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, containerUri);

    ctx.meta.$statusCode = 200;
    ctx.meta.$statusMessage = 'OK';
    ctx.meta.$responseHeaders = {
      Link: `<${aclUri}>; rel="acl"`,
      'Content-Length': 0
    };
  }
};
