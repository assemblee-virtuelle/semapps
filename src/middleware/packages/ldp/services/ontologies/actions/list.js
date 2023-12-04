module.exports = {
  visibility: 'public',
  params: {},
  async handler(ctx) {
    const ontologies = await this._list(ctx, {});
    return ontologies.rows.map(ontology => {
      if (!ontology.jsonldContext.startsWith('http')) {
        // If the jsonldContext is not an URL, it is an object to be parsed
        ontology.jsonldContext = JSON.parse(ontology.jsonldContext);
      }
      return ontology;
    });
  }
};
