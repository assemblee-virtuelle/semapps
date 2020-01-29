'use strict';

module.exports = {
  name: 'webid',
  dependencies: ['ldp', 'triplestore'],
  settings: {
    usersContainer: null
  },
  actions: {
    /**
     * This should only be called after the user has been authenticated
     */
    async create(ctx) {
      let { email, nick, name, familyName, homepage } = ctx.params;

      if (!email) throw new Error('Unable to create profile, email parameter is missing');
      if (!nick) nick = email.split('@')[0];

      // Check if an user already exist with this email address
      let webId = await this.findUserByEmail(ctx, email);

      // If no user exist, create one
      if (!webId) {
        const userData = {
          nick,
          email,
          name,
          familyName,
          homepage
        };

        await ctx.call('ldp.post', {
          containerUri: this.settings.usersContainer,
          slug: nick,
          '@context': { '@vocab': 'http://xmlns.com/foaf/0.1/' },
          '@type': 'Person',
          ...userData
        });

        webId = ctx.meta.$responseHeaders.Location;

        ctx.emit('webid.created', { webId, userData });
      }

      return webId;
    },
    async view(ctx) {
      const webId = await this.getWebId(ctx);

      if (webId) {
        return await ctx.call('ldp.get', {
          resourceUri: webId
        });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async edit(ctx) {
      const { userId, ...body } = ctx.params;
      const webId = await this.getWebId(ctx);

      return await ctx.call('ldp.patch', {
        resourceUri: webId,
        ...body
      });
    },
    getUsersContainer(ctx) {
      return this.settings.usersContainer;
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
          // Find the webId by the user's email address
          return this.findUserByEmail(ctx, ctx.meta.tokenPayload.email);
        }
      }
    },
    async findUserByEmail(ctx, email) {
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT ?webId
          WHERE {
            ?webId rdf:type foaf:Person ;
                   foaf:email "${email}" .
          }
        `,
        accept: 'json'
      });

      return results.length > 0 ? results[0].webId.value : null;
    }
  }
};
