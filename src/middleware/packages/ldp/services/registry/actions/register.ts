import urlJoin from 'url-join';
import pathModule from 'path';
import { pathToRegexp } from 'path-to-regexp';
import { defineAction } from 'moleculer';
import { arrayOf } from '../../../utils.ts';

const pathJoin = pathModule.join;

const Schema = defineAction({
  visibility: 'public',
  params: {
    path: { type: 'string', optional: true },
    fullPath: { type: 'string', optional: true },
    name: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
    acceptedTypes: { type: 'multi', rules: [{ type: 'array' }, { type: 'string' }], optional: true },
    shapeTreeUri: { type: 'string', optional: true },
    excludeFromMirror: { type: 'boolean', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: true; }' is not ... Remove this comment to see the full error message
    activateTombstones: { type: 'boolean', default: true },
    // @ts-expect-eslugParts(rror TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
    permissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
    newResourcesPermissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    controlledActions: { type: 'object', optional: true },
    readOnly: { type: 'boolean', optional: true },
    typeIndex: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let options = { ...this.settings.defaultOptions, ...ctx.params };

    // TODO Remove this when we stop using the type for the container path
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
      await ctx.call('ldp.container.createAndAttach', {
        containerUri: urlJoin(this.settings.baseUrl, options.path),
        options
      });
    }

    options.pathRegex = pathToRegexp(options.fullPath);

    // Save the options
    this.registeredContainers[options.name] = options;

    ctx.emit('ldp.registry.registered', { container: options }, { meta: { webId: null, dataset: null } });

    return options;
  }
});

export default Schema;
