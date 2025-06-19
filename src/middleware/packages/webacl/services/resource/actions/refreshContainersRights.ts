import urlJoin from 'url-join';
import { defineAction } from 'moleculer';

export const action = defineAction({
  visibility: 'public',
  async handler(ctx) {
    const { webId } = ctx.params;

    const containers = await ctx.call('ldp.registry.list');

    // @ts-expect-error TS(2339): Property 'permissions' does not exist on type 'unk... Remove this comment to see the full error message
    for (const { permissions, podsContainer, path } of Object.values(containers)) {
      if (permissions && !podsContainer) {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const baseUrl = this.settings.podProvider
          ? await ctx.call('solid-storage.getUrl', { webId })
          : // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            this.settings.baseUrl;

        const containerUri = urlJoin(baseUrl, path);

        const containerRights =
          typeof permissions === 'function'
            ? // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              permissions(this.settings.podProvider ? webId : 'system', ctx)
            : permissions;

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
            // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
            dataset: ctx.meta.dataset
          },
          { meta: { webId: null, dataset: null } }
        );
      }
    }
  }
});
