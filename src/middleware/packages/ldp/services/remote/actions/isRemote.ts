const urlJoin = require('url-join');

module.exports = {
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
    } else {
      // If the resource is on the same Pod provider, it may be on a different Pod
      if (this.settings.podProvider) {
        // For special URLs starting with a dot (such as /.well-known), don't check datasets
        if (resourceUri.startsWith(urlJoin(this.settings.baseUrl, '/.'))) return false;

        if (!dataset)
          throw new Error(
            `Unable to know if ${resourceUri} is remote. In Pod provider config, the dataset must be provided`
          );

        return !urlJoin(resourceUri, '/').startsWith(`${urlJoin(this.settings.baseUrl, dataset)}/`);
      } else {
        return false;
      }
    }
  }
};
