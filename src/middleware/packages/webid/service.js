const { MIME_TYPES } = require('@semapps/mime-types');
const getRoutes = require('./getRoutes');

const WebIdService = {
  name: 'webid',
  dependencies: ['ldp.resource', 'triplestore'],
  settings: {
    usersContainer: null,
    context: {
      foaf: 'http://xmlns.com/foaf/0.1/'
    },
    defaultAccept: 'text/turtle'
  },
  actions: {
    /**
     * This should only be called after the user has been authenticated
     */
    async create(ctx) {
      let { email, nick, name, familyName, homepage } = ctx.params;

      if (!nick && email){
        nick = email.split('@')[0].toLowerCase();
      }

      const userData = {
        nick,
        email,
        name,
        familyName,
        homepage
      };
      let type =

      webId = await ctx.call('ldp.resource.post', {
        resource: {
          '@context': {
            '@vocab': 'http://xmlns.com/foaf/0.1/'
          },
          '@type': 'Person',
          ...userData
        },
        slug: nick,
        containerUri: this.settings.usersContainer,
        contentType: MIME_TYPES.JSON
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
          webId: webId
        });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async edit(ctx) {
      let { userId, ...body } = ctx.params;
      const webId = await this.getWebId(ctx);
      body['@id'] = webId;
      return await ctx.call('ldp.resource.patch', {
        resource: body,
        webId: webId,
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
        webId: ctx.meta.webId,
        accept: accept
      });
    },

    async findByEmail(ctx) {
      return await ctx.call('webid.findByFoafEmail',ctx.params)
    },

    async findByFoafEmail(ctx) {
      console.log("SEMAPPS findByFoafEmail",ctx.params);
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
        accept: MIME_TYPES.JSON
      });
      console.log("SEMAPPS findByFoafEmail",results);

      return results.length > 0 ? results[0].webId.value : null;
    },

    getUsersContainer(ctx) {
      return this.settings.usersContainer;
    },

    getApiRoutes(ctx) {
      return getRoutes();
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
        throw new Error('webid.getWebId have to be call whith ctx.params.userId or ctx.meta.webId or ctx.meta.tokenPayload.webId')
      }
    }
  }
};

module.exports = WebIdService;
