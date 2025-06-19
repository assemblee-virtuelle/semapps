import urlJoin from 'url-join';
import { defineAction } from 'moleculer';

export const action = defineAction({
  visibility: 'public',
  params: {
    groupSlug: { type: 'string', optional: false, trim: true }
  },
  async handler(ctx) {
    const { groupSlug } = ctx.params;
    return urlJoin(this.settings.baseUrl, '_groups', groupSlug);
  }
});
