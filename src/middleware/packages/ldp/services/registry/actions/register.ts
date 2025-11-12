import { ActionSchema } from 'moleculer';
import { Registration } from '../../../types.ts';

const RegisterAction = {
  visibility: 'public',
  params: {
    name: { type: 'string', optional: true },
    isContainer: { type: 'boolean', default: true },
    path: { type: 'string', optional: true },
    types: { type: 'multi', rules: [{ type: 'array' }, { type: 'string' }], optional: true },
    excludeFromMirror: { type: 'boolean', optional: true },
    activateTombstones: { type: 'boolean', default: true },
    permissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    newResourcesPermissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true },
    controlledActions: { type: 'object', optional: true },
    typeIndex: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let registration: Registration = ctx.params;

    registration.types =
      registration.types && (await ctx.call('jsonld.parser.expandTypes', { types: registration.types }));

    if (!registration.name && registration.path) registration.name = registration.path;

    // Ignore undefined options
    Object.keys(registration).forEach(
      key => (registration[key] === undefined || registration[key] === null) && delete registration[key]
    );

    // Keep in memory
    this.registrations.push({ ...this.settings.defaultOptions, ...ctx.params });

    ctx.emit('ldp.registry.registered', { registration }, { meta: { webId: null, dataset: null } });

    return registration;
  }
} satisfies ActionSchema;

export default RegisterAction;
