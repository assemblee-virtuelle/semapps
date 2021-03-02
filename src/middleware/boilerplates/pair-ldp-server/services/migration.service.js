const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const containers = require('../containers');
const CONFIG = require('../config');

module.exports = {
  name: 'migration',
  dependencies: ['ldp', 'webacl'],
  actions: {
    async addRightsToAll(ctx) {
      for( let containerConfig of containers ) {
        const container = await ctx.call(
          'ldp.container.get',
          {
            containerUri: urlJoin(CONFIG.HOME_URL, containerConfig.path),
            accept: MIME_TYPES.JSON,
          },
          {
            meta: { webId: 'system' }
          }
        );

        await ctx.call('webacl.resource.addRights',{
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

        console.log('Rights added for container ' + container.id);

        for (let resource of container['ldp:contains']) {
          if( containerConfig.path === '/users' ) {
            await ctx.call('webacl.resource.addRights',{
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
            await ctx.call('webacl.resource.addRights',{
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

          console.log('Rights added for resource ' + resource.id);
        }
      }
    }
  }
};
