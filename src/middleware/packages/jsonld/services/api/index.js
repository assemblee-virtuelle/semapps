module.exports = {
  name: 'jsonld.api',
  settings: {
    localContextPath: null,
    /** Indicate that the context may be cached by the browser for the given amount of seconds. @default 21600 */
    cacheFor: 21600
  },
  dependencies: ['api'],
  async started() {
    await this.broker.call('api.addRoute', {
      route: {
        path: this.settings.localContextPath,
        name: `local-jsonld-context`,
        bodyParsers: {
          json: true
        },
        aliases: {
          'GET /': 'jsonld.api.getContext'
        }
      }
    });
  },
  actions: {
    async getContext(ctx) {
      ctx.meta.$responseType = 'application/ld+json';
      if (this.settings.cacheFor) {
        // Consider context fresh for `this.settings.cacheFor` seconds.
        ctx.meta.$responseHeaders = {
          ...ctx.meta.$responseHeaders,
          'Cache-Control': `public, max-age=${this.settings.cacheFor}`
        };
      }
      return await ctx.call('jsonld.context.getLocal');
    }
  }
};
