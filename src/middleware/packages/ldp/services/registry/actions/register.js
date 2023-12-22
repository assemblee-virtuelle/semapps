const urlJoin = require('url-join');
const pathJoin = require('path').join;
const { pathToRegexp } = require('path-to-regexp');

module.exports = {
  visibility: 'public',
  params: {
    path: { type: 'string' },
    name: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    permissions: { type: 'object', optional: true },
    excludeFromMirror: { type: 'boolean', optional: true },
    newResourcesPermissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    controlledActions: { type: 'object', optional: true },
    readOnly: { type: 'boolean', optional: true }
  },
  async handler(ctx) {
    let { path, fullPath, name, podsContainer, ...options } = ctx.params;
    if (!fullPath) fullPath = path;
    if (!name) name = path;

    if (options.jsonContext) {
      throw new Error('The jsonContext container option has been deprecated, please remove it');
    }

    // Ignore undefined options
    Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

    if (podsContainer === true) {
      // Skip container creation for the root PODs container (it is not a real LDP container since no dataset have these data)
    } else if (this.settings.podProvider) {
      // 1. Ensure the container has been created for each user
      const accounts = await ctx.call('auth.account.find');
      for (const account of accounts) {
        if (!account.podUri) throw new Error(`The podUri is not defined for account ${account.username}`);
        ctx.meta.dataset = account.username;
        const containerUri = urlJoin(account.podUri, path);
        await this.createAndAttachContainer(ctx, containerUri, path, options);
      }

      // TODO see if we can base ourselves on a general config for the POD data path
      fullPath = pathJoin('/:username([^/.][^/]+)', 'data', path);
    } else {
      // Ensure the container has been created
      const containerUri = urlJoin(this.settings.baseUrl, path);
      await this.createAndAttachContainer(ctx, containerUri, path, options);
    }

    const pathRegex = pathToRegexp(fullPath);

    // Save the options
    this.registeredContainers[name] = { path, fullPath, pathRegex, name, ...options };

    ctx.emit('ldp.registry.registered', { container: this.registeredContainers[name] }, { meta: { webId: null } });

    return this.registeredContainers[name];
  }
};
