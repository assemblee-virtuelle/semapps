module.exports = {
  visibility: 'public',
  params: {
    // prefix: { type: 'string', optional: true },
    // url: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { prefix, url } = ctx.params;

    if (prefix) {
      const ontologies = await this._find(ctx, { query: { prefix } });
      if (ontologies.length > 0) return ontologies[0];
    } else if (url) {
      const ontologies = await this._find(ctx, { query: { url } });
      if (ontologies.length > 0) return ontologies[0];
    } else {
      throw new Error('A prefix or url must be passed to the ldp.ontologies.get action');
    }

    return null;
  }
};
