const { isURL } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string'
  },
  cache: true,
  async handler(ctx) {
    let { prefix } = ctx.params;

    if (this.settings.dynamicRegistration) {
      const [ontology] = await this._find(ctx, { query: { prefix } });

      // If the jsonldContext is not an URL, it is an object to be parsed
      if (ontology?.jsonldContext && !isURL(ontology.jsonldContext)) {
        ontology.jsonldContext = JSON.parse(ontology.jsonldContext);
      }

      if (ontology?.preserveContextUri === 'true') {
        ontology.preserveContextUri = true;
      } else if (ontology?.preserveContextUri === 'false') {
        ontology.preserveContextUri = false;
      }

      return ontology;
    } else {
      return this.settings.ontologies.find(o => o.prefix === prefix);
    }
  }
};
