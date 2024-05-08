const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { foaf, schema } = require('@semapps/ontologies');
const { ControlledContainerMixin, ControlledContainerDereferenceMixin } = require('@semapps/ldp');
const { FULL_ACTOR_TYPES } = require('@semapps/activitypub');

/** @type {import('moleculer').ServiceSchema} */
const WebIdService = {
  name: 'webid',
  settings: {
    path: '/foaf/person',
    baseUrl: null,
    acceptedTypes: ['http://xmlns.com/foaf/0.1/Person'],
    defaultAccept: 'text/turtle',
    podProvider: false,
    podsContainer: false,
    dereferencePlan: [
      {
        property: 'publicKey'
      },
      { property: 'assertionMethod' }
    ]
  },
  dependencies: ['ldp.resource', 'ontologies'],
  mixins: [ControlledContainerMixin, ControlledContainerDereferenceMixin],
  async started() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting is required for webId service.');

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
    async createWebId(ctx) {
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
        if (!this.settings.path) throw new Error('The path setting is required');
        webId = await this.actions.post(
          {
            resource,
            slug: nick,
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          },
          { parentCtx: ctx }
        );
      }

      const newPerson = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      ctx.emit('webid.created', newPerson, { meta: { webId: null, dataset: null } });

      return webId;
    }
  }
};

module.exports = WebIdService;
