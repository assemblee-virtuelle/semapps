const urlJoin = require('url-join');
const { getAclUriFromResourceUri } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id } = ctx.params;
    const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, urlJoin(containerUri, id));

    ctx.meta.$statusCode = 200;
    ctx.meta.$statusMessage = 'OK';
    ctx.meta.$responseHeaders = {
      Link: `<${aclUri}>; rel="acl"`,
      'Content-Length': 0,
    };
  },
};
