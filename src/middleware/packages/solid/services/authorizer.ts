module.exports = {
  name: 'solid-authorizer',
  dependencies: 'permissions',
  async started() {
    await this.broker.call('permissions.addAuthorizer', { actionName: `${this.name}.hasPermission`, priority: 1 });
  },
  actions: {
    async hasPermission(ctx) {
      const { uri, webId } = ctx.params;

      // The owner has access to all resources on their Pod
      if (uri.startsWith(`${webId}/`)) {
        return true;
      }

      return undefined;
    }
  }
};
