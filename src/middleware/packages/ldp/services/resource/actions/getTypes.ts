const Schema = {
  visibility: 'public',
  params: {
    resourceUri: 'string'
  },
  cache: {
    keys: ['resourceUri']
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const result = await ctx.call('triplestore.query', {
      query: `
        SELECT ?type
        WHERE {
          <${resourceUri}> a ?type .
        }
      `,
      webId: 'system'
    });

    return result.map(node => node.type.value);
  }
};

export default Schema;
