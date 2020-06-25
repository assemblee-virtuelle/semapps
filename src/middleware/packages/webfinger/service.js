const urlJoin = require('url-join');

const WebfingerService = {
  name: 'webfinger',
  settings: {
    usersContainer: null,
    domainName: null
  },
  actions: {
    async get(ctx) {
      const { resource } = ctx.params;
      const usernameMatchRegex = new RegExp(`^acct:(\\w*)@${this.settings.domainName}$`)
      const matches = resource.match(usernameMatchRegex);
      if( matches ) {
        const userName = matches[1];
        const userUri = urlJoin(this.settings.usersContainer, userName);

        // TODO check actor exists

        return({
          subject: resource,
          aliases: [ userUri ],
          links: [
            {
              rel: "self",
              type: "application/activity+json",
              href: userUri
            }
          ]
        })

      } else {
        // 404
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
