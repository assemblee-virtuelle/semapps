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

const buildDereferenceQuery = predicates => {
  let construct = '',
    where = '';
  if (predicates) {
    const flattenedPredicates = predicates.reduce((acc, predicate) => flattenPredicate(acc, predicate), {});

    for (const [predicate, parent] of Object.entries(flattenedPredicates)) {
      const varName = generateSparqlVarName(predicate);
      const parentVarName = parent === 'root' ? '1' : generateSparqlVarName(parent);

      const query = `
        ?s${parentVarName} ${predicate} ?s${varName} .
        ?s${varName} ?p${varName} ?o${varName} .
      `;

      construct += query;
      where += `
        OPTIONAL { ${query} }
      `;
    }
  }

  return { construct, where };
};

export default buildDereferenceQuery;
