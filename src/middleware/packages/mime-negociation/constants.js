const SUPPORTED_MIME_TYPES = {
  JSON: 'application/ld+json',
  TURTLE: 'text/turtle',
  TRIPLE: 'application/n-triples'
};

const TYPES_REPO = [
  {
    mime: SUPPORTED_MIME_TYPES.JSON,
    mimeFull: [SUPPORTED_MIME_TYPES.JSON, 'application/json'],
    N3Mapping: '',
    fusekiMapping: 'application/ld+json, application/sparql-results+json'
  },
  {
    mime: SUPPORTED_MIME_TYPES.TURTLE,
    mimeFull: [SUPPORTED_MIME_TYPES.TURTLE, 'application/turtle'],
    N3Mapping: 'Turtle',
    fusekiStoreMapping: 'application/n-quad'
  },
  {
    mime: SUPPORTED_MIME_TYPES.TRIPLE,
    mimeFull: [SUPPORTED_MIME_TYPES.TRIPLE],
    N3Mapping: 'N-Triples',
    fusekiMapping: 'application/n-triples'
  }
];

module.exports = {
  SUPPORTED_MIME_TYPES,
  TYPES_REPO
};
