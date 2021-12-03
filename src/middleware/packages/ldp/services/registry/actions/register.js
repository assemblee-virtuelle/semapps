const urlJoin = require('url-join');
const pathJoin = require('path').join;
const { pathToRegexp } = require('path-to-regexp');
const getContainerRoute = require('../../../routes/getContainerRoute');
const getResourcesRoute = require('../../../routes/getResourcesRoute');

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
    let { path, fullPath, name, podsContainer, ...options } = ctx.params;
    if (!fullPath) fullPath = path;
    if (!name) name = path;

    // Ignore undefined options
    Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

    if (this.settings.podProvider && podsContainer === true) {
      name = 'actors';
      await this.broker.call('api.addRoute', { route: getResourcesRoute(this.settings.baseUrl) });
    } else if (this.settings.podProvider) {
      // 1. Ensure the container has been created for each user
      const accounts = await ctx.call('auth.account.find');
      for (let account of accounts) {
        if (!account.podUri) throw new Error('The podUri is not defined for account ' + account.username);
        const containerUri = urlJoin(account.podUri, path);
        await this.createAndAttachContainer(ctx, containerUri, path);
      }

      // TODO see if we can base ourselves on a general config for the POD data path
      fullPath = pathJoin('/:username', 'data', path);

      // 2. Create the API route
      const containerUriWithParams = urlJoin(this.settings.baseUrl, fullPath);
      await this.broker.call('api.addRoute', { route: getContainerRoute(containerUriWithParams) });
    } else {
      // 1. Ensure the container has been created
      const containerUri = urlJoin(this.settings.baseUrl, path);
      await this.createAndAttachContainer(ctx, containerUri, path);

      // 2. Create the API route
      await this.broker.call('api.addRoute', { route: getContainerRoute(containerUri) });
    }

    const pathRegex = pathToRegexp(fullPath);

    // 3. Save the options
    this.registeredContainers[name] = { path, fullPath, pathRegex, name, ...options };

    ctx.emit(
      'ldp.registry.registered',
      { container: this.registeredContainers[name] },
      { meta: { webId: null, dataset: null } }
    );
  }
};
