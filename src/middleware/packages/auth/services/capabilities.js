const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');

const CAPABILITIES_ROUTE = '/capabilities';

/**
 * Service to host the capabilities container.
 * @type {import('moleculer').ServiceSchema}
 */
const CapabilitiesService = {
  name: 'capabilities',
  mixins: [ControlledContainerMixin],
  settings: {
    path: CAPABILITIES_ROUTE,
    excludeFromMirror: true,
    activateTombstones: false,
    permissions: {},
    newResourcesPermissions: {}
  },
  hooks: {
    before: {
      /**
       * Bypass authorization when getting the resource.
       *
       * The URI itself is considered the secret. So no more
       * authorization is necessary at this point.
       * If we decide to support capabilities with multiple
       * authorization factors, this will have to change in
       * the future.
       */
      get: ctx => {
        ctx.params.webId = 'system';
      }
    }
  },
  actions: {
    createCapability: {
      params: {
        webId: { type: 'string', optional: false },
        accessTo: { type: 'string', optional: false },
        mode: { type: 'string', optional: false }
      },
      async handler(ctx) {
        const { accessTo, mode, webId } = ctx.params;

        const capContainerUri = await this.actions.getContainerUri({ webId }, { parentCtx: ctx });

        const capUri = await this.actions.post(
          {
            containerUri: capContainerUri,
            resource: {
              '@type': 'acl:Authorization',
              'acl:accessTo': accessTo,
              'acl:mode': mode
            },
            contentType: MIME_TYPES.JSON,
            webId
          },
          { parentCtx: ctx }
        );
        return capUri;
      }
    }
  }
};

module.exports = CapabilitiesService;
