const ACCEPT_TYPES = {
  JSON: 'json',
  TURTLE: 'turtle',
  TRIPLE: 'triple'
};

const ACCEPT_MIME_TYPE_SUPPORTED = {
  JSON: 'ld+json',
  TURTLE: 'turtle',
  TRIPLE: 'n-triples'
};
const CONTENT_MIME_TYPE_SUPPORTED = {
  JSON: ACCEPT_MIME_TYPE_SUPPORTED.JSON,
  TURTLE: ACCEPT_MIME_TYPE_SUPPORTED.TURTLE,
  TRIPLE: ACCEPT_MIME_TYPE_SUPPORTED.TURTLE
};

const TYPES_REPO =[
  {
    mime:ACCEPT_MIME_TYPE_SUPPORTED.JSON,
    mimeFull:['application/'+ACCEPT_MIME_TYPE_SUPPORTED.JSON,'application/json'],
    fusekiMapping :'application/ld+json, application/sparql-results+json',
    N3Mapping:''
  },
  {
    mime:ACCEPT_MIME_TYPE_SUPPORTED.TURTLE,
    mimeFull:['text/'+ACCEPT_MIME_TYPE_SUPPORTED.TURTLE,'application/'+ACCEPT_MIME_TYPE_SUPPORTED.TURTLE],
    fusekiStoreMapping :'application/n-quad',
    N3Mapping:'Turtle'
  },
  {
    mime:ACCEPT_MIME_TYPE_SUPPORTED.TRIPLE,
    mimeFull:['application/'+ACCEPT_MIME_TYPE_SUPPORTED.TRIPLE],
    fusekiMapping :'application/n-triples',
    N3Mapping:'N-Triples'
  }
];
module.exports = {
  ACCEPT_MIME_TYPE_SUPPORTED,
  CONTENT_MIME_TYPE_SUPPORTED,
  ACCEPT_TYPES,
  TYPES_REPO
};
