import { ActionSchema } from 'moleculer';

const DeleteAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    await this.settings.adapter.deleteBinary(resourceUri);
  }
} satisfies ActionSchema;

export default DeleteAction;
