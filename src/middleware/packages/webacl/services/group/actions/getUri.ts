import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';

export const action = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; trim: tru... Remove this comment to see the full error message
    groupSlug: { type: 'string', optional: false, trim: true }
  },
  async handler(ctx) {
    const { groupSlug } = ctx.params;
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    return urlJoin(this.settings.baseUrl, '_groups', groupSlug);
  }
} satisfies ActionSchema;
