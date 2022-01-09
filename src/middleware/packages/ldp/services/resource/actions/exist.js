const { isMirror } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    let triplesNb;
    if (!isMirror(resourceUri, this.settings.baseUrl)) {
      triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
        uri: resourceUri,
        webId
      });
    }
    else {
      triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
        uri: resourceUri,
        webId,
        graphName: this.settings.mirrorGraphName
      });
    }

    return triplesNb > 0;
  }
};
