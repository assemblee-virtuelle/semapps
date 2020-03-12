const MIME_TYPES = {
  JSON: 'application/ld+json',
  TURTLE: 'text/turtle',
  TRIPLE: 'application/n-triples'
};

const TYPES_REPO = [
  {
    mime: MIME_TYPES.JSON,
    mimeFull: [MIME_TYPES.JSON, 'application/json'],
    N3Mapping: '',
    fusekiMapping: 'application/ld+json, application/sparql-results+json'
  },
  {
    mime: MIME_TYPES.TURTLE,
    mimeFull: [MIME_TYPES.TURTLE, 'application/turtle'],
    N3Mapping: 'Turtle',
    fusekiStoreMapping: 'application/n-quad'
  },
  {
    mime: MIME_TYPES.TRIPLE,
    mimeFull: [MIME_TYPES.TRIPLE],
    N3Mapping: 'N-Triples',
    fusekiMapping: 'application/n-triples'
  }
];

module.exports = {
  MIME_TYPES,
  TYPES_REPO
};
