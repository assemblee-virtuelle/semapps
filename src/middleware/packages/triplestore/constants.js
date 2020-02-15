const ACCEPT_TYPES = {
  JSON: 'json',
  TURTLE: 'turtle',
  TRIPLE: 'triple'
};

const SUPPORTED_ACCEPT_MIME_TYPES = {
  JSON: 'ld+json',
  TURTLE: 'turtle',
  TRIPLE: 'n-triples'
};
const SUPPORTED_CONTENT_MIME_TYPES = {
  JSON: SUPPORTED_ACCEPT_MIME_TYPES.JSON,
  TURTLE: SUPPORTED_ACCEPT_MIME_TYPES.TURTLE,
  TRIPLE: SUPPORTED_ACCEPT_MIME_TYPES.TURTLE
};

const TYPES_REPO = [
  {
    mime: SUPPORTED_ACCEPT_MIME_TYPES.JSON,
    mimeFull: ['application/' + SUPPORTED_ACCEPT_MIME_TYPES.JSON, 'application/json'],
    fusekiMapping: 'application/ld+json, application/sparql-results+json',
    N3Mapping: ''
  },
  {
    mime: SUPPORTED_ACCEPT_MIME_TYPES.TURTLE,
    mimeFull: ['text/' + SUPPORTED_ACCEPT_MIME_TYPES.TURTLE, 'application/' + SUPPORTED_ACCEPT_MIME_TYPES.TURTLE],
    fusekiStoreMapping: 'application/n-quad',
    N3Mapping: 'Turtle'
  },
  {
    mime: SUPPORTED_ACCEPT_MIME_TYPES.TRIPLE,
    mimeFull: ['application/' + SUPPORTED_ACCEPT_MIME_TYPES.TRIPLE],
    fusekiMapping: 'application/n-triples',
    N3Mapping: 'N-Triples'
  }
];
module.exports = {
  SUPPORTED_ACCEPT_MIME_TYPES,
  SUPPORTED_CONTENT_MIME_TYPES,
  ACCEPT_TYPES,
  TYPES_REPO
};
