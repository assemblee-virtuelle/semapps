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
    tripleStoreMapping: 'application/json',
    N3Mapping: ''
  },
  {
    mime: SUPPORTED_ACCEPT_MIME_TYPES.TURTLE,
    mimeFull: ['text/' + SUPPORTED_ACCEPT_MIME_TYPES.TURTLE, 'application/' + SUPPORTED_ACCEPT_MIME_TYPES.TURTLE],
    tripleStoreMapping: 'turtle',
    N3Mapping: 'Turtle'
  },
  {
    mime: SUPPORTED_ACCEPT_MIME_TYPES.TRIPLE,
    mimeFull: ['application/' + SUPPORTED_ACCEPT_MIME_TYPES.TRIPLE],
    tripleStoreMapping: 'triple',
    N3Mapping: 'N-Triples'
  }
];
module.exports = {
  SUPPORTED_ACCEPT_MIME_TYPES,
  SUPPORTED_CONTENT_MIME_TYPES,
  TYPES_REPO
};
