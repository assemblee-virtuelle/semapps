// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { arrayOf, delay } from '../utils.ts';

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
          ctx.params.containerUri = await this.actions.getContainerUri({}, { parentCtx: ctx });
        }
        return await ctx.call('ldp.container.post', ctx.params, {
          meta: { skipObjectsWatcher: this.settings.excludeFromMirror }
        });
      }
    },

    list: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({}, { parentCtx: ctx });
        }
        return ctx.call('ldp.container.get', ctx.params);
      }
    },

    attach: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({}, { parentCtx: ctx });
        }
        return ctx.call('ldp.container.attach', ctx.params);
      }
    },

    detach: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({}, { parentCtx: ctx });
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
        return ctx.call('ldp.resource.patch', ctx.params, {
          meta: { skipObjectsWatcher: this.settings.excludeFromMirror }
        });
      }
    },

    put: {
      handler(ctx) {
        return ctx.call('ldp.resource.put', ctx.params, {
          meta: { skipObjectsWatcher: this.settings.excludeFromMirror }
        });
      }
    },

    delete: {
      handler(ctx) {
        return ctx.call('ldp.resource.delete', ctx.params, {
          meta: { skipObjectsWatcher: this.settings.excludeFromMirror }
        });
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
          isContainer: true,
          isPrivate: this.settings.typeIndex === 'private'
        });
      }
    },

    waitForContainerCreation: {
      async handler(ctx) {
        let { containerUri } = ctx.params;
        let containerExist;

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

        return containerUri;
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default ControlledContainerMixin;
