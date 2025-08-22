import { ActionSchema } from 'moleculer';
import { getAclUriFromResourceUri } from '../../../utils.ts';

export const action = {
  visibility: 'public',
  params: {
    uri: { type: 'string', optional: false }
  },
  handler(ctx) {
    const { uri } = ctx.params;
    return {
      uri: getAclUriFromResourceUri(this.settings.baseUrl, uri),
      rel: 'acl'
    };
  }
} satisfies ActionSchema;
