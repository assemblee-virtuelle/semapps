const urlJoin = require('url-join');

module.exports = {
  visibility: 'public',
  params: {
    webId: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    return await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
      body: 'update=DROP+ALL',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-SemappsUser': webId
      }
    });
  }
};
