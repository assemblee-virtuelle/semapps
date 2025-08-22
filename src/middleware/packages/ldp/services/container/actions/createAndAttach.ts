import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';
import { getParentContainerUri } from '../../../utils.ts';

/**
 * Create a container and attach it to its parent container(s)
 * Recursively create the parent container(s) if they don't exist
 * In Pod provider config, the webId is required to find the Pod root
 */
const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    title: { type: 'string', optional: true },
    description: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    options: { type: 'object', optional: true },
    webId: { type: 'string', optional: true } // Required in Pod provider config
  },
  async handler(ctx) {
    const { containerUri, title, description, options, webId } = ctx.params;

    const exists = await ctx.call('ldp.container.exist', { containerUri });

    if (!exists) {
      let parentContainerUri;

      if (this.settings.podProvider && (!webId || webId === 'anon' || webId === 'system'))
        throw new Error(`The webId param is required in Pod provider config. Provided: ${webId}`);

      const rootContainerUri = this.settings.podProvider
        ? await ctx.call('solid-storage.getUrl', { webId })
        : urlJoin(this.settings.baseUrl, '/');

      const containerPath = containerUri.replace(rootContainerUri, '/');

      // Create the parent container, if it doesn't exist yet
      if (containerPath !== '/') {
        parentContainerUri = getParentContainerUri(containerUri);

        // if it is the root container, add a trailing slash
        if (!this.settings.podProvider && urlJoin(parentContainerUri, '/') === rootContainerUri) {
          parentContainerUri = urlJoin(parentContainerUri, '/');
        }

        const parentExists = await ctx.call('ldp.container.exist', { containerUri: parentContainerUri });

        if (!parentExists) {
          // Recursively create the parent containers, without title/description/permissions
          await this.actions.createAndAttach(
            { containerUri: parentContainerUri, options: { permissions: {} }, webId },
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
          options,
          webId: this.settings.podProvider ? webId : 'system'
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
} satisfies ActionSchema;

export default Schema;
