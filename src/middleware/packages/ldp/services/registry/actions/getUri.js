const urlJoin = require('url-join');

/**
 * Get the container URI based on its path
 * In Pod provider config, the webId is required to find the Pod root
 */
module.exports = {
  visibility: 'public',
  params: {
    path: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { path, webId } = ctx.params;

    if (this.settings.podProvider) {
      const account = await ctx.call('auth.account.findByWebId', { webId });
      if (!account) throw new Error(`No account found with webId ${webId}`);
      return urlJoin(account.podUri, path);
    }
    return urlJoin(this.settings.baseUrl, path);
  }
};
