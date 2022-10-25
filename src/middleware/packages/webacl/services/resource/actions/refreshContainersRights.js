const urlJoin = require('url-join');

module.exports = {
  action: {
    visibility: 'public',
    async handler(ctx) {
      if (this.settings.podProvider) throw new Error('Not implemented yet for POD provider config');

      const containers = await ctx.call('ldp.registry.list');

      for (const { permissions, path } of Object.values(containers)) {
        if (permissions) {
          const containerUri = urlJoin(this.settings.baseUrl, path);
          const containerRights = typeof permissions === 'function' ? permissions('system') : permissions;

          this.logger.info(`Refreshing rights for container ${containerUri}...`);

          const perms = await ctx.call('webacl.resource.hasRights', {
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

          const removePublicRead = perms.read && (!containerRights.anon || !containerRights.anon.read);
          const removeDefaultPublicRead =
            !containerRights.default || !containerRights.default.anon || !containerRights.default.anon.read;
          ctx.emit(
            'webacl.resource.updated',
            { uri: containerUri, isContainer: true, removePublicRead, removeDefaultPublicRead },
            { meta: { webId: null, dataset: null } }
          );
        }
      }
    }
  }
};
