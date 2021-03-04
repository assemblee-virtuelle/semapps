const urlJoin = require('url-join');

const WebfingerService = {
  name: 'webfinger',
  settings: {
    usersContainer: null,
    domainName: null // If not set, will be extracted from usersContainer
  },
  dependencies: ['activitypub.actor'],
  async started() {
    console.log("starting webfinger service");
    if (!this.settings.domainName) {
      this.settings.domainName = new URL(this.settings.usersContainer).host;
    };
    const routes = await this.actions.getApiRoutes();
    for (var element of routes) {
      await this.broker.call('api.addRoute', {
        route: element
      });
    }
    console.log("routes added for webfinger service");
  },
  actions: {
    async get(ctx) {
      const { resource } = ctx.params;

      const usernameMatchRegex = new RegExp(`^acct:([\\w-_.]*)@${this.settings.domainName}$`);
      const matches = resource.match(usernameMatchRegex);
      if (matches) {
        const userName = matches[1];
        const userUri = urlJoin(this.settings.usersContainer, userName);

        let actor;
        try {
          actor = await ctx.call('activitypub.actor.get', { id: userUri });
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
        } else {
          ctx.meta.$statusCode = 404;
        }
      } else {
        ctx.meta.$statusCode = 404;
      }
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
