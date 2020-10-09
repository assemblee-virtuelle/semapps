const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const buildSparqlQuery = ({ types, params: { query, pagination, sort, filter }, ontologies }) => {
  let whereQuery = '';

  if (filter.q && filter.q.length > 0) {
    whereQuery += `
      {
        SELECT ?s1
        WHERE {
          ?s1 ?p1 ?o1 .
          FILTER regex(lcase(str(?o1)), "${filter.q.toLowerCase()}")
          FILTER NOT EXISTS {?s1 a ?o1}
        }
      }
      `;
  }
  if (query) {
    Object.keys(query).forEach(predicate => {
      const value = query[predicate].startsWith('http') ? `<${query[predicate]}>` : query[predicate];
      whereQuery += `?s1 ${predicate} ${value} .`;
    });
  }
  return `
    ${getPrefixRdf(ontologies)}
    CONSTRUCT {
      ?s1 ?p2 ?o2
    }
    WHERE {
      ${whereQuery}
      ?s1 a ?type .
      FILTER( ?type IN (${types.join(', ')}) ) .
      FILTER( (isIRI(?s1)) ) .
      ?s1 ?p2 ?o2 .
    }
    # TODO try to make pagination work in SPARQL as this doesn't work.
    # LIMIT ${pagination.perPage}
    # OFFSET ${(pagination.page - 1) * pagination.perPage}
  `;
};

export default buildSparqlQuery;
