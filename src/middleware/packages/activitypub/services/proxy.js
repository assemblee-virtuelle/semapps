const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const { quad, namedNode, blankNode } = require('@rdfjs/data-model');
const fetch = require('node-fetch');
const { Errors: E } = require('moleculer-web');
const { MIME_TYPES } = require('@semapps/mime-types');

const ProxyService = {
  name: 'activitypub.proxy',
  settings: {
    podProvider: false
  },
  dependencies: ['api'],
  async started() {
    const routeConfig = {
      authorization: true,
      authentication: false,
      mergeParams: true,
      name: 'proxy-endpoint',
      aliases: {
        'POST /': 'activitypub.proxy.api_query'
      },
      bodyParsers: {
        json: true,
        urlencoded: true
      }
    };

    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', { route: { path: '/:username/proxy', ...routeConfig } });
    } else {
      await this.broker.call('api.addRoute', { route: { path: '/proxy', ...routeConfig } });
    }
  },
  actions: {
    async api_query(ctx) {
      const resourceUri = ctx.params.id;
      const actorUri = ctx.meta.webId;

      // Only user can query his own proxy URL
      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        if (account.username !== ctx.params.username) throw new E.ForbiddenError();
      }

      try {
        return await ctx.call('activitypub.proxy.query', {
          resourceUri,
          actorUri
        });
      } catch (e) {
        console.error(e);
        ctx.meta.$statusCode = e.code || 500;
        ctx.meta.$statusMessage = e.message;
      }
    },
    async query(ctx) {
      const { resourceUri, actorUri } = ctx.params;

      const signatureHeaders = await ctx.call('signature.generateSignatureHeaders', {
        url: resourceUri,
        method: 'GET',
        actorUri
      });

      const response = await fetch(resourceUri, {
        headers: {
          Accept: 'application/json',
          ...signatureHeaders
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new MoleculerError(response.statusText, response.status);
      }
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;

      if (this.settings.podProvider) {
        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToAdd: [
            quad(namedNode(webId), namedNode('https://www.w3.org/ns/activitystreams#endpoints'), blankNode('b_0')),
            quad(blankNode('b_0'), namedNode('https://www.w3.org/ns/activitystreams#proxyUrl'), namedNode(urlJoin(webId, 'proxy'))),
          ],
          webId: 'system'
        });
      }
    }
  }
};

module.exports = ProxyService;
