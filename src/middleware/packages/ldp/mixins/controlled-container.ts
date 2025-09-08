import { ServiceSchema } from 'moleculer';
import { delay, getParentContainerUri } from '../utils.ts';

const Schema = {
  settings: {
    path: null,
    acceptedTypes: null,
    permissions: null,
    newResourcesPermissions: null,
    controlledActions: {},
    readOnly: false,
    excludeFromMirror: false,
    activateTombstones: true,
    podsContainer: false,
    podProvider: false,
    typeIndex: undefined
  },
  dependencies: ['ldp'],
  async started() {
    const { path, controlledActions, ...rest } = this.settings;

    const registration = await this.broker.call('ldp.registry.register', {
      path,
      name: this.name,
      controlledActions: {
        post: `${this.name}.post`,
        list: `${this.name}.list`,
        get: `${this.name}.get`,
        getHeaderLinks: `${this.name}.getHeaderLinks`,
        create: `${this.name}.create`,
        patch: `${this.name}.patch`,
        put: `${this.name}.put`,
        delete: `${this.name}.delete`,
        ...this.settings.controlledActions
      },
      ...rest
    });

    // If no path was defined in the settings, set the automatically generated path (so that it can be used below)
    if (!path) this.settings.path = registration.path;
  },
  actions: {
    post: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
        }
        return await ctx.call('ldp.container.post', ctx.params);
      }
    },

    list: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
        }
        return ctx.call('ldp.container.get', ctx.params);
      }
    },

    attach: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
        }
        return ctx.call('ldp.container.attach', ctx.params);
      }
    },

    detach: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
        }
        return ctx.call('ldp.container.detach', ctx.params);
      }
    },

    get: {
      handler(ctx) {
        const containerParams = {};
        if (this.settings.accept) containerParams.accept = this.settings.accept;
        return ctx.call('ldp.resource.get', {
          ...containerParams,
          ...ctx.params
        });
      }
    },

    getHeaderLinks: {
      handler(ctx) {
        return [];
      }
    },

    create: {
      handler(ctx) {
        return ctx.call('ldp.resource.create', ctx.params);
      }
    },

    patch: {
      handler(ctx) {
        return ctx.call('ldp.resource.patch', ctx.params);
      }
    },

    put: {
      handler(ctx) {
        return ctx.call('ldp.resource.put', ctx.params);
      }
    },

    delete: {
      handler(ctx) {
        return ctx.call('ldp.resource.delete', ctx.params);
      }
    },

    exist: {
      handler(ctx) {
        return ctx.call('ldp.resource.exist', ctx.params);
      }
    },

    getContainerUri: {
      handler(ctx) {
        return ctx.call('ldp.registry.getUri', {
          path: this.settings.path,
          webId: ctx.params?.webId || ctx.meta?.webId
        });
      }
    },

    waitForContainerCreation: {
      async handler(ctx) {
        let { containerUri } = ctx.params;
        let containerExist;
        let containerAttached;

        if (!containerUri) {
          containerUri = await this.actions.getContainerUri(
            { webId: ctx.params.webId || ctx.meta.webId },
            { parentCtx: ctx }
          );
        }

        do {
          if (containerExist === false) await delay(1000);
          containerExist = await ctx.call('ldp.container.exist', { containerUri });
        } while (!containerExist);

        const parentContainerUri = getParentContainerUri(containerUri);
        const parentContainerExist = await ctx.call('ldp.container.exist', { containerUri: parentContainerUri });

        // If a parent container exist, check that the child container has been attached
        // Otherwise, it may fail
        if (parentContainerExist) {
          do {
            if (containerAttached === false) await delay(1000);
            containerAttached = await ctx.call('ldp.container.includes', {
              containerUri: parentContainerUri,
              resourceUri: containerUri,
              webId: 'system'
            });
          } while (!containerAttached);
        }
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
