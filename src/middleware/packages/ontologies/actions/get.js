module.exports = {
  visibility: 'public',
  params: {
    prefix: { type: 'string', optional: true },
    namespace: { type: 'string', optional: true },
    uri: { type: 'string', optional: true }
  },
  cache: true,
  async handler(ctx) {
    let { prefix, namespace, uri } = ctx.params;
    if (!prefix && !namespace && !uri) throw new Error('You must provide a prefix, namespace or uri parameter');

    if (this.settings.persistRegistry) {
      if (prefix) {
        return await ctx.call('ontologies.registry.getByPrefix', { prefix });
      } else if (namespace) {
        return await ctx.call('ontologies.registry.getByNamespace', { namespace });
      } else if (uri) {
        const ontologies = await ctx.call('ontologies.registry.list');
        return ontologies.find(o => uri.startsWith(o.namespace));
      }
    } else {
      if (prefix) {
        return this.ontologies[prefix];
      } else if (namespace) {
        return Object.values(this.ontologies).find(o => o.namespace === namespace);
      } else if (uri) {
        return Object.values(this.ontologies).find(o => uri.startsWith(o.namespace));
      }
    }
  }
};
