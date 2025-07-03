module.exports = {
  name: 'webacl.authorizer',
  dependencies: 'permissions',
  async started() {
    await this.broker.call('permissions.addAuthorizer', { actionName: `${this.name}.hasPermission` });
  },
  actions: {
    async hasPermission(ctx) {
      const { uri, type, mode, webId } = ctx.params;

      if (type === 'resource' || type === 'container') {
        // Convert acl:Read to read
        const shortMode = mode.replace('acl:', '').toLowerCase();

        const rights = await ctx.call('webacl.resource.hasRights', {
          resourceUri: uri,
          webId,
          rights: {
            [shortMode]: true
          }
        });

        return rights[shortMode];
      }

      return undefined;
    }
  }
};
