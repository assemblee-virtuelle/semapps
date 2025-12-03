import { ActionSchema } from 'moleculer';

const StoreAction = {
  visibility: 'public',
  params: {
    stream: { type: 'object' },
    mimeType: { type: 'string' }
  },
  async handler(ctx) {
    const { stream, mimeType } = ctx.params;

    const resourceUri = await this.settings.adapter.storeBinary(stream, mimeType, ctx.meta.dataset);

    return resourceUri;
  }
} satisfies ActionSchema;

export default StoreAction;
