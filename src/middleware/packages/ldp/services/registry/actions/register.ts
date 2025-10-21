import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';
import { Registration } from '../../../types.ts';

const RegisterAction = {
  visibility: 'public',
  params: {
    name: { type: 'string', optional: true },
    isContainer: { type: 'boolean', default: true },
    path: { type: 'string', optional: true },
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
    let registration: Registration = { ...this.settings.defaultOptions, ...ctx.params };

    // Find the type from the shape tree if necessary
    if (!registration.acceptedTypes && registration.shapeTreeUri) {
      const services = await this.broker.call('$node.services');
      if (!services.some((s: any) => s.name === 'shape-trees') && !services.some((s: any) => s.name === 'shacl'))
        throw new Error('If you use shapeTreeUri in container options, you need the shape-trees and shacl service');

      try {
        const shapeUri = await ctx.call('shape-trees.getShapeUri', { resourceUri: registration.shapeTreeUri });
        const [shapeType] = await ctx.call('shacl.getTypes', { resourceUri: shapeUri });
        registration.acceptedTypes = shapeType;
      } catch (e) {
        // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
        throw new Error(`Could not get type from shape ${registration.shapeTreeUri}. Error: ${e.message}`);
      }
    }

    registration.acceptedTypes =
      registration.acceptedTypes &&
      (await ctx.call('jsonld.parser.expandTypes', { types: registration.acceptedTypes }));

    if (!registration.name && registration.path) registration.name = registration.path;

    // Ignore undefined options
    Object.keys(registration).forEach(
      key => (registration[key] === undefined || registration[key] === null) && delete registration[key]
    );

    // Create the container
    // In Pod provider mode, the container is created when a new user is created
    if (registration.isContainer && !this.settings.podProvider) {
      await this.broker.waitForServices(['type-index']);

      let [uri] = (await ctx.call('type-index.getUris', {
        type: arrayOf(registration.acceptedTypes)[0],
        isContainer: true,
        isPrivate: registration.typeIndex === 'private'
      })) as string[];

      if (uri) {
        this.logger.info(`Container for type ${registration.acceptedTypes} already exists, skipping...`);
      } else {
        await this.createContainer(registration);
      }
    }

    // Save the options
    this.registrations[registration.name] = registration;

    ctx.emit('ldp.registry.registered', { registration }, { meta: { webId: null, dataset: null } });

    return registration;
  }
} satisfies ActionSchema;

export default RegisterAction;
