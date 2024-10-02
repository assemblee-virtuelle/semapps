const urlJoin = require('url-join');
const pathJoin = require('path').join;
const { pathToRegexp } = require('path-to-regexp');
const defaultOptions = require('../defaultOptions');

module.exports = {
  visibility: 'public',
  params: {
    path: { type: 'string', optional: true },
    fullPath: { type: 'string', optional: true },
    name: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    acceptedTypes: { type: 'multi', rules: [{ type: 'array' }, { type: 'string' }], optional: true },
    excludeFromMirror: { type: 'boolean', optional: true },
    activateTombstones: { type: 'boolean', default: true },
    permissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    newResourcesPermissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    controlledActions: { type: 'object', optional: true },
    readOnly: { type: 'boolean', optional: true }
  },
  async handler(ctx) {
    let { path, acceptedTypes, fullPath, name, podsContainer, dataset, ...options } = ctx.params;

    acceptedTypes = acceptedTypes && (await ctx.call('jsonld.parser.expandTypes', { types: acceptedTypes }));

    // If no path is provided, automatically find it based on the acceptedTypes
    if (!path) {
      if (!acceptedTypes || acceptedTypes.length !== 1) {
        throw new Error(
          'If no path is set for the ControlledContainerMixin, you must set one (and only one) acceptedTypes'
        );
      }
      // If the resource type is invalid, an error will be thrown here
      path = await ctx.call('ldp.container.getPath', { resourceType: acceptedTypes[0] });
      this.logger.debug(`Automatically generated the path ${path} for resource type ${acceptedTypes[0]}`);
    }

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
      // TODO see if we can base ourselves on a general config for the POD data path
      fullPath = pathJoin('/:username([^/.][^/]+)', 'data', path);
    } else {
      // Ensure the container has been created
      await ctx.call('ldp.container.createAndAttach', {
        containerUri: urlJoin(this.settings.baseUrl, path),
        permissions: options.permissions || defaultOptions.permissions // Used by the WebAclMiddleware
      });
    }

    const pathRegex = pathToRegexp(fullPath);

    // Save the options
    this.registeredContainers[name] = {
      path,
      fullPath,
      pathRegex,
      name,
      ...defaultOptions,
      podsContainer,
      acceptedTypes,
      ...options
    };

    ctx.emit(
      'ldp.registry.registered',
      { container: this.registeredContainers[name] },
      { meta: { webId: null, dataset: null } }
    );

    return this.registeredContainers[name];
  }
};
