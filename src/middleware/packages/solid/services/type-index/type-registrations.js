const urlJoin = require('url-join');
const { namedNode, triple } = require('@rdfjs/data-model');
const { ControlledContainerMixin, arrayOf } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'type-registrations',
  mixins: [ControlledContainerMixin],
  settings: {
    acceptedTypes: ['solid:TypeRegistration'],
    permissions: {},
    newResourcesPermissions: {},
    excludeFromMirror: true,
    activateTombstones: false
  },
  actions: {
    register: {
      visibility: 'public',
      params: {
        types: { type: 'array' },
        containerUri: { type: 'string' },
        webId: { type: 'string' },
        private: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        let { types, containerUri, webId, private } = ctx.params;

        // Wait for the container with type registrations to be created
        const typeRegistrationsContainerUri = await this.actions.getContainerUri({ webId });
        await this.actions.waitForContainerCreation({ containerUri: typeRegistrationsContainerUri });

        const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types });

        // Check if the provided container is already registered
        const existingRegistration = await this.actions.getByContainerUri({ containerUri, webId });

        if (existingRegistration) {
          const oldExpandedTypes = await ctx.call('jsonld.parser.expandTypes', {
            types: existingRegistration['solid:forClass']
          });

          const newExpandedTypes = expandedTypes.filter(t => !oldExpandedTypes.includes(t));

          if (newExpandedTypes.length > 0) {
            for (const expandedType of newExpandedTypes) {
              this.logger.info(`Adding type ${expandedType} to type registration ${existingRegistration.id}`);
              await this.actions.patch({
                resourceUri: existingRegistration.id,
                triplesToAdd: [
                  triple(
                    namedNode(existingRegistration.id),
                    namedNode('http://www.w3.org/ns/solid/terms#forClass'),
                    namedNode(expandedType)
                  )
                ],
                webId
              });
            }
          } else {
            this.logger.info(`The container ${containerUri} is already registered. Skipping...`);
          }
        } else {
          // Create the type registration
          const registrationUri = await this.actions.post(
            {
              resource: {
                type: 'solid:TypeRegistration',
                'solid:forClass': expandedTypes,
                'solid:instanceContainer': containerUri
              },
              contentType: MIME_TYPES.JSON,
              webId
            },
            { parentCtx: ctx }
          );

          // Give anonymous read permission to public type registrations
          if (!private) {
            await ctx.call('webacl.resource.addRights', {
              resourceUri: registrationUri,
              additionalRights: {
                anon: {
                  read: true
                }
              },
              webId: 'system'
            });
          }

          // Find the public or private TypeIndex linked with the WebId
          const indexUri = private
            ? await ctx.call('type-indexes.getPrivateIndex', { webId })
            : await ctx.call('type-indexes.getPublicIndex', { webId });
          if (!indexUri)
            throw new Error(`No ${private ? 'private' : 'public'} type index associated with webId ${webId}`);

          // Attach it to the TypeIndex
          await ctx.call('type-indexes.patch', {
            resourceUri: indexUri,
            triplesToAdd: [
              triple(
                namedNode(indexUri),
                namedNode('http://www.w3.org/ns/solid/terms#hasTypeRegistration'),
                namedNode(registrationUri)
              )
            ],
            webId
          });

          return registrationUri;
        }
      }
    },
    /**
     * Bind an application to a certain type of resources
     * If no other app is bound with this type yet, it will be marked as the default app
     * Otherwise, the app will be added to the list of available apps, that the user can switch to
     */
    bindApp: {
      visibility: 'public',
      params: {
        containerUri: { type: 'string' },
        appUri: { type: 'string' },
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { containerUri, appUri, webId } = ctx.params;

        let registration = await this.actions.getByContainerUri({ containerUri, webId }, { parentCtx: ctx });
        if (!registration) throw new Error(`No registration found for container ${containerUri}`);

        // Add the app to available apps
        registration['apods:availableApps'] = [...new Set([...arrayOf(registration['apods:availableApps']), appUri])];

        // If no default app is defined for this type, use this one
        if (!registration['apods:defaultApp']) registration['apods:defaultApp'] = appUri;

        await ctx.call('type-registrations.put', {
          resource: registration,
          contentType: MIME_TYPES.JSON,
          webId
        });
      }
    },
    /**
     * Unbind an application from a certain type of resource (Mirror of the above action.)
     */
    unbindApp: {
      visibility: 'public',
      params: {
        containerUri: { type: 'string' },
        appUri: { type: 'string' },
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { containerUri, appUri, webId } = ctx.params;

        let registration = await this.actions.getByContainerUri({ containerUri, webId }, { parentCtx: ctx });
        if (!registration) throw new Error(`No registration found for container ${containerUri}`);

        // Remove the app from available apps
        registration['apods:availableApps'] = arrayOf(registration['apods:availableApps']).filter(a => a !== appUri);

        if (registration['apods:defaultApp'] === appUri) {
          // If there are other available apps for this type, set the first one as the default app
          registration['apods:defaultApp'] =
            registration['apods:availableApps'].length > 0
              ? registration['apods:availableApps'][0]
              : (registration['apods:defaultApp'] = undefined);
        }

        await ctx.call('type-registrations.put', {
          resource: registration,
          contentType: MIME_TYPES.JSON,
          webId
        });
      }
    },
    getByType: {
      visibility: 'public',
      params: {
        type: { type: 'string' },
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { type, webId } = ctx.params;

        const [expandedType] = await ctx.call('jsonld.parser.expandTypes', { types: [type] });

        const filteredContainer = await this.actions.list(
          {
            filters: { 'http://www.w3.org/ns/solid/terms#forClass': expandedType },
            webId
          },
          { parentCtx: ctx }
        );

        // There can be several TypeRegistration per type
        return arrayOf(filteredContainer['ldp:contains']);
      }
    },
    getByContainerUri: {
      visibility: 'public',
      params: {
        containerUri: { type: 'string' },
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { containerUri, webId } = ctx.params;

        const filteredContainer = await this.actions.list(
          {
            filters: { 'http://www.w3.org/ns/solid/terms#instanceContainer': containerUri },
            webId
          },
          { parentCtx: ctx }
        );

        // There should be only one TypeRegistration per container
        return arrayOf(filteredContainer['ldp:contains'])[0];
      }
    },
    findContainersUris: {
      visibility: 'public',
      params: {
        type: { type: 'string' },
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { type, webId } = ctx.params;

        const registrations = await this.actions.getByType({ type, webId }, { parentCtx: ctx });

        return registrations.map(r => r['solid:instanceContainer']);
      }
    },
    addMissing: {
      visibility: 'public',
      async handler(ctx) {
        const accounts = await ctx.call('auth.account.find');
        const registeredContainers = await ctx.call('ldp.registry.list');
        // Go through each Pod
        for (const { webId } of accounts) {
          const podUrl = await ctx.call('solid-storage.getUrl', { webId });
          // Go through each registered container
          for (const container of Object.values(registeredContainers)) {
            if (container.podsContainer !== true) {
              const containerUri = urlJoin(podUrl, container.path);
              for (const type of arrayOf(container.acceptedTypes)) {
                await this.actions.register({ type, containerUri, webId }, { parentCtx: ctx });
              }
            }
          }
        }
      }
    }
  },
  events: {
    async 'ldp.container.created'(ctx) {
      const { containerUri, options, webId } = ctx.params;

      if (options?.typeIndex) {
        // TODO wait for type indexes creation
        await ctx.call('type-indexes.waitForIndexCreation', { type: options.typeIndex, webId });

        await this.actions.register(
          {
            types: arrayOf(options?.acceptedTypes),
            containerUri,
            webId,
            private: options.typeIndex === 'private'
          },
          { parentCtx: ctx }
        );
      }
    }
  }
};
