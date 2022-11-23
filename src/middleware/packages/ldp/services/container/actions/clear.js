module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, webId } = ctx.params;
    // Matches container with or without trailing slash
    containerUri = containerUri.replace(/\/+$/, '');

    await ctx.call('triplestore.update', {
      query: `
        PREFIX as: <https://www.w3.org/ns/activitystreams#> 
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        DELETE {
          ?container ldp:contains ?s1 .
          ?s1 ?p1 ?o1 .
        }
        WHERE { 
          FILTER(?container IN (<${containerUri}>, <${containerUri + '/'}>)) .
          ?container ldp:contains ?s1 .
          OPTIONAL { ?s1 ?p1 ?o1 . } 
        } 
      `,
      webId
    });

    // TODO: emit an event that will be handled by mirror service.

    ctx.call('triplestore.deleteOrphanBlankNodes');
  }
};
