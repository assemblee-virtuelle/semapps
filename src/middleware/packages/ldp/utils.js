const urlJoin = require('url-join');

function getAclUriFromResourceUri(baseUrl, resourceUri) {
  return urlJoin(baseUrl, resourceUri.replace(baseUrl, '_acl/'));
}

const buildBlankNodesQuery = depth => {
  let construct = '',
    where = '';
  if (depth > 0) {
    for (let i = depth; i >= 1; i--) {
      construct += `
        ?o${i} ?p${i + 1} ?o${i + 1} .
      `;
      where = `
        OPTIONAL {
          FILTER((isBLANK(?o${i}))) .
          ?o${i} ?p${i + 1} ?o${i + 1} .
          ${where}
        }
      `;
    }
  }
  return { construct, where };
};

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
    .join('')
    .replace(/[^a-z0-9]+/gi, '');

const buildDereferenceQuery = predicates => {
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

const buildFiltersQuery = filters => {
  let where = '';
  if (filters) {
    Object.keys(filters).forEach((predicate, i) => {
      if (filters[predicate]) {
        where += `
          FILTER EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} ${
          filters[predicate].startsWith('http') ? `<${filters[predicate]}>` : `"${filters[predicate]}"`
        } } .
        `;
      } else {
        where += `
          FILTER NOT EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} ?unwanted${i} } .
        `;
      }
    });
  }
  return { where };
};

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const getPrefixJSON = ontologies => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

const getSlugFromUri = str => str.match(new RegExp(`.*/(.*)`))[1];

const getContainerFromUri = str => str.match(new RegExp(`(.*)/.*`))[1];

const hasType = (resource, type) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const isContainer = resource => hasType(resource, 'ldp:Container');

const defaultToArray = value => (!value ? undefined : Array.isArray(value) ? value : [value]);

const delay = t => new Promise(resolve => setTimeout(resolve, t));

module.exports = {
  buildBlankNodesQuery,
  buildDereferenceQuery,
  buildFiltersQuery,
  getPrefixRdf,
  getPrefixJSON,
  getSlugFromUri,
  getContainerFromUri,
  hasType,
  isContainer,
  defaultToArray,
  delay,
  getAclUriFromResourceUri
};
