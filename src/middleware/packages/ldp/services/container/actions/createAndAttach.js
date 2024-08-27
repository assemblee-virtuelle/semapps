const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getParentContainerUri } = require('../../../utils');

/**
 * Create a container and attach it to its parent container(s)
 * Recursively create the parent container(s) if they don't exist
 * In Pod provider config, the webId is required to find the Pod root
 */
module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    title: { type: 'string', optional: true },
    description: { type: 'string', optional: true },
    permissions: { type: 'multi', rules: [{ type: 'object' }, { type: 'function' }], optional: true }, // Used by the WebAclMiddleware
    webId: { type: 'string', optional: true } // Required in Pod provider config
  },
  async handler(ctx) {
    const { containerUri, title, description, permissions, webId } = ctx.params;

    const exists = await ctx.call('ldp.container.exist', { containerUri, webId: 'system' });

    if (!exists) {
      let parentContainerUri;

      // TODO find the Pod root by looking at the webID (pim:storage)
      if (this.settings.podProvider && !webId) throw new Error(`The webId param is required in Pod provider config`);
      const rootContainerUri = this.settings.podProvider
        ? await ctx.call('pod.getUrl', { webId })
        : urlJoin(this.settings.baseUrl, '/');

      const containerPath = containerUri.replace(rootContainerUri, '/');

      // Create the parent container, if it doesn't exist yet
      if (containerPath !== '/') {
        parentContainerUri = getParentContainerUri(containerUri);

        // if it is the root container, add a trailing slash
        if (!this.settings.podProvider && urlJoin(parentContainerUri, '/') === rootContainerUri) {
          parentContainerUri = urlJoin(parentContainerUri, '/');
        }

        const parentExists = await ctx.call('ldp.container.exist', {
          containerUri: parentContainerUri,
          webId: 'system'
        });

        if (!parentExists) {
          // Recursively create the parent containers, without title/description/permissions
          await this.actions.createAndAttach(
            { containerUri: parentContainerUri, permissions: {}, webId },
            { parentCtx: ctx }
          );
        }
      }

      // Then create the container
      await this.actions.create(
        {
          containerUri,
          title,
          description,
          permissions,
          webId: 'system'
        },
        { parentCtx: ctx }
      );

      // Then attach the container to its parent container
      if (parentContainerUri) {
        await this.actions.attach(
          {
            containerUri: parentContainerUri,
            resourceUri: containerUri,
            webId: 'system'
          },
          { parentCtx: ctx }
        );
      }
    }
  }
};
