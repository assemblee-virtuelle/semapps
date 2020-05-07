const ObjectID = require('bson').ObjectID;

const buildBlankNodesQuery = depth => {
  let constructQuery = '',
    whereQuery = '';
  if (depth > 0) {
    for (let i = 1; i <= depth; i++) {
      constructQuery += `
        ?o${i} ?p${i + 1} ?o${i + 1} .
      `;
      whereQuery += `
        OPTIONAL {
          FILTER((isBLANK(?o${i}))) .
          ?o${i} ?p${i + 1} ?o${i + 1} .
        }
      `;
    }
  }
  return [constructQuery, whereQuery];
};

// Generate a MongoDB-like object ID
const generateId = () => (new ObjectID()).toString();

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const getPrefixJSON = ontologies => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

module.exports = {
  buildBlankNodesQuery,
  generateId,
  getPrefixRdf,
  getPrefixJSON
};
