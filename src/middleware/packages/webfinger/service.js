const { MIME_TYPES } = require('@semapps/mime-types');

const WebfingerService = {
  name: 'webfinger',
  settings: {
    baseUrl: null,
    domainName: null // If not set, will be extracted from baseUrl
  },
  dependencies: ['triplestore', 'ldp'],
  started() {
    if (!this.settings.domainName) {
      this.settings.domainName = new URL(this.settings.baseUrl).host;
    }
  },
  actions: {
    async get(ctx) {
      const { resource } = ctx.params;

      const usernameMatchRegex = new RegExp(`^acct:([\\w-_.]*)@${this.settings.domainName}$`);
      const matches = resource.match(usernameMatchRegex);

      if (matches) {
        const userName = matches[1];
        const result = await ctx.call('triplestore.query', {
          query: `
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            SELECT ?userUri
            WHERE {
              ?userUri a ?type .
              ?userUri as:preferredUsername "${userName}" .
              FILTER( ?type IN (as:Application, as:Group, as:Organization, as:Person, as:Service) ) .
            }
          `,
          accept: MIME_TYPES.JSON
        });

        if( result.length > 0 ) {
          const userUri = result[0].userUri.value;

          let actor;
          try {
            actor = await ctx.call('ldp.resource.get', { resourceUri: userUri });
          } catch (e) {
            actor = null;
          }

          if (actor) {
            return {
              subject: resource,
              aliases: [userUri],
              links: [
                {
                  rel: 'self',
                  type: 'application/activity+json',
                  href: userUri
                }
              ]
            };
          }
        }
      }

      ctx.meta.$statusCode = 404;
    },
    async getRemoteUri(ctx) {
      const { account } = ctx.params;
      const domainName = account.split('@').pop();
      const webfingerUrl = `https://${domainName}/.well-known/webfinger?resource=acct:${account}`;

      const response = await fetch(webfingerUrl);

      if (response.ok) {
        const json = await response.json();
        const link = json.links.find(l => l.type === 'application/activity+json');
        if (link) {
          return link.href;
        }
      }
    },
    getApiRoutes() {
      return [
        {
          bodyParsers: { json: true },
          aliases: {
            'GET .well-known/webfinger': 'webfinger.get'
          }
        }
      ];
    }
  }
};

module.exports = WebfingerService;
