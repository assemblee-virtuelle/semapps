const { getContainerFromUri } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containers: { type: 'array' }
  },
  async handler(ctx) {
    const { containers } = ctx.params;

    // 1st loop: Create all containers defined in configurations
    for (let container of containers) {
      const containerUri = this.getContainerUri(container);
      const exists = await ctx.call('ldp.container.exist', { containerUri });
      if (!exists) {
        console.log(`Container ${containerUri} doesn't exist, creating it...`);
        await ctx.call('ldp.container.create', { containerUri, webId: 'system' });
      }
    }

    // 2nd loop: Attach child containers to parent containers
    // Child containers must have been created first, or the attach action will fail
    for (let container of containers) {
      const containerUri = this.getContainerUri(container);

      // Find all children containers for this container
      const childContainersUris = containers
        .map(childContainer => this.getContainerUri(childContainer))
        .filter(
          childContainerUri =>
            containerUri !== childContainerUri &&
            getContainerFromUri(childContainerUri) === containerUri.replace(/\/$/, '')
        );

      for (let childContainerUri of childContainersUris) {
        console.log('ldp.container.attach', containerUri, childContainerUri);
        await ctx.call('ldp.container.attach', { containerUri, resourceUri: childContainerUri, webId: 'system' });
      }
    }
  }
};
