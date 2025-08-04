const Schema = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    const ontologies = await this.actions.list({}, { parentCtx: ctx });
    return ontologies
      .sort((a, b) => (a.prefix < b.prefix ? -1 : a.prefix > b.prefix ? 1 : 0))
      .map(ontology => `PREFIX ${ontology.prefix}: <${ontology.namespace}>`)
      .join('\n');
  }
};

export default Schema;
