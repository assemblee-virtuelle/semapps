import buildDereferenceQuery from './buildDereferenceQuery';
import getRdfPrefixes from './getRdfPrefixes';

const buildSparqlQuery = ({ containers, params: { filter }, dereference, ontologies }) => {
  let searchWhereQuery = '',
    filterWhereQuery = '';

  if (filter) {
    if (filter.q && filter.q.length > 0) {
      searchWhereQuery += `
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
        filterWhereQuery += `?s1 ${predicate} ${object} .`;
      }
    });
  }

  const dereferenceQuery = buildDereferenceQuery(dereference);

  return `
    ${getRdfPrefixes(ontologies)}
    CONSTRUCT {
      ?s1 ?p2 ?o2 .
      ${dereferenceQuery.construct}
    }
    WHERE {
      ${filterWhereQuery}
      ?containerUri ldp:contains ?s1 .
      FILTER( ?containerUri IN (${containers.map(container => `<${container}>`).join(', ')}) ) .
      FILTER( (isIRI(?s1)) ) .
      ${searchWhereQuery}
      ${dereferenceQuery.where}
      ?s1 ?p2 ?o2 .
    }
  `;
};

export default buildSparqlQuery;
