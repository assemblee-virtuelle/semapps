import { defineAction } from 'moleculer';
import { getAclUriFromResourceUri } from '../../../utils.ts';

export const action = defineAction({
  visibility: 'public',
  params: {
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
});
