const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = async function create(ctx) {
  return await ctx.call('triplestore.insert', {
    resource: {
      '@context': 'http://www.w3.org/ns/ldp',
      '@id': ctx.params.containerUri,
      '@type': ['Container', 'BasicContainer']
    },
    contentType: MIME_TYPES.JSON
  });
};
