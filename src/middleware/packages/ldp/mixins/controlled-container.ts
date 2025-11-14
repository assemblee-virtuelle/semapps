// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { arrayOf, delay, getParentContainerUri } from '../utils.ts';

const ControlledContainerMixin = {
  settings: {
    path: null,
    types: null,
    permissions: null,
    newResourcesPermissions: null,
    controlledActions: {},
    excludeFromMirror: false,
    activateTombstones: true,
    typeIndex: 'public'
  },
  dependencies: ['ldp'],
  async started() {
    const { path, controlledActions, ...rest } = this.settings;

    this.registration = await this.broker.call('ldp.registry.register', {
      path,
      name: this.name,
      isContainer: true,
      controlledActions: {
        post: `${this.name}.post`,
        list: `${this.name}.list`,
        get: `${this.name}.get`,
        getHeaderLinks: `${this.name}.getHeaderLinks`,
        create: `${this.name}.create`,
        patch: `${this.name}.patch`,
        put: `${this.name}.put`,
        delete: `${this.name}.delete`,
        postOnResource: `${this.name}.postOnResource`,
        ...this.settings.controlledActions
      },
      ...rest
    });
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
        // @ts-expect-error TS(2339): Property 'accept' does not exist on type '{}'.
        if (this.settings.accept) containerParams.accept = this.settings.accept;
        return ctx.call('ldp.resource.get', {
          ...containerParams,
          ...ctx.params
        });
      }
    },

    getHeaderLinks: {
      handler() {
        return [];
      }
    },

    create: {
      handler(ctx) {
        return ctx.call('ldp.resource.create', { registration: this.registration, ...ctx.params });
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

    postOnResource: {
      handler() {
        // By default, LDP does not allow to POST on resources
        throw new E.ForbiddenError();
      }
    },

    exist: {
      handler(ctx) {
        return ctx.call('ldp.resource.exist', ctx.params);
      }
    },

    getContainerUri: {
      async handler(ctx) {
        return await ctx.call('ldp.registry.getUri', {
          type: arrayOf(this.settings.types)[0],
          isPrivate: this.settings.typeIndex === 'private'
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

export default ControlledContainerMixin;
