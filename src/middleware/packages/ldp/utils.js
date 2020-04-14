const uuid = require('uuid/v1');

const generateId = () => {
  return uuid().substring(0, 8);
};

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const getPrefixJSON = ontologies => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

module.exports = {
  generateId,
  getPrefixRdf,
  getPrefixJSON
};
