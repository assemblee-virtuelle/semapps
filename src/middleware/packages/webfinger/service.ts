import fetch from 'node-fetch';
import { ServiceSchema, defineAction } from 'moleculer';

const WebfingerService = {
  name: 'webfinger' as const,
  settings: {
    baseUrl: null,
    domainName: null // If not set, will be extracted from baseUrl
  },
  dependencies: ['api', 'auth.account'],
  async started() {
    if (!this.settings.domainName) {
      if (!this.settings.baseUrl) throw new Error('If no domainName is defined, the baseUrl must be set');
      this.settings.domainName = new URL(this.settings.baseUrl).host;
    }

    await this.broker.call('api.addRoute', {
      route: {
        path: '/.well-known', // .well-known routes must use the root path
        name: 'webfinger-endpoint',
        bodyParsers: { json: true },
        aliases: {
          'GET /webfinger': 'webfinger.get'
        }
      }
    });
  },
  actions: {
    get: defineAction({
      async handler(ctx) {
        const { resource } = ctx.params;

        const usernameMatchRegex = new RegExp(`^acct:([\\w-_.]*)@${this.settings.domainName}$`);
        const matches = resource?.match(usernameMatchRegex);

        if (matches) {
          const username = matches[1];
          const accounts = await ctx.call('auth.account.find', { query: { username } });
          if (accounts.length > 0) {
            return {
              subject: resource,
              aliases: [accounts[0].webId],
              links: [
                {
                  rel: 'self',
                  type: 'application/activity+json',
                  href: accounts[0].webId
                }
              ]
            };
          }
        }

        ctx.meta.$statusCode = 404;
      }
    }),

    getRemoteUri: defineAction({
      // TODO add cache if response.ok
      async handler(ctx) {
        const { account } = ctx.params;
        const splitAccount = account.split('@');
        const domainName = splitAccount.pop();
        const userName = splitAccount.pop();
        const webfingerUrl = `http://${domainName}/.well-known/webfinger?resource=acct:${userName}@${domainName}`;

        const response = await fetch(webfingerUrl);

        if (response.ok) {
          const json = await response.json();
          const link = json.links.find(l => l.type === 'application/activity+json');
          if (link) {
            return link.href;
          }
        }
      }
    })
  }
} satisfies ServiceSchema;

export default WebfingerService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebfingerService.name]: typeof WebfingerService;
    }
  }
}
