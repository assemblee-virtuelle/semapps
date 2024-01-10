const LinkHeader = require('http-link-header');

module.exports = {
  visibility: 'public',
  params: {
    uri: { type: 'string' }
  },
  async handler(ctx) {
    const { uri } = ctx.params;
    const link = new LinkHeader();

    for (const actionName of this.registeredActionNames) {
      const params = await ctx.call(actionName, { uri });

      if (!params.uri) throw new Error(`An uri should be returned from the ${actionName} action`);

      link.set(params);
    }

    return link.toString();
  }
};
