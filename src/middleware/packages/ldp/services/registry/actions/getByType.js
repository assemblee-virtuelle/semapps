module.exports = {
  visibility: 'public',
  params: {
    types: { type: 'string' },
  },
  async handler(ctx) {
    const types = Array.isArray(ctx.params.types) ? ctx.params.types : [ctx.params.types];

    return Object.values(this.registeredContainers).find(container =>
      types.some(type =>
        Array.isArray(container.acceptedTypes)
          ? container.acceptedTypes.includes(type)
          : container.acceptedTypes === type
      )
    );
  }
};
