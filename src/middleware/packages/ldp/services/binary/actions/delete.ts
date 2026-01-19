import { ActionSchema } from 'moleculer';

const DeleteAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    await this.settings.adapter.deleteBinary(ctx.meta.dataset, resourceUri);

    // Detach the binary from containing containers
    const containersUris: string[] = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containersUris) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }
  }
} satisfies ActionSchema;

export default DeleteAction;
