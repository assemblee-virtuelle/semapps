import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const dataset = ctx.params.dataset || ctx.meta.dataset;

    if (!urlJoin(resourceUri, '/').startsWith(this.settings.baseUrl)) {
      // The resource is on another server
      return true;
    } else if (resourceUri.startsWith(urlJoin(this.settings.baseUrl, '/.'))) {
      // For special URLs starting with a dot (such as /.well-known), don't check datasets
      return true;
    } else {
      // If the resource is on the same server, it may be on a different storage
      if (!dataset) {
        throw new Error(
          `Unable to know if ${resourceUri} is remote. In Pod provider config, the dataset must be provided`
        );
      }

      return !urlJoin(resourceUri, '/').startsWith(`${urlJoin(this.settings.baseUrl, dataset)}/`);
    }
  }
} satisfies ActionSchema;

export default Schema;
