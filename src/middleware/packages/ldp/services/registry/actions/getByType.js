module.exports = {
  visibility: 'public',
  params: {
    type: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { type, dataset } = ctx.params;
    const types = await ctx.call('jsonld.parser.expandTypes', { types: type });
    const registeredContainers = await this.actions.list({ dataset }, { parentCtx: ctx });

    return Object.values(registeredContainers).find(container =>
      types.some(type =>
        Array.isArray(container.acceptedTypes)
          ? container.acceptedTypes.includes(type)
          : container.acceptedTypes === type
      )
    );
  }
};
