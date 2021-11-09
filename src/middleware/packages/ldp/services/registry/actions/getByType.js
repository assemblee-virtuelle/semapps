module.exports = {
  visibility: 'public',
  params: {
    type: { type: "multi", rules: [ { type: "string" }, { type: "array" } ] },
  },
  async handler(ctx) {
    const types = Array.isArray(ctx.params.type) ? ctx.params.type : [ctx.params.type];

    return Object.values(this.registeredContainers).find(container =>
      types.some(type =>
        Array.isArray(container.acceptedTypes)
          ? container.acceptedTypes.includes(type)
          : container.acceptedTypes === type
      )
    );
  }
};
