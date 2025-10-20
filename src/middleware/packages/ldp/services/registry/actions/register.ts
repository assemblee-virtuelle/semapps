import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    path: { type: 'string', optional: true },
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

    // Find the type from the shape tree if necessary
    if (!options.acceptedTypes && options.shapeTreeUri) {
      const services = await this.broker.call('$node.services');
      if (!services.some((s: any) => s.name === 'shape-trees') && !services.some((s: any) => s.name === 'shacl'))
        throw new Error('If you use shapeTreeUri in container options, you need the shape-trees and shacl service');

      try {
        const shapeUri = await ctx.call('shape-trees.getShapeUri', { resourceUri: options.shapeTreeUri });
        const [shapeType] = await ctx.call('shacl.getTypes', { resourceUri: shapeUri });
        options.acceptedTypes = shapeType;
      } catch (e) {
        // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
        throw new Error(`Could not get type from shape ${options.shapeTreeUri}. Error: ${e.message}`);
      }
    }

    options.acceptedTypes =
      options.acceptedTypes && (await ctx.call('jsonld.parser.expandTypes', { types: options.acceptedTypes }));

    if (!options.name) options.name = options.path;

    // If slugs are not allowed, we must registered this container with the type index
    if ((!this.settings.allowSlugs || !options.path) && !options.typeIndex) options.typeIndex = 'public';

    if (options.jsonContext) {
      throw new Error('The jsonContext container option has been deprecated, please remove it');
    }

    // Ignore undefined options
    Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

    if (options.podsContainer === true) {
      // Skip container creation for the root PODs container (it is not a real LDP container since no dataset have these data)
    } else if (this.settings.podProvider) {
      // In Pod provider mode, the container is created when a new user is created
    } else {
      await this.broker.waitForServices(['type-index']);
      let [containerUri] = await ctx.call('type-index.getContainersUris', {
        type: arrayOf(options.acceptedTypes)[0],
        isPrivate: options.typeIndex === 'private'
      });

      if (containerUri && (await ctx.call('ldp.container.exist', { containerUri }))) {
        this.logger.info(`Container for type ${options.acceptedTypes} already exists, skipping...`);
      } else {
        this.logger.info(`Creating container for ${options.acceptedTypes}...`);

        containerUri = await ctx.call('triplestore.named-graph.create', {
          baseUrl: this.settings.baseUrl,
          slug: this.settings.allowSlugs ? options.path : undefined // TODO allow path in slug
        });

        await ctx.call('ldp.container.createAndAttach', { containerUri, options });
      }
    }

    // Save the options
    this.registeredContainers[options.name] = options;

    ctx.emit('ldp.registry.registered', { container: options }, { meta: { webId: null, dataset: null } });

    return options;
  }
} satisfies ActionSchema;

export default Schema;
