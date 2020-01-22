const routeConfig = {
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

module.exports = {
  unsecuredRoutes: {
    path: '/ldp',
    authorization: false,
    authentication: true,
    aliases: {
      'GET :typeURL': 'ldp.getByType',
      'GET :typeURL/:identifierURL': 'ldp.getResource',
      'POST :typeURL': 'ldp.post',
      'DELETE :typeURL/:identifierURL': 'ldp.delete',
      'PATCH :typeURL/:identifierURL': 'ldp.patch'
    },
    ...routeConfig
  }
};
