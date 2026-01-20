import Redis from 'ioredis';
import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { parseUrl } from '@semapps/middlewares';

const RedirectService = {
  name: 'redirect' as const,
  settings: {
    baseUrl: null,
    redisUrl: null
  },
  dependencies: ['api', 'ldp'],
  async started() {
    if (!this.settings.redisUrl || !this.settings.baseUrl) throw new Error('The redisUrl and baseUrl are mandatory');

    this.redis = new Redis(this.settings.redisUrl);

    const basePath: string = await this.broker.call('ldp.getBasePath');

    await this.broker.call('api.addRoute', {
      route: {
        name: 'redirect-to-new-uri',
        path: path.join(basePath, '/data/:slugParts*'), // Old URIs should all start with /data
        authorization: false,
        authentication: false,
        aliases: {
          'GET /': [parseUrl, `${this.name}.redirectToNewUri`]
        }
      }
    });
  },
  actions: {
    set: {
      async handler(ctx) {
        const { oldUri, newUri } = ctx.params;
        this.redis.set(oldUri, newUri);
      }
    },
    get: {
      async handler(ctx) {
        const { oldUri } = ctx.params;
        return await this.redis.get(oldUri);
      }
    },
    delete: {
      async handler(ctx) {
        const { oldUri } = ctx.params;
        return await this.redis.del(oldUri);
      }
    },
    redirectToNewUri: {
      async handler(ctx: any) {
        const { slugParts } = ctx.params;

        const oldUri = urlJoin(this.settings.baseUrl, 'data', ...slugParts);
        const newUri = await this.actions.get({ oldUri }, { parentCtx: ctx });

        if (newUri) {
          ctx.meta.$statusCode = 301;
          ctx.meta.$location = newUri;
        } else {
          throw E.NotFoundError();
        }
      }
    }
  }
} satisfies ServiceSchema;

export default RedirectService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [RedirectService.name]: typeof RedirectService;
    }
  }
}
