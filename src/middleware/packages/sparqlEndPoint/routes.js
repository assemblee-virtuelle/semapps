const routeConfig = {
  path: '/sparql',
  // raw req body
  bodyParsers: {
    json: false,
    urlencoded: false
  },
  async onBeforeCall(ctx, route, req, res) {
    const bodyPromise = new Promise((resolve, reject) => {
      let data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        resolve(data.length > 0 ? data : undefined);
      });
    });

    const data = await bodyPromise;
    ctx.meta.body = data;
    ctx.meta.headers = req.headers;
    if (req.headers.accept === undefined || req.headers.accept.includes('*/*')) {
      ctx.meta.headers.accept = this.settings.defaultLdpAccept;
    }
  }
};

module.exports = [
  // Unsecured routes
  {
    authorization: false,
    authentication: true,
    mergeParams: true,
    aliases: {
      'GET /': 'sparqlEndpoint.query'
    },
    ...routeConfig
  }
];
