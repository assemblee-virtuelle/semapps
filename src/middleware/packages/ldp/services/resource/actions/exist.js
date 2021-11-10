module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
      uri: resourceUri,
      webId
    });

    return triplesNb > 0;
  }
};
