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
      this.logger.warn(`Could not parse context. Error: ${e.message}`);
      return false;
    }
  }
};
