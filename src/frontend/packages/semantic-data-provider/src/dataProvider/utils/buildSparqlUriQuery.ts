import getRdfPrefixes from './getRdfPrefixes';

const buildSparqlUriQuery = ({
  types,
  params: { sort, filter },
  ontologies
}: any) => {
  let whereQuery = '';

  if (filter) {
    if (filter.q && filter.q.length > 0) {
      whereQuery += `
        ?resource ?p1 ?o1 .
        FILTER isLITERAL(?o1) .
        FILTER regex(lcase(str(?o1)), "${filter.q.toLowerCase()}") .
      `;
      delete filter.q;
    }
    Object.keys(filter).forEach(predicate => {
      if (filter[predicate]) {
        const object = filter[predicate].startsWith('http') ? `<${filter[predicate]}>` : filter[predicate];
        whereQuery += `?resource ${predicate} ${object} .`;
      }
    });
  }

  return `
    ${getRdfPrefixes(ontologies)}
    SELECT DISTINCT ?resource
    WHERE {
      ?resource a ?type .
      FILTER( ?type IN (${types.join(', ')}) ) .
      FILTER( (isIRI(?resource)) ) .
      ${sort && sort.field.includes(':') ? `?resource ${sort.field} ?sortField .` : ''}
      ${whereQuery}
    }
    ${sort && sort.field.includes(':') ? `ORDER BY ${sort.order}(?sortField)` : ''}
  `;
};

export default buildSparqlUriQuery;
