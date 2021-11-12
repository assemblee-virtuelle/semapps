const urlJoin = require('url-join');
const getContainerRoute = require('../../../routes/getContainerRoute');
const getResourceRoute = require('../../../routes/getResourceRoute');

module.exports = {
  visibility: 'public',
  params: {
    type: { type: 'enum', values: ['container', 'resource'] },
    path: { type: 'string' },
    name: { type: 'string', optional: true },
    acceptedTypes: { type: 'array', optional: true },
    controlledActions: { type: 'object', optional: true },
    // Fetch options
    accept: { type: 'string', optional: true },
    jsonContext: { type: 'multi', rules: [{ type: 'string' }, { type: 'object' }, { type: 'array' }], optional: true },
    dereference: { type: 'array', optional: true },
    permissions: { type: 'object', optional: true },
    // Containers only
    newResourcesPermissions: { type: 'object', optional: true },
  },
  async handler(ctx) {
    let { type, path, name, controlledActions, ...options } = ctx.params;
    if (!name) name = path;

    // Ignore undefined options
    Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

    const createAndAttach = type === 'container' ? this.createAndAttachContainer : this.createAndAttachResource;
    const getRoute = type === 'container' ? getContainerRoute : getResourceRoute;

    if (this.settings.podProvider) {
      // 1. Ensure the container or resource has been created for each user
      const accounts = await ctx.call('auth.account.find');
      for (let account of accounts) {
        if (!account.podUri) throw new Error('The podUri is not defined for account ' + account.username);
        const uri = urlJoin(account.podUri, path);
        await createAndAttach(ctx, uri, path, controlledActions);
      }

      // 2. Create the API route
      const uriWithParams = urlJoin(this.settings.baseUrl, ':username', path);
      await this.broker.call('api.addRoute', {route: getRoute(uriWithParams)});
    } else {
      // 1. Ensure the container or resource has been created
      const uri = urlJoin(this.settings.baseUrl, path);
      await createAndAttach(ctx, uri, path, controlledActions);

      // 2. Create the API route
      await this.broker.call('api.addRoute', { route: getRoute(uri)} );
    }

    // 3. Save on the registry
    this.registry[name] = ctx.params;
  }
};
