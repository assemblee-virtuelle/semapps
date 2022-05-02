const formatPredicateForSparqlQuery = predicate =>
  predicate.startsWith('http') ? `<${predicate}>` : predicate;

module.exports = {
  formatPredicateForSparqlQuery
};
