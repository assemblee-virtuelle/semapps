module.exports = {
  visibility: 'public',
  params: {
    action: { type: 'string' }
  },
  handler(ctx) {
    const { action } = ctx.params;
    this.registeredLinks.push(action);
  }
};
