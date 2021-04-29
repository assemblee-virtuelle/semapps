import buildDereferenceQuery from './buildDereferenceQuery';

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const buildSparqlQuery = ({ types, params: { pagination, sort, filter }, dereference, ontologies }) => {
  let whereQuery = '';

  if (filter) {
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
      delete filter.q;
    }
    Object.keys(filter).forEach(predicate => {
      if (filter[predicate]) {
        const object = filter[predicate].startsWith('http') ? `<${filter[predicate]}>` : filter[predicate];
        whereQuery += `?s1 ${predicate} ${object} .`;
      }
    });
  }

  const dereferenceQuery = buildDereferenceQuery(dereference);

  let query = `
    ${getPrefixRdf(ontologies)}
    CONSTRUCT {
      ?s1 ?p2 ?o2 .
      ${dereferenceQuery.construct}
    }
    WHERE {
      ?s1 a ?type .
      FILTER( ?type IN (${types.join(', ')}) ) .
      FILTER( (isIRI(?s1)) ) .
      ${whereQuery}
      ${dereferenceQuery.where}
      ?s1 ?p2 ?o2 .
    }
  `;
  //need to do query without params for GroupedArrayField (getList)
  if (pagination){
    query=`
    ${query}
    # TODO try to make pagination work in SPARQL as this doesn't work.
    # LIMIT ${pagination.perPage}
    # OFFSET ${(pagination.page - 1) * pagination.perPage}
    `
  }

  return query;
};

export default buildSparqlQuery;
