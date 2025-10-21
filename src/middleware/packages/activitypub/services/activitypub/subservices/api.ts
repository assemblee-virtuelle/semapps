import urlJoin from 'url-join';
import path from 'path';
import { arrayOf, Registration } from '@semapps/ldp';
import {
  parseUrl,
  parseHeader,
  parseRawBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseFile,
  saveDatasetMeta
} from '@semapps/middlewares';
import { ServiceSchema } from 'moleculer';
import { FULL_ACTOR_TYPES } from '../../../constants.ts';

const ApiService = {
  name: 'activitypub.api' as const,
  settings: {
    baseUri: null,
    podProvider: false
  },
  dependencies: ['api', 'ldp', 'ldp.registry'],
  async started() {
    if (!this.settings.baseUri) throw new Error('The baseUri setting of the activitypub.api service is required');
    const { pathname: basePath } = new URL(this.settings.baseUri);
    const resourcesWithContainerPath = await this.broker.call('ldp.getSetting', { key: 'resourcesWithContainerPath' });
    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', {
        route: this.getBoxesRoute(path.join(basePath, '/:username([^/.][^/]+)'))
      });
    } else if (!resourcesWithContainerPath) {
      await this.broker.call('api.addRoute', { route: this.getBoxesRoute(path.join(basePath, `/:actorSlug`)) });
    } else {
      // If some actor containers are already registered, add the corresponding API routes
      const registrations: { [name: string]: Registration } = await this.broker.call('ldp.registry.list');
      for (const registration of Object.values(registrations)) {
        if (arrayOf(registration.acceptedTypes).some(type => Object.values(FULL_ACTOR_TYPES).includes(type))) {
          await this.broker.call('api.addRoute', {
            route: this.getBoxesRoute(path.join(basePath, `${container.fullPath}/:actorSlug`))
          });
        }
      }
    }
  },
  actions: {
    inbox: {
      async handler(ctx) {
        const { actorSlug, ...activity } = ctx.params;
        const { requestUrl } = ctx.meta;
        const { origin } = new URL(this.settings.baseUri);

        await ctx.call('activitypub.inbox.post', {
          collectionUri: urlJoin(origin, requestUrl),
          ...activity
        });

        ctx.meta.$statusCode = 202;
      }
    },

    outbox: {
      async handler(ctx) {
        let { actorSlug, ...activity } = ctx.params;
        const { requestUrl } = ctx.meta;
        const { origin } = new URL(this.settings.baseUri);

        activity = await ctx.call('activitypub.outbox.post', {
          collectionUri: urlJoin(origin, requestUrl),
          ...activity
        });

        ctx.meta.$responseHeaders = {
          Location: activity.id || activity['@id'],
          'Content-Length': 0
        };
        // We need to set this also here (in addition to above) or we get a Moleculer warning
        ctx.meta.$location = activity.id || activity['@id'];
        ctx.meta.$statusCode = 201;
      }
    }
  },
  events: {
    'ldp.registry.registered': {
      async handler(ctx) {
        const { registration } = ctx.params;
        const { pathname: basePath } = new URL(this.settings.baseUri);
        const resourcesWithContainerPath = await this.broker.call('ldp.getSetting', {
          key: 'resourcesWithContainerPath'
        });
        if (
          !this.settings.podProvider &&
          resourcesWithContainerPath &&
          arrayOf(registration.acceptedTypes).some(type => Object.values(FULL_ACTOR_TYPES).includes(type))
        ) {
          await ctx.call('api.addRoute', {
            route: this.getBoxesRoute(path.join(basePath, `${registration.fullPath}/:actorSlug`))
          });
        }
      }
    }
  },
  methods: {
    getBoxesRoute(actorsPath) {
      const middlewares = [
        parseUrl,
        parseHeader,
        negotiateContentType,
        negotiateAccept,
        parseRawBody,
        parseJson,
        parseFile,
        saveDatasetMeta
      ];

      return {
        name: this.settings.podProvider ? 'boxes' : `boxes${actorsPath}`,
        path: actorsPath,
        // Disable the body parsers so that we can parse the body ourselves
        // (Moleculer-web doesn't handle non-JSON bodies, so we must do it ourselves)
        bodyParsers: false,
        authorization: false,
        authentication: true,
        aliases: {
          'POST /inbox': [...middlewares, 'activitypub.api.inbox'],
          'POST /outbox': [...middlewares, 'activitypub.api.outbox']
        }
      };
    }
  }
} satisfies ServiceSchema;

export default ApiService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ApiService.name]: typeof ApiService;
    }
  }
}
