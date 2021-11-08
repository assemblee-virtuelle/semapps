const urlJoin = require('url-join');
const getContainerRoute = require('../../../routes/getContainerRoute');
const { getContainerFromUri } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    path: { type: 'string' },
    name: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    jsonContext: { type: 'multi', rules: [{ type: 'string' }, { type: 'object' }, { type: 'array' }], optional: true },
    dereference: { type: 'array', optional: true },
    permissions: { type: 'object', optional: true },
    newResourcesPermissions: { type: 'object', optional: true },
    controlledActions: { type: 'object', optional: true }
  },
  async handler(ctx) {
    let { path, name, ...options } = ctx.params;
    if (!name) name = path;

    if (this.settings.podProvider) {
      // 1. Ensure the container has been created for each user
      const accounts = await ctx.call('auth.account.find');

      for (let account of accounts) {
        const containerUri = urlJoin(account.podUri, path);
        const exists = await this.actions.exist({ containerUri, webId: 'system' }, { parentCtx: ctx });
        if (!exists) {
          await this.actions.create({ containerUri, webId: 'system' }, { parentCtx: ctx });

          // 2. Attach the container to its parent container
          if (path !== '/') {
            const parentContainerUri = getContainerFromUri(containerUri);
            const exists = await this.actions.exist(
              { containerUri: parentContainerUri, webId: 'system' },
              { parentCtx: ctx }
            );
            if (exists) {
              await this.actions.attach(
                { containerUri: parentContainerUri, resourceUri: containerUri, webId: 'system' },
                { parentCtx: ctx }
              );
            }
          }
        }
      }

      // 3. Create the API route
      const containerUriWithParams = urlJoin(this.settings.baseUrl, ':username', path);
      await this.broker.call('api.addRoute', { route: getContainerRoute(containerUriWithParams) });
    } else {
      // 1. Ensure the container has been created
      const containerUri = urlJoin(this.settings.baseUrl, path);
      const exists = await this.actions.exist({ containerUri, webId: 'system' }, { parentCtx: ctx });
      if (!exists) {
        await this.actions.create({ containerUri, webId: 'system' }, { parentCtx: ctx });

        // 2. Attach the container to its parent container (if it exists)
        if (path !== '/') {
          const parentContainerUri = getContainerFromUri(containerUri);
          const exists = await this.actions.exist(
            { containerUri: parentContainerUri, webId: 'system' },
            { parentCtx: ctx }
          );
          if (exists) {
            await this.actions.attach(
              { containerUri: parentContainerUri, resourceUri: containerUri, webId: 'system' },
              { parentCtx: ctx }
            );
          }
        }
      }

      // 3. Create the API route
      await this.broker.call('api.addRoute', { route: getContainerRoute(containerUri) });
    }

    // 4. Save the options
    this.registeredContainers[name] = { path, ...options };
  }
};
