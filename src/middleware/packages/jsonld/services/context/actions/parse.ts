module.exports = {
  visibility: 'public',
  params: {
    context: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }]
    },
    options: { type: 'object', optional: true }
  },
  async handler(ctx) {
    const { context, options } = ctx.params;
    const { contextRaw } = await this.contextParser.parse(context, options);
    return contextRaw;
  }
};
