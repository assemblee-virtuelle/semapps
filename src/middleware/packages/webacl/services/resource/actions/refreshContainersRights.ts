const urlJoin = require('url-join');

module.exports = {
  action: {
    visibility: 'public',
    async handler(ctx) {
      const { webId } = ctx.params;

      const containers = await ctx.call('ldp.registry.list');

      for (const { permissions, podsContainer, path } of Object.values(containers)) {
        if (permissions && !podsContainer) {
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
  }
};
