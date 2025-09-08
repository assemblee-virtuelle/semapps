import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';

export const action = {
  visibility: 'public',
  params: {
    groupSlug: { type: 'string', optional: false, trim: true }
  },
  async handler(ctx) {
    const { groupSlug } = ctx.params;
    return urlJoin(this.settings.baseUrl, '_groups', groupSlug);
  }
} satisfies ActionSchema;
