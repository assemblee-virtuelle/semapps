import { ActionSchema } from 'moleculer';
import { WacPermission } from '../../../types.ts';

const IsPublicAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const { read }: WacPermission = await ctx.call('webacl.resource.hasRights', {
      resourceUri,
      rights: { read: true },
      webId: 'anon'
    });
    return read;
  }
} satisfies ActionSchema;

export default IsPublicAction;
