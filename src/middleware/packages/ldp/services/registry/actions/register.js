const urlJoin = require('url-join');
const pathJoin = require('path').join;
const { pathToRegexp } = require('path-to-regexp');
const { arrayOf } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    path: { type: 'string', optional: true },
    fullPath: { type: 'string', optional: true },
    name: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    acceptedTypes: { type: 'multi', rules: [{ type: 'array' }, { type: 'string' }], optional: true },
    shapeTreeUri: { type: 'string', optional: true },
    excludeFromMirror: { type: 'boolean', optional: true },
    activateTombstones: { type: 'boolean', default: true },
    permissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    newResourcesPermissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    controlledActions: { type: 'object', optional: true },
    readOnly: { type: 'boolean', optional: true },
    typeIndex: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let options = { ...this.settings.defaultOptions, ...ctx.params };

    // TODO Remove this when we stop using the type for the container path
    if (!options.acceptedTypes && options.shapeTreeUri) {
      const services = await this.broker.call('$node.services');
      if (!services.some(s => s.name === 'shex'))
        throw new Error('If you use shapeTreeUri in container options, you need the shex service');

      const shapeType = await ctx.call('shex.getType', { shapeUri: options.shapeTreeUri });
      if (!shapeType) throw new Error(`Could not get type from shape ${options.shapeTreeUri}`);
      options.acceptedTypes = [shapeType];
    }

    options.acceptedTypes =
      options.acceptedTypes && (await ctx.call('jsonld.parser.expandTypes', { types: options.acceptedTypes }));

    // If no path is provided, automatically find it based on the acceptedTypes
    if (!options.path) {
      if (!options.acceptedTypes || options.acceptedTypes.length !== 1) {
        throw new Error(
          `If no path is set for the ControlledContainerMixin, you must set one (and only one) acceptedTypes. Provided: ${arrayOf(
            options?.acceptedTypes
          ).join(', ')}`
        );
      }
      // If the resource type is invalid, an error will be thrown here
      options.path = await ctx.call('ldp.container.getPath', { resourceType: options.acceptedTypes[0] });
      this.logger.debug(
        `Automatically generated the path ${options.path} for resource type ${options.acceptedTypes[0]}`
      );
    }

    if (!options.fullPath) options.fullPath = options.path;
    if (!options.name) options.name = options.path;

    if (options.jsonContext) {
      throw new Error('The jsonContext container option has been deprecated, please remove it');
    }

    // Ignore undefined options
    Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

    if (options.podsContainer === true) {
      // Skip container creation for the root PODs container (it is not a real LDP container since no dataset have these data)
    } else if (this.settings.podProvider) {
      // TODO see if we can base ourselves on a general config for the POD data path
      options.fullPath = pathJoin('/:username([^/.][^/]+)', 'data', options.path);
    } else {
      // Ensure the container has been created
      await ctx.call('ldp.container.createAndAttach', {
        containerUri: urlJoin(this.settings.baseUrl, options.path),
        options,
        permissions: options.permissions // Used by the WebAclMiddleware
      });
    }

    options.pathRegex = pathToRegexp(options.fullPath);

    // Save the options
    this.registeredContainers[options.name] = options;

    ctx.emit('ldp.registry.registered', { container: options }, { meta: { webId: null, dataset: null } });

    return options;
  }
};
