module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string'
  },
  cache: true,
  async handler(ctx) {
    let { prefix } = ctx.params;
    if (this.settings.dynamicRegistration) {
      return await ctx.call('ontologies.registry.getByPrefix', { prefix });
    } else {
      return this.settings.ontologies.find(o => o.prefix === prefix);
    }
  }
};
