module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const { dataset } = ctx.meta;

    const res = await ctx.call('triplestore.query', {
      query: `SELECT (COUNT (?o) as ?count) { <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?o }`,
      webId,
      dataset
    });

    const num = Number(res[0].count.value);
    return num === 0;
  }
};
