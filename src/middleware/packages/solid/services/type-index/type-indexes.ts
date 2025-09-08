import { ControlledContainerMixin, DereferenceMixin, delay, arrayOf } from '@semapps/ldp';
import { solid, skos, apods } from '@semapps/ontologies';
import { MIME_TYPES } from '@semapps/mime-types';
import { namedNode, triple } from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';
import TypeRegistrationsService from './type-registrations.ts';

const TypeIndexesSchema = {
  name: 'type-indexes' as const,
  mixins: [ControlledContainerMixin, DereferenceMixin],
  settings: {
    acceptedTypes: ['solid:TypeIndex'],
    permissions: {},
    newResourcesPermissions: {},
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
    createPublicIndex: {
      async handler(ctx) {
        const { webId } = ctx.params;

        const indexUri = await this.actions.post(
          {
            resource: {
              type: ['solid:TypeIndex', 'solid:ListedDocument']
            },
            webId
          },
          { parentCtx: ctx }
        );

        // Give anonymous read permission
        await ctx.call('webacl.resource.addRights', {
          resourceUri: indexUri,
          additionalRights: {
            anon: {
              read: true
            }
          },
          webId: 'system'
        });

        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToAdd: [
            triple(namedNode(webId), namedNode('http://www.w3.org/ns/solid/terms#publicTypeIndex'), namedNode(indexUri))
          ],
          webId
        });
      }
    },

    createPrivateIndex: {
      async handler(ctx) {
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
      }
    },

    getPublicIndex: {
      async handler(ctx) {
        const { webId } = ctx.params;

        const user = await ctx.call('ldp.resource.get', {
          resourceUri: webId,
          webId
        });

        return user['solid:publicTypeIndex'];
      }
    },

    getPrivateIndex: {
      async handler(ctx) {
        const { webId } = ctx.params;

        if (!(await this.preferencesFileAvailable()))
          throw new Error(`The private type index requires the SolidPreferencesFile service`);

        const preferencesFileUri = await ctx.call('solid-preferences-file.get', { webId });

        return preferencesFileUri?.['solid:privateTypeIndex'];
      }
    },

    waitForIndexCreation: {
      async handler(ctx) {
        const { type, webId } = ctx.params;
        let indexUri;
        let attempts = 0;

        do {
          attempts += 1;
          if (attempts > 1) await delay(1000);
          try {
            indexUri =
              type === 'private'
                ? await this.actions.getPrivateIndex({ webId })
                : await this.actions.getPublicIndex({ webId });
          } catch (e) {
            // Ignore 404 errors
            if (e.code !== 404) throw e;
          }
        } while (!indexUri || attempts > 30);

        if (!indexUri)
          throw new Error(
            `${type === 'private' ? 'Private' : 'Public'} TypeIndex still has not been created after 30s`
          );

        return indexUri;
      }
    },

    awaitCreateComplete: {
      /**
       * Wait until all type registrations have been created for the newly-created user
       */
      async handler(ctx) {
        const { webId } = ctx.params;

        const containers = await ctx.call('ldp.registry.list');
        const numContainersWithTypeIndex = Object.values(containers).filter(container => container.typeIndex).length;

        let numTypeRegistrations;
        let attempts = 0;
        do {
          attempts += 1;
          if (attempts > 1) await delay(1000);
          const typeRegistrationsContainer = await ctx.call('type-registrations.list', { webId });
          numTypeRegistrations = arrayOf(typeRegistrationsContainer['ldp:contains']).length;
          if (attempts > 30)
            throw new Error(
              `After 30s, user ${webId} has only ${numTypeRegistrations} types registrations. Expecting ${numContainersWithTypeIndex}`
            );
        } while (numTypeRegistrations < numContainersWithTypeIndex);
      }
    }
  },
  methods: {
    async preferencesFileAvailable() {
      const services = await this.broker.call('$node.services');
      return services.some(s => s.name === 'solid-preferences-file');
    }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        const { webId } = ctx.params;

        // Wait until the /solid/type-index container has been created for the user
        const indexesContainerUri = await this.actions.getContainerUri({ webId }, { parentCtx: ctx });
        await this.actions.waitForContainerCreation({ containerUri: indexesContainerUri }, { parentCtx: ctx });

        // Wait until the /solid/type-registration container has been created for the user
        const registrationsContainerUri = await ctx.call('type-registrations.getContainerUri', { webId });
        await ctx.call('type-registrations.waitForContainerCreation', { containerUri: registrationsContainerUri });

        await this.actions.createPublicIndex({ webId }, { parentCtx: ctx });
        await this.actions.createPrivateIndex({ webId }, { parentCtx: ctx });
      }
    }
  }
} satisfies ServiceSchema;

export default TypeIndexesSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [TypeIndexesSchema.name]: typeof TypeIndexesSchema;
    }
  }
}
