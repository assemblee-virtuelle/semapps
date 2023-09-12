const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');

const WebIdService = {
  name: 'webid',
  settings: {
    baseUrl: null,
    usersContainer: null,
    context: {
      foaf: 'http://xmlns.com/foaf/0.1/',
    },
    defaultAccept: 'text/turtle',
    podProvider: false,
  },
  dependencies: ['ldp.resource'],
  actions: {
    /**
     * This should only be called after the user has been authenticated
     */
    async create(ctx) {
      let { email, nick, name, familyName, homepage } = ctx.params;

      if (!nick && email) {
        nick = email.split('@')[0].toLowerCase();
      }

      let webId;

      const resource = {
        '@context': {
          '@vocab': 'http://xmlns.com/foaf/0.1/',
        },
        '@type': 'Person',
        nick,
        email,
        name,
        familyName,
        homepage,
      };

      // Create profile with system webId
      if (this.settings.podProvider) {
        if (!this.settings.baseUrl) throw new Error('The baseUrl setting is required in POD provider config');
        webId = urlJoin(this.settings.baseUrl, nick);
        await ctx.call('ldp.resource.create', {
          resource: {
            '@id': webId,
            ...resource,
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system',
        });
      } else {
        if (!this.settings.usersContainer) throw new Error('The usersContainer setting is required');
        webId = await ctx.call('ldp.container.post', {
          resource,
          slug: nick,
          containerUri: this.settings.usersContainer,
          contentType: MIME_TYPES.JSON,
          webId: 'system',
        });
      }

      const newPerson = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        jsonContext: this.settings.context,
        webId: 'system',
      });

      ctx.emit('webid.created', newPerson, { meta: { webId: null, dataset: null } });

      return webId;
    },
    async view(ctx) {
      const webId = await this.getWebId(ctx);
      if (webId) {
        return await ctx.call('ldp.resource.get', {
          resourceUri: webId,
          accept: MIME_TYPES.JSON,
          jsonContext: this.settings.context,
          webId,
        });
      }
      ctx.meta.$statusCode = 404;
    },
    async edit(ctx) {
      const { userId, ...profileData } = ctx.params;
      const webId = await this.getWebId(ctx);
      return await ctx.call('ldp.resource.put', {
        resource: {
          '@context': {
            '@vocab': 'http://xmlns.com/foaf/0.1/',
          },
          '@type': 'Person',
          '@id': webId,
          ...profileData,
        },
        webId,
        contentType: MIME_TYPES.JSON,
        accept: MIME_TYPES.JSON,
      });
    },
  },
  methods: {
    async getWebId(ctx) {
      if (ctx.params.userId) {
        // If an userId is specified, use it to find the webId
        return this.settings.usersContainer + ctx.params.userId;
      }
      if (ctx.meta.webId || ctx.meta.tokenPayload.webId) {
        return ctx.meta.webId || ctx.meta.tokenPayload.webId;
      }
      throw new Error(
        'webid.getWebId have to be call with ctx.params.userId or ctx.meta.webId or ctx.meta.tokenPayload.webId',
      );
    },
  },
};

module.exports = WebIdService;
