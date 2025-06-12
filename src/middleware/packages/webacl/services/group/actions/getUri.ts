const urlJoin = require('url-join');

module.exports = {
  action: {
    visibility: 'public',
    params: {
      groupSlug: { type: 'string', optional: false, trim: true }
    },
    async handler(ctx) {
      const { groupSlug } = ctx.params;
      return urlJoin(this.settings.baseUrl, '_groups', groupSlug);
    }
  }
};
