module.exports = {
  visibility: 'public',
  params: {},
  async handler(ctx) {
    const ontologies = await this.actions.list({}, { parentCtx: ctx });

    let urls = [];
    let properties = {};
    let jsonldContext;

    for (const ontology of ontologies) {
      if (ontology.jsonldContext) {
        if (Array.isArray(ontology.jsonldContext)) {
          urls.push(ontology.jsonldContext);
        } else if (
          (typeof ontology.jsonldContext === 'string' || ontology.jsonldContext instanceof String) &&
          ontology.jsonldContext.startsWith('http')
        ) {
          urls.push(ontology.jsonldContext);
        } else {
          properties = {
            ...properties,
            ...ontology.jsonldContext
          };
        }
      } else {
        // Simply add the prefix in the properties
        properties[ontology.prefix] = ontology.url;
      }
    }

    if (urls.length > 0) {
      jsonldContext = [urls];
      if (Object.keys(properties).length > 0) {
        jsonldContext.push(properties);
      }
    } else {
      jsonldContext = properties;
    }

    return jsonldContext;
  }
};
