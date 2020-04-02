module.exports = async function attach(ctx) {
  const containerExists = this.actions.exist({ containerUri: ctx.params.containerUri });
  if (!containerExists) throw new Error('Cannot attach to a non-existing container !');

  return await ctx.call('triplestore.insert', {
    resource: {
      '@context': 'http://www.w3.org/ns/ldp',
      '@id': ctx.params.containerUri,
      '@type': ['Container', 'BasicContainer'],
      contains: ctx.params.resourceUri
    },
    contentType: MIME_TYPES.JSON
  });
};
