module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string'
  },
  cache: true,
  async handler(ctx) {
    let { prefix } = ctx.params;

    if (this.settings.persistRegistry) {
      return await ctx.call('ontologies.registry.getByPrefix', { prefix });
    } else {
      return this.ontologies[prefix];
    }
  }
};
