const urlJoin = require('url-join');
const { ControlledContainerMixin, DereferenceMixin, arrayOf } = require('@semapps/ldp');
const { solid, skos, apods } = require('@semapps/ontologies');
const { MIME_TYPES } = require('@semapps/mime-types');
const { namedNode, triple } = require('@rdfjs/data-model');
const TypeRegistrationsService = require('./type-registrations');

module.exports = {
  name: 'type-indexes',
  mixins: [ControlledContainerMixin, DereferenceMixin],
  settings: {
    acceptedTypes: ['solid:TypeIndex'],
    permissions: {},
    excludeFromMirror: true,
    activateTombstones: false,
    // DereferenceMixin settings
    dereferencePlan: [{ property: 'solid:hasTypeRegistration' }]
  },
  dependencies: ['ontologies'],
  created() {
    this.broker.createService({
      mixins: [TypeRegistrationsService]
    });
  },
  async started() {
    await this.broker.call('ontologies.register', solid);
    // The following ontologies are used for the type description
    await this.broker.call('ontologies.register', skos);
    await this.broker.call('ontologies.register', apods);
  },
  actions: {
    async createPublicIndex(ctx) {
      const { webId } = ctx.params;

      const indexUri = await this.actions.post(
        {
          resource: {
            type: ['solid:TypeIndex', 'solid:ListedDocument']
          },
          contentType: MIME_TYPES.JSON,
          permissions: {
            anon: {
              read: true
            }
          },
          webId
        },
        { parentCtx: ctx }
      );

      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToAdd: [
          triple(namedNode(webId), namedNode('http://www.w3.org/ns/solid/terms#publicTypeIndex'), namedNode(indexUri))
        ],
        webId
      });
    },
    async createPrivateIndex(ctx) {
      const { webId } = ctx.params;

      if (!(await this.preferencesFileAvailable()))
        throw new Error(`The private type index requires the SolidPreferencesFile service`);

      const preferencesUri = await ctx.call('solid-preferences-file.getResourceUri', { webId });
      if (!preferencesUri) throw new Error(`No preferences file found for user ${webId}`);

      const privateIndex = await this.actions.getPrivateIndex({ webId });
      if (privateIndex) throw new Error(`A private index already exist for user ${webId}`);

      const indexUri = await this.actions.post(
        {
          resource: {
            type: ['solid:TypeIndex', 'solid:UnlistedDocument']
          },
          permissions: {},
          contentType: MIME_TYPES.JSON,
          webId
        },
        { parentCtx: ctx }
      );

      await ctx.call('solid-preferences-file.patch', {
        resourceUri: preferencesUri,
        triplesToAdd: [
          triple(
            namedNode(preferencesUri),
            namedNode('http://www.w3.org/ns/solid/terms#privateTypeIndex'),
            namedNode(indexUri)
          )
        ],
        webId
      });
    },
    async getPublicIndex(ctx) {
      const { webId } = ctx.params;

      const user = await ctx.call('ldp.resource.get', {
        resourceUri: webId,
        accept: MIME_TYPES.JSON,
        webId
      });

      return user['solid:publicTypeIndex'];
    },
    async getPrivateIndex(ctx) {
      const { webId } = ctx.params;

      if (!(await this.preferencesFileAvailable()))
        throw new Error(`The private type index requires the SolidPreferencesFile service`);

      const preferencesFileUri = await ctx.call('solid-preferences-file.get', { webId });

      return preferencesFileUri['solid:privateTypeIndex'];
    }
  },
  methods: {
    async preferencesFileAvailable() {
      const services = await this.broker.call('$node.services');
      return services.some(s => s.name === 'solid-preferences-file');
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      const podUrl = await ctx.call('solid-storage.getUrl', { webId });

      // Wait until the /solid/type-index container has been created for the user
      const indexesContainerUri = await this.actions.getContainerUri({ webId }, { parentCtx: ctx });
      await this.actions.waitForContainerCreation({ containerUri: indexesContainerUri }, { parentCtx: ctx });

      // Wait until the /solid/type-registration container has been created for the user
      const registrationsContainerUri = await ctx.call('type-registrations.getContainerUri', { webId });
      await ctx.call('type-registrations.waitForContainerCreation', { containerUri: registrationsContainerUri });

      await this.actions.createPublicIndex({ webId }, { parentCtx: ctx });
      await this.actions.createPrivateIndex({ webId }, { parentCtx: ctx });

      const registeredContainers = await ctx.call('ldp.registry.list');

      // Go through each registered container
      for (const container of Object.values(registeredContainers)) {
        if (container.podsContainer !== true) {
          const containerUri = urlJoin(podUrl, container.path);
          for (const type of arrayOf(container.acceptedTypes)) {
            this.logger.info(`Registering ${containerUri} with type ${type}...`);
            await ctx.call('type-registrations.register', {
              type,
              containerUri,
              webId,
              private: container.description?.internal
            });
            if (container.description) {
              await ctx.call('type-registrations.attachDescription', {
                type,
                webId,
                ...container.description
              });
            }
          }
        }
      }
    }
  }
};
