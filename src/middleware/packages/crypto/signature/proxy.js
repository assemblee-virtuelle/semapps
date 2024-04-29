const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const { parseHeader, parseFile, saveDatasetMeta } = require('@semapps/middlewares');
const fetch = require('node-fetch');
const { Errors: E } = require('moleculer-web');

const stream2buffer = stream => {
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on('data', chunk => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', err => reject(err));
  });
};

const ProxyService = {
  name: 'signature.proxy',
  settings: {
    podProvider: false
  },
  dependencies: ['api'],
  async started() {
    const routeConfig = {
      name: 'proxy-endpoint',
      authorization: true,
      authentication: false,
      aliases: {
        'POST /': [parseHeader, parseFile, saveDatasetMeta, 'signature.proxy.api_query'] // parseFile handles multipart/form-data
      }
    };

    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', { route: { path: '/:username([^/.][^/]+)/proxy', ...routeConfig } });
    } else {
      await this.broker.call('api.addRoute', { route: { path: '/proxy', ...routeConfig } });
    }
  },
  actions: {
    async api_query(ctx) {
      const url = ctx.params.id;
      const method = ctx.params.method || 'GET';
      const headers = JSON.parse(ctx.params.headers) || { accept: 'application/json' };

      // If a file is uploaded, convert it to a Buffer
      const body =
        ctx.params.files && ctx.params.files.length > 0
          ? await stream2buffer(ctx.params.files[0].readableStream)
          : ctx.params.body;

      const actorUri = ctx.meta.webId;

      // Only user can query his own proxy URL
      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        if (account.username !== ctx.params.username) throw new E.ForbiddenError();
      }

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
        console.error(e);
        ctx.meta.$statusCode = !e.code ? 500 : e.code === 'ECONNREFUSED' ? 502 : e.code;
        ctx.meta.$statusMessage = e.message;
      }
    },
    async query(ctx) {
      let { url, method, headers, body, actorUri } = ctx.params;

      const signatureHeaders = await ctx.call('signature.generateSignatureHeaders', {
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

        return {
          body: responseBody,
          headers: Object.fromEntries(response.headers.entries()),
          status: response.status,
          statusText: response.statusText
        };
      } else {
        this.logger.warn(
          `Could not ${method || 'GET'} ${url} through proxy of ${actorUri} (Error ${response.status}: ${
            response.statusText
          })`
        );
        throw new MoleculerError(response.statusText, response.status);
      }
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      if (this.settings.podProvider) {
        const services = await ctx.call('$node.services');
        if (services.filter(s => s.name === 'activitypub.actor')) {
          await ctx.call('activitypub.actor.addEndpoint', {
            actorUri: webId,
            predicate: 'https://www.w3.org/ns/activitystreams#proxyUrl',
            endpoint: urlJoin(webId, 'proxy')
          });
        }
      }
    }
  }
};

module.exports = ProxyService;
