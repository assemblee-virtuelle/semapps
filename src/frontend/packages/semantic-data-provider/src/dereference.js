// Return an object in the form of predicate => parentPredicate
const flattenPredicate = (accumulator, predicate, parent = 'root') => {
  if (predicate.includes('/')) {
    const matches = predicate.split(/\/(.+)/);
    accumulator[matches[0]] = parent;
    flattenPredicate(accumulator, matches[1], matches[0]);
  } else {
    accumulator[predicate] = parent;
  }
  return accumulator;
};

// Transform ontology:predicate to OntologyPredicate in order to use it as a variable name
const generateSparqlVarName = predicate =>
  predicate
    .split(':')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('');

export const buildDereferenceQuery = predicates => {
  let queries = [];

  if (predicates) {
    const flattenedPredicates = predicates.reduce((acc, predicate) => flattenPredicate(acc, predicate), {});

    for (const [predicate, parent] of Object.entries(flattenedPredicates)) {
      const varName = generateSparqlVarName(predicate);
      const parentVarName = parent === 'root' ? '1' : generateSparqlVarName(parent);

      // Group queries by parent, so that we can group WHERE triples in the same OPTIONAL tag
      const groupKey = parent === 'root' ? predicate : parent;
      if (!queries[groupKey]) queries[groupKey] = [];

      queries[groupKey].push(`
        ?s${parentVarName} ${predicate} ?s${varName} .
        ?s${varName} ?p${varName} ?o${varName} .
      `);
    }
  }

  return {
    construct: Object.values(queries)
      .map(groupedQueries => Object.values(groupedQueries).join('\n'))
      .join('\n'),
    where: Object.values(queries)
      .map(groupedQueries => `OPTIONAL { ${Object.values(groupedQueries).join('\n')} }`)
      .join('\n')
  };
};

export const getEmbedFrame = paths => {
  let embedFrame = {},
    predicates;
  if (paths) {
    for (let path of paths) {
      if (path.includes('/')) {
        predicates = path.split('/').reverse();
      } else {
        predicates = [path];
      }
      embedFrame = {
        ...embedFrame,
        ...predicates.reduce(
          (accumulator, predicate) => ({
            [predicate]: {
              '@embed': '@last',
              ...accumulator
            }
          }),
          {}
        )
      };
    }
    return embedFrame;
  }
};
