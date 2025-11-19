import path from 'path';
import urlJoin from 'url-join';
import { Account } from '@semapps/auth';
import { parseHeader, parseFile, saveDatasetMeta } from '@semapps/middlewares';
import fetch from 'node-fetch';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';

const stream2buffer = (stream: any) => {
  return new Promise((resolve, reject) => {
    const _buf: any = [];
    stream.on('data', (chunk: any) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err: any) => reject(err));
  });
};

const ProxyService = {
  name: 'signature.proxy' as const,
  dependencies: ['api', 'ldp'],
  async started() {
    const basePath: string = await this.broker.call('ldp.getBasePath');

    await this.broker.call('api.addRoute', {
      route: {
        name: 'proxy-endpoint',
        path: path.join(basePath, '/:username([^/.][^/]+)/proxy'),
        authorization: true,
        authentication: false,
        aliases: {
          'POST /': [parseHeader, parseFile, saveDatasetMeta, 'signature.proxy.api_query'] // parseFile handles multipart/form-data
        }
      }
    });
  },
  actions: {
    api_query: {
      async handler(ctx) {
        const url = ctx.params.id;
        const method = ctx.params.method || 'GET';
        const headers = JSON.parse(ctx.params.headers) || { accept: 'application/json' };
        const actorUri = ctx.meta.webId;

        // Only user can query his own proxy URL
        const account: Account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        if (account.username !== ctx.params.username) throw new E.ForbiddenError();

        // If a file is uploaded, convert it to a Buffer
        const body =
          ctx.params.files && ctx.params.files.length > 0
            ? await stream2buffer(ctx.params.files[0].readableStream)
            : ctx.params.body;

        try {
          const response = await this.actions.query(
            {
              url,
              method,
              headers,
              body,
              actorUri
            },
            {
              parentCtx: ctx
            }
          );
          ctx.meta.$statusCode = response.status;
          ctx.meta.$statusMessage = response.statusText;
          ctx.meta.$responseHeaders = response.headers;
          return response.body;
        } catch (e) {
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
          if (e.code !== 404 && e.code !== 403) console.error(e);
          // @ts-expect-error TS(2339): Property '$statusCode' does not exist on type '{}'... Remove this comment to see the full error message
          ctx.meta.$statusCode = !e.code ? 500 : e.code === 'ECONNREFUSED' ? 502 : e.code;
          // @ts-expect-error TS(2339): Property '$statusMessage' does not exist on type '... Remove this comment to see the full error message
          ctx.meta.$statusMessage = e.message;
        }
      }
    },

    query: {
      async handler(ctx) {
        let { url, method, headers, body, actorUri } = ctx.params;

        const signatureHeaders: any = await ctx.call('signature.generateSignatureHeaders', {
          url,
          method,
          body,
          actorUri
        });

        // Convert Headers object if necessary (otherwise we can't destructure it below)
        // Note: if we use NodeJS built-in Headers instead of node-fetch Headers, the constructor name is _Headers
        if (
          headers &&
          typeof headers === 'object' &&
          (headers.constructor.name === 'Headers' || headers.constructor.name === '_Headers')
        ) {
          headers = Object.fromEntries(headers);
        }

        const response = await fetch(url, {
          method,
          headers: {
            ...headers,
            ...signatureHeaders
          },
          body
        });

        if (response.ok) {
          let responseBody = await response.text();
          try {
            responseBody = JSON.parse(responseBody);
          } catch (e) {
            // Do nothing if body is not JSON
          }

          // Remove headers that we don't want to be transfered
          response.headers.delete('content-length');
          response.headers.delete('connection');
          response.headers.delete('content-encoding');

          return {
            ok: true,
            body: responseBody,
            headers: Object.fromEntries(response.headers.entries()),
            status: response.status,
            statusText: response.statusText
          };
        } else {
          return {
            ok: false,
            status: response.status,
            statusText: response.statusText
          };
        }
      }
    }
  },
  events: {
    'auth.account.created': {
      async handler(ctx: any) {
        const { webId } = ctx.params;
        const services: ServiceSchema[] = await ctx.call('$node.services');
        if (services.some(s => s.name === 'activitypub.actor')) {
          const baseUrl = await ctx.call('solid-storage.getBaseUrl');

          await ctx.call('activitypub.actor.addEndpoint', {
            actorUri: webId,
            predicate: 'https://www.w3.org/ns/activitystreams#proxyUrl',
            endpoint: urlJoin(baseUrl, 'proxy')
          });
        }
      }
    }
  }
} satisfies ServiceSchema;

export default ProxyService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ProxyService.name]: typeof ProxyService;
    }
  }
}
