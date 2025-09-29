import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';

/**
 * Get the container URI based on its path
 * In Pod provider config, the webId is required to find the Pod root
 */
const Schema = {
  visibility: 'public',
  params: {
    path: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { path, webId } = ctx.params;

    if (this.settings.podProvider) {
      if (webId === 'system' || webId === 'anon')
        throw new Error(`You must provide a real webId param in Pod provider config. Received: ${webId}`);
      const podUrl = await ctx.call('solid-storage.getUrl', { webId });
      return urlJoin(podUrl, path);
    } else {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      return urlJoin(this.settings.baseUrl, path);
    }
  }
} satisfies ActionSchema;

export default Schema;
