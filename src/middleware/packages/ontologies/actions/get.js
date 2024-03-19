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
    let ontology;

    if (!prefix && !namespace && !uri) throw new Error('You must provide a prefix, namespace or uri parameter');

    if (this.settings.persistRegistry) {
      if (prefix) {
        ontology = await ctx.call('ontologies.registry.getByPrefix', { prefix });
      } else if (namespace) {
        ontology = await ctx.call('ontologies.registry.getByNamespace', { namespace });
      } else if (uri) {
        const ontologies = await ctx.call('ontologies.registry.list');
        ontology = ontologies.find(o => uri.startsWith(o.namespace));
      }
    } else {
      if (prefix) {
        ontology = this.ontologies[prefix] || false;
      } else if (namespace) {
        ontology = Object.values(this.ontologies).find(o => o.namespace === namespace);
      } else if (uri) {
        ontology = Object.values(this.ontologies).find(o => uri.startsWith(o.namespace));
      }
    }

    // Must return null if no results, because the cache JsonSerializer cannot handle undefined values
    // https://moleculer.services/docs/0.14/networking.html#JSON-serializer
    if (ontology === undefined) ontology = null;

    return ontology;
  }
};
