import { ActionSchema } from 'moleculer';

const IsBinaryAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    return await this.settings.adapter.isBinary(resourceUri);
  }
} satisfies ActionSchema;

export default IsBinaryAction;
