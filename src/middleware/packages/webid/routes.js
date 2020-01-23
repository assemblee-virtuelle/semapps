module.exports = {
  authorization: true,
  authentication: false,
  aliases: {
    'GET me': 'webid.view',
    'PATCH me': 'webid.edit',
    'GET users/:userId': 'webid.view'
  },
  // When using multiple routes we must set the body parser for each route.
  bodyParsers: {
    json: true
  },
  onBeforeCall(ctx, route, req, res) {
    // Set request headers to context meta
    ctx.meta.headers = req.headers;
    if (req.headers.accept === undefined || req.headers.accept.includes('*/*')) {
      ctx.meta.headers.accept = this.settings.defaultLdpAccept;
    }
  }
};
