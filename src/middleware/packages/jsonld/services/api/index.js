module.exports = {
  name: 'jsonld.api',
  settings: {
    localContextPath: null
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
      return await ctx.call('jsonld.context.getLocal');
    }
  }
};
