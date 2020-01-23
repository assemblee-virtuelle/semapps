'use strict';

module.exports = {
  name: 'webid',
  dependencies: ['ldp'],
  settings: {
    usersContainer: null
  },
  actions: {
    /**
     * This should only be called after the user has been authenticated
     */
    async create(ctx) {
      const { nick, email, name, familyName, homepage } = ctx.params;

      await ctx.call('ldp.post', {
        containerUri: this.settings.usersContainer,
        slug: nick,
        '@context': { '@vocab': 'http://xmlns.com/foaf/0.1/' },
        '@type': 'Person',
        nick,
        email,
        name,
        familyName,
        homepage: homepage || ''
      });

      return ctx.meta.$responseHeaders.Location;
    },
    async view(ctx) {
      const webId = await this.getWebId(ctx);

      return await ctx.call('ldp.get', {
        resourceUri: webId
      });
    },
    async edit(ctx) {
      const { userId, ...body } = ctx.params;
      const webId = await this.getWebId(ctx);

      return await ctx.call('ldp.patch', {
        resourceUri: webId,
        ...body
      });
    }
  },
  methods: {
    async getWebId(ctx) {
      if (ctx.params.userId) {
        // If an userId is specified, use it to find the webId
        return this.settings.usersContainer + ctx.params.userId;
      } else {
        if (ctx.meta.tokenPayload.webId) {
          // If the webId is in the token
          return ctx.meta.tokenPayload.webId;
        } else {
          // Do a SPARQL request
        }
      }
    }
  }
};
