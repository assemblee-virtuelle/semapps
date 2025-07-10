module.exports = {
  visibility: 'public',
  params: {
    actionName: { type: 'string' },
    priority: { type: 'number', default: 5 }
  },
  async handler(ctx) {
    const { actionName, priority } = ctx.params;

    this.authorizers.push({ actionName, priority });

    // Re-order all authorizers by priority
    this.authorizers.sort((a, b) => b.priority - a.priority);
  }
};
