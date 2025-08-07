module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');
    const resourceUri = ctx.params.resourceUri.replace(/\/+$/, '');

    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE { 
          GRAPH ?g {
            ?containerUri ldp:contains ?resourceUri .
            FILTER(?containerUri IN (<${containerUri}>, <${`${containerUri}/`}>)) .
            FILTER(?resourceUri IN (<${resourceUri}>, <${`${resourceUri}/`}>)) .
          }
        }
      `,
      webId
    });
  }
};
