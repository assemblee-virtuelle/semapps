module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string',
    url: 'string',
    owl: { type: 'string', optional: true },
    jsonldContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    preserveContextUri: { type: 'boolean', default: false },
    overwrite: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    if (this.settings.dynamicRegistration) {
      return await ctx.call('ontologies.registry.register', ctx.params);
    } else {
      throw new Error('The register action is available only if dynamicRegistration is true');
    }
  }
};
