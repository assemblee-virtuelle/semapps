const { getAclUriFromResourceUri } = require('../../../utils');

module.exports = async function patch(ctx) {
  try {
    const { dataset, slugParts } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts);

    // TODO put the following code in webacl service, but first ensure webacl are activated
    const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, uri);

    ctx.meta.$statusCode = 200;
    ctx.meta.$statusMessage = 'OK';
    ctx.meta.$responseHeaders = {
      Link: `<${aclUri}>; rel="acl"`,
      'Content-Length': 0
    };
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
