const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const containers = require('../containers');
const CONFIG = require('../config');
const { getSlugFromUri } = require('@semapps/ldp');

module.exports = {
  name: 'migration',
  dependencies: ['ldp', 'webacl'],
  actions: {
    async addRightsToAll(ctx) {
      for (let containerConfig of containers) {
        const container = await ctx.call(
          'ldp.container.get',
          {
            containerUri: urlJoin(CONFIG.HOME_URL, containerConfig.path),
            accept: MIME_TYPES.JSON
          },
          {
            meta: { webId: 'system' }
          }
        );

        console.log('Adding rights for container', container);

        await ctx.call('webacl.resource.addRights', {
          webId: 'system',
          resourceUri: container.id,
          additionalRights: {
            anon: {
              read: true
            },
            anyUser: {
              read: true,
              write: true
            }
          }
        });

        if (container['ldp:contains'] && container['ldp:contains'].length > 0) {
          for (let resource of container['ldp:contains']) {
            if (resource && Object.keys(resource).length > 0) {
              console.log('Adding rights for resource ' + resource.id);

              if (containerConfig.path === '/users') {
                await ctx.call('webacl.resource.addRights', {
                  webId: 'system',
                  resourceUri: resource.id,
                  additionalRights: {
                    anon: {
                      read: true
                    },
                    user: {
                      uri: resource.id,
                      read: true,
                      write: true,
                      control: true
                    }
                  }
                });
              } else {
                await ctx.call('webacl.resource.addRights', {
                  webId: 'system',
                  resourceUri: resource.id,
                  additionalRights: {
                    anon: {
                      read: true
                    },
                    anyUser: {
                      read: true,
                      write: true
                    }
                  }
                });
              }
            }
          }
        }
      }
    },
    async createAccountsForUsers(ctx) {
      const { usersContainer } = ctx.params;

      const container = await ctx.call('ldp.container.get', {
        containerUri: usersContainer,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      if (container['ldp:contains'] && container['ldp:contains'].length > 0) {
        for (let user of container['ldp:contains']) {
          // try {
          const result = await ctx.call('auth.account.create', {
            username: getSlugFromUri(user.id),
            email: user['pair:e-mail'],
            webId: user.id
          });
          console.log('Account created', result);
          // } catch(e) {
          //   console.error(e);
          // }
        }
      }
    }
  }
};
