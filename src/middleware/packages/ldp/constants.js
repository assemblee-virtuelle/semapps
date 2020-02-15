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
    tripleStoreMapping :'application/json',
    N3Mapping:''
  },
  {
    mime:ACCEPT_MIME_TYPE_SUPPORTED.TURTLE,
    mimeFull:['text/'+ACCEPT_MIME_TYPE_SUPPORTED.TURTLE,'application/'+ACCEPT_MIME_TYPE_SUPPORTED.TURTLE],
    tripleStoreMapping :'turtle',
    N3Mapping:'Turtle'
  },
  {
    mime:ACCEPT_MIME_TYPE_SUPPORTED.TRIPLE,
    mimeFull:['application/'+ACCEPT_MIME_TYPE_SUPPORTED.TRIPLE],
    tripleStoreMapping :'triple',
    N3Mapping:'N-Triples'
  }
];
module.exports = {
  ACCEPT_MIME_TYPE_SUPPORTED,
  CONTENT_MIME_TYPE_SUPPORTED,
  TYPES_REPO
};
