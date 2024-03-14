const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { foaf, schema } = require('@semapps/ontologies');
const { ControlledContainerMixin, ControlledContainerDereferenceMixin } = require('@semapps/ldp');

/** @type {import('moleculer').ServiceSchema} */
const WebIdService = {
  name: 'webid',
  settings: {
    path: '/',
    baseUrl: null,
    usersContainer: null,
    defaultAccept: 'text/turtle',
    podProvider: false,
    podsContainer: false,
    dereferencePlan: {
      p: 'publicKey'
    }
  },
  dependencies: ['ldp.resource', 'ontologies'],
  mixins: [ControlledContainerMixin, ControlledContainerDereferenceMixin],
  async started() {
    await this.broker.call('ontologies.register', {
      ...foaf,
      overwrite: true
    });
    await this.broker.call('ontologies.register', {
      ...schema,
      overwrite: true
    });
  },
  actions: {
    /**
     * This should only be called after the user has been authenticated
     */
    async create(ctx) {
      let { email, nick, name, familyName, homepage, ...rest } = ctx.params;

      if (!nick && email) {
        nick = email.split('@')[0].toLowerCase();
      }

      let webId;

      const resource = {
        '@type': 'foaf:Person',
        'foaf:nick': nick,
        'foaf:email': email,
        'foaf:name': name,
        'foaf:familyName': familyName,
        'foaf:homepage': homepage,
        ...rest
      };

      // Create profile with system webId
      if (this.settings.podProvider) {
        if (!this.settings.baseUrl) throw new Error('The baseUrl setting is required in POD provider config');
        webId = urlJoin(this.settings.baseUrl, nick);
        await ctx.call('ldp.resource.create', {
          resource: {
            '@id': webId,
            ...resource
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      } else {
        if (!this.settings.usersContainer) throw new Error('The usersContainer setting is required');
        webId = await ctx.call('ldp.container.post', {
          resource,
          slug: nick,
          containerUri: this.settings.usersContainer,
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      }

      const newPerson = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      ctx.emit('webid.created', newPerson, { meta: { webId: null, dataset: null } });

      return webId;
    },
    /* This should be handled by controlled container...
    async get(ctx) {
      const webId = await this.getWebId(ctx);
      if (webId) {
        return await ctx.call('ldp.resource.get', {
          resourceUri: webId,
          accept: MIME_TYPES.JSON,
          webId
        });
      }
      ctx.meta.$statusCode = 404;
    },
    */
    async edit(ctx) {
      const { userId, ...profileData } = ctx.params;
      const webId = await this.getWebId(ctx);
      return await ctx.call('ldp.resource.put', {
        resource: {
          '@context': {
            '@vocab': foaf.namespace
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
      }
      if (ctx.meta.webId || ctx.meta.tokenPayload.webId) {
        return ctx.meta.webId || ctx.meta.tokenPayload.webId;
      }
      throw new Error(
        'webid.getWebId have to be call with ctx.params.userId or ctx.meta.webId or ctx.meta.tokenPayload.webId'
      );
    }
  }
};

module.exports = WebIdService;
