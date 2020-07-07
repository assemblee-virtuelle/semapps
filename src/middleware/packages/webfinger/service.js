const urlJoin = require('url-join');

const WebfingerService = {
  name: 'webfinger',
  settings: {
    usersContainer: null,
    domainName: null // If not set, will be extracted from usersContainer
  },
  dependencies: ['activitypub.actor'],
  started() {
    if (!this.settings.domainName) {
      this.settings.domainName = new URL(this.settings.usersContainer).host;
    }
  },
  actions: {
    async get(ctx) {
      const { resource } = ctx.params;

      const usernameMatchRegex = new RegExp(`^acct:(\\w*)@${this.settings.domainName}$`);
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

        if( actor ) {
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
