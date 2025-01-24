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
        type: { type: 'string' },
        containerUri: { type: 'string' },
        webId: { type: 'string' },
        private: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        let { type, containerUri, webId, private } = ctx.params;

        const [expandedType] = await ctx.call('jsonld.parser.expandTypes', { types: [type] });

        // Check if the container was already registered
        let existingRegistration = await this.actions.getByContainerUri({ containerUri, webId });

        if (existingRegistration) {
          const expandedRegisteredTypes = await ctx.call('jsonld.parser.expandTypes', {
            types: existingRegistration['solid:forClass']
          });

          // If the container is registered with other types, append the new type
          if (!expandedRegisteredTypes.includes(expandedType)) {
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

          return existingRegistration;
        } else {
          // Ensure there is no registration for this type on another container
          // existingRegistration = await this.actions.getByType({ type: expandedType, webId });

          // if (existingRegistration && existingRegistration['solid:instanceContainer'] !== containerUri) {
          //   throw new Error(
          //     `Cannot register ${containerUri} for type ${type} because the container ${existingRegistration['solid:instanceContainer']} is already registered for this type.`
          //   );
          // }

          // Create the type registration
          const registrationUri = await this.actions.post(
            {
              resource: {
                type: 'solid:TypeRegistration',
                'solid:forClass': expandedType,
                'solid:instanceContainer': containerUri
              },
              permissions: private ? {} : { anon: { read: true } },
              contentType: MIME_TYPES.JSON,
              webId
            },
            { parentCtx: ctx }
          );

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
    attachDescription: {
      visibility: 'public',
      params: {
        type: { type: 'string' },
        webId: { type: 'string' },
        labelMap: { type: 'object', optional: true },
        labelPredicate: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { type, webId, labelMap, labelPredicate } = ctx.params;

        const [registration] = await this.actions.getByType({ type, webId }, { parentCtx: ctx });
        if (!registration) throw new Error(`No registration found with type ${type}`);

        let label;

        if (labelMap) {
          const userData = await ctx.call('ldp.resource.get', {
            resourceUri: webId,
            accept: MIME_TYPES.JSON,
            webId
          });

          const userLocale = userData['schema:knowsLanguage'];

          if (userLocale) {
            label = labelMap?.[userLocale] || labelMap?.en;
          }
        }

        await ctx.call('type-registrations.put', {
          resource: {
            ...registration,
            'skos:prefLabel': label,
            'apods:labelPredicate': labelPredicate
          },
          contentType: MIME_TYPES.JSON,
          webId
        });
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

        let [registration] = await this.actions.getByContainerUri({ containerUri, webId }, { parentCtx: ctx });
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

        let [registration] = await this.actions.getByContainerUri({ containerUri, webId }, { parentCtx: ctx });
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
  }
};
