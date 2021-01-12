const ObjectID = require('bson').ObjectID;

const buildBlankNodesQuery = depth => {
  let construct = '', where = '';
  if (depth > 0) {
    for (let i = 1; i <= depth; i++) {
      construct += `
        ?o${i} ?p${i + 1} ?o${i + 1} .
      `;
      where += `
        OPTIONAL {
          FILTER((isBLANK(?o${i}))) .
          ?o${i} ?p${i + 1} ?o${i + 1} .
        }
      `;
    }
  }
  return { construct, where };
};

const buildDereferenceQuery = predicates => {
  let construct = '', where = '';
  if( predicates ) {
    predicates.forEach(predicate => {
      // Transform ontology:predicate to OntologyPredicate in order to use it as a variable name
      const varName = predicate.split(':').map(s => s[0].toUpperCase() + s.slice(1)).join('');

      construct += `
        ?s1 ${predicate} ?s${varName} .
        ?s${varName} ?p${varName} ?o${varName} .  
      `;
      where += `
        OPTIONAL { 
          ?s1 ${predicate} ?s${varName} .
          ?s${varName} ?p${varName} ?o${varName} . 
        }
      `;
    });
  }
  return { construct, where };
};

const buildFiltersQuery = filters => {
  let where = '';
  if (filters) {
    Object.keys(filters).forEach((predicate, i) => {
      if (filters[predicate]) {
        where += `
          FILTER EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} "${filters[predicate]}" } .
        `;
      } else {
        where += `
          FILTER NOT EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} ?unwanted${i} } .
        `;
      }
    });
  }
  return { where };
}

// Generate a MongoDB-like object ID
const generateId = () => new ObjectID().toString();

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

module.exports = {
  buildBlankNodesQuery,
  buildDereferenceQuery,
  buildFiltersQuery,
  generateId,
  getPrefixRdf,
  getPrefixJSON,
  getSlugFromUri,
  getContainerFromUri
};
