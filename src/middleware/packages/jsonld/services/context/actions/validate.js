module.exports = {
  visibility: 'public',
  params: {
    context: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }]
    }
  },
  async handler(ctx) {
    const { context } = ctx.params;
    try {
      await this.contextParser.parse(context);
      return true;
    } catch (e) {
      return false;
    }
  }
};
