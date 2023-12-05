module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string'
  },
  async handler(ctx) {
    let { prefix } = ctx.params;

    const [ontology] = await this._find(ctx, { query: { prefix } });

    // If the jsonldContext is not an URL, it is an object to be parsed
    if (ontology?.jsonldContext && !ontology.jsonldContext.startsWith('http')) {
      ontology.jsonldContext = JSON.parse(ontology.jsonldContext);
    }

    return ontology;
  }
};
