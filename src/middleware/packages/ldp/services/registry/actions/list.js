module.exports = {
  visibility: 'public',
  params: {
    dataset: { type: 'string', optional: true }
  },
  handler(ctx) {
    const { dataset } = ctx.params;
    if (dataset && this.registeredContainers[dataset]) {
      return { ...this.registeredContainers['*'], ...this.registeredContainers[dataset] };
    } else {
      return this.registeredContainers['*'];
    }
  }
};
