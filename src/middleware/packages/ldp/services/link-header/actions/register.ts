module.exports = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' }
  },
  handler(ctx) {
    const { actionName } = ctx.params;
    this.registeredActionNames.push(actionName);
  }
};
