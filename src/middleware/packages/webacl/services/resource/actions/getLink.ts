import { ActionSchema } from 'moleculer';
import { getAclUriFromResourceUri } from '../../../utils.ts';

export const action = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
    uri: { type: 'string', optional: false }
  },
  handler(ctx) {
    const { uri } = ctx.params;
    return {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      uri: getAclUriFromResourceUri(this.settings.baseUrl, uri),
      rel: 'acl'
    };
  }
} satisfies ActionSchema;
