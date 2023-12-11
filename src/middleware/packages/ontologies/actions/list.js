module.exports = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    if (this.settings.dynamicRegistration) {
      return await ctx.call('ontologies.registry.list');
    } else {
      return this.settings.ontologies;
    }
  }
};
