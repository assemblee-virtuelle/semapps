import { ActionSchema } from 'moleculer';

const StoreAction = {
  visibility: 'public',
  params: {
    file: { type: 'object', optional: true }
  },
  async handler(ctx) {
    const { file } = ctx.params;

    const resourceUri = await this.settings.adapter.storeBinary(file.readableStream, file.mimetype, ctx.meta.dataset);

    return resourceUri;
  }
} satisfies ActionSchema;

export default StoreAction;
