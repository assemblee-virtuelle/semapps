module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');

    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK {
          VALUES ?container { <${containerUri}> <${`${containerUri}/`}> }
          GRAPH ?container {
            ?container a ldp:Container
          }
        }
      `,
      webId: 'system'
    });
  }
};
