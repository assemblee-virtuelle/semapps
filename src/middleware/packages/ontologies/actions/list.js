module.exports = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    if (this.settings.persistRegistry) {
      return await ctx.call('ontologies.registry.list');
    } else {
      return Object.values(this.ontologies);
    }
  }
};
