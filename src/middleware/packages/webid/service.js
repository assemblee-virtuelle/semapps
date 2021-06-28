const { MIME_TYPES } = require('@semapps/mime-types');
const getRoutes = require('./getRoutes');

const WebIdService = {
  name: 'webid',
  settings: {
    usersContainer: null,
    context: {
      foaf: 'http://xmlns.com/foaf/0.1/'
    },
    defaultAccept: 'text/turtle'
  },
  dependencies: ['ldp.resource', 'triplestore', 'api'],
  async started() {
    const routes = getRoutes();
    for (let route of routes) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    /**
     * This should only be called after the user has been authenticated
     */
    async create(ctx) {
      let { email, nick, name, familyName, homepage } = ctx.params;

      if (!email) {
        throw new Error('The email field is required for webId profile creation');
      }

      if (!nick && email) {
        nick = email.split('@')[0].toLowerCase();
      }

      const webId = await ctx.call('ldp.resource.post', {
        resource: {
          '@context': {
            '@vocab': 'http://xmlns.com/foaf/0.1/'
          },
          '@type': 'Person',
          nick,
          email,
          name,
          familyName,
          homepage
        },
        slug: nick,
        containerUri: this.settings.usersContainer,
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });

      let newPerson = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        jsonContext: this.settings.context,
        webId
      });

      ctx.emit('webid.created', newPerson);

      return webId;
    },
    async view(ctx) {
      const webId = await this.getWebId(ctx);
      if (webId) {
        return await ctx.call('ldp.resource.get', {
          resourceUri: webId,
          accept: MIME_TYPES.JSON,
          jsonContext: this.settings.context,
          webId
        });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async edit(ctx) {
      let { userId, ...profileData } = ctx.params;
      const webId = await this.getWebId(ctx);
      return await ctx.call('ldp.resource.patch', {
        resource: {
          '@context': {
            '@vocab': 'http://xmlns.com/foaf/0.1/'
          },
          '@type': 'Person',
          '@id': webId,
          ...profileData
        },
        webId,
        contentType: MIME_TYPES.JSON,
        accept: MIME_TYPES.JSON
      });
    },
    async list(ctx) {
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
      const request = `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        CONSTRUCT {
          ?webId ?p ?o
        }
        WHERE{
          <${this.settings.usersContainer}> ldp:contains ?webId .
          ?webId ?p ?o.
        }
      `;
      return await ctx.call('triplestore.query', {
        query: request,
        accept
      });
    },
    async findByEmail(ctx) {
      const { email } = ctx.params;
      const results = await ctx.call('triplestore.query', {
        query: `
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?webId ?o
        WHERE {
          <${this.settings.usersContainer}> ldp:contains ?webId .
          ?webId foaf:email '${email}' .
        }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      return results.length > 0 ? results[0].webId.value : null;
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
      } else if (ctx.meta.webId || ctx.meta.tokenPayload.webId) {
        return ctx.meta.webId || ctx.meta.tokenPayload.webId;
      } else {
        throw new Error(
          'webid.getWebId have to be call with ctx.params.userId or ctx.meta.webId or ctx.meta.tokenPayload.webId'
        );
      }
    }
  }
};

module.exports = WebIdService;
