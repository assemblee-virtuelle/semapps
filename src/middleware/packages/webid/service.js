const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getContainerFromUri, getSlugFromUri } = require('@semapps/ldp');

const WebIdService = {
  name: 'webid',
  settings: {
    baseUrl: null,
    pathPattern: '/users/:nick', // or /:nick/actor for POD provider config
    context: {
      foaf: 'http://xmlns.com/foaf/0.1/'
    },
    defaultAccept: 'text/turtle'
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

      const uri = urlJoin(this.settings.baseUrl, this.settings.pathPattern.replace(':nick', nick));

      // Create profile with system webId
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
        slug: getSlugFromUri(uri),
        containerUri: getContainerFromUri(uri),
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });

      let newPerson = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        jsonContext: this.settings.context,
        webId: 'system'
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
