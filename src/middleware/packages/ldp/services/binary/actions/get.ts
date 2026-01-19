import { ActionSchema } from 'moleculer';
import { Binary } from '../../../types.ts';

const GetAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const binary: Binary = await this.settings.adapter.getBinary(resourceUri);

    return binary;
  }
} satisfies ActionSchema;

export default GetAction;
