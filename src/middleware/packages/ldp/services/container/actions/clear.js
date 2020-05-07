module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');
    return await ctx.call('triplestore.update', {
      query: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#> 
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        DELETE {
          ?s1 ?p1 ?o1 .
        }
        WHERE { 
          FILTER(?container IN (<${containerUri}>, <${containerUri + '/'}>)) .
          ?container ldp:contains ?s1 .
          ?s1 ?p1 ?o1 . 
        } 
      `
    });
  }
};
