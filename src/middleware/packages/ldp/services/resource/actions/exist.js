module.exports = {
  visibility: 'public',
  params: {
    resourceUri: 'string'
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
      uri: resourceUri
    });

    return triplesNb > 0;
  }
};
