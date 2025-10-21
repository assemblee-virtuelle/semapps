import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';
import { Registration } from '@semapps/ldp';

export const action = {
  visibility: 'public',
  async handler(ctx) {
    const { webId } = ctx.params;

    const containers: { [name: string]: Registration } = await ctx.call('ldp.registry.list');

    for (const { permissions, path } of Object.values(containers)) {
      if (permissions) {
        const baseUrl = this.settings.podProvider
          ? await ctx.call('solid-storage.getUrl', { webId })
          : this.settings.baseUrl;

        const containerUri = urlJoin(baseUrl, path);

        const containerRights =
          typeof permissions === 'function'
            ? permissions(this.settings.podProvider ? webId : 'system', ctx)
            : permissions;

        this.logger.info(`Refreshing rights for container ${containerUri}...`);

        const publicPermissions = await ctx.call('webacl.resource.hasRights', {
          resourceUri: containerUri,
          rights: { read: true },
          webId: 'anon'
        });

        await ctx.call('webacl.resource.deleteAllRights', {
          resourceUri: containerUri
        });

        await ctx.call('webacl.resource.addRights', {
          resourceUri: containerUri,
          additionalRights: containerRights,
          webId: 'system'
        });

        const removePublicRead = publicPermissions.read && (!containerRights.anon || !containerRights.anon.read);
        const removeDefaultPublicRead =
          !containerRights.default || !containerRights.default.anon || !containerRights.default.anon.read;

        ctx.emit(
          'webacl.resource.updated',
          {
            uri: containerUri,
            isContainer: true,
            removePublicRead,
            removeDefaultPublicRead,
            dataset: ctx.meta.dataset
          },
          { meta: { webId: null, dataset: null } }
        );
      }
    }
  }
} satisfies ActionSchema;
