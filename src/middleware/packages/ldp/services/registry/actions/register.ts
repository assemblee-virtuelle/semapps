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
        const containerUri = await ctx.call('ldp.container.create', { registration });

        await ctx.call('type-index.register', {
          types: arrayOf(registration.acceptedTypes),
          uri: containerUri,
          isContainer: true,
          isPrivate: registration.typeIndex === 'private'
        });
      }
    }

    // Save the options
    this.registrations[registration.name] = registration;

    ctx.emit('ldp.registry.registered', { registration }, { meta: { webId: null, dataset: null } });

    return registration;
  }
} satisfies ActionSchema;

export default RegisterAction;
