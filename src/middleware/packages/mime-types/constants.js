const MIME_TYPES = {
  JSON: 'application/ld+json',
  TURTLE: 'text/turtle',
  TRIPLE: 'application/n-triples',
  SPARQL_JSON: 'application/sparql-results+json',
  SPARQL_XML: 'application/sparql-results+xml',
  CSV: 'text/csv',
  TSV: 'text/tab-separated-values',
  RDF: 'application/rdf+xml',
  SPARQL_UPDATE: 'application/sparql-update'
};

const TYPES_REPO = [
  {
    mime: MIME_TYPES.JSON,
    mimeFull: [MIME_TYPES.JSON, 'application/json', 'application/activity+json'],
    N3Mapping: '',
    fusekiMapping: 'application/ld+json, application/sparql-results+json'
  },
  {
    mime: MIME_TYPES.TURTLE,
    mimeFull: [MIME_TYPES.TURTLE, 'application/turtle'],
    N3Mapping: 'Turtle',
    fusekiStoreMapping: MIME_TYPES.TURTLE
  },
  {
    mime: MIME_TYPES.TRIPLE,
    mimeFull: [MIME_TYPES.TRIPLE],
    N3Mapping: 'N-Triples',
    fusekiMapping: MIME_TYPES.TRIPLE
  },
  {
    mime: MIME_TYPES.SPARQL_JSON,
    mimeFull: [MIME_TYPES.SPARQL_JSON],
    N3Mapping: '',
    fusekiMapping: MIME_TYPES.SPARQL_JSON
  },
  {
    mime: MIME_TYPES.SPARQL_UPDATE,
    mimeFull: [MIME_TYPES.SPARQL_UPDATE],
    N3Mapping: '',
    fusekiMapping: MIME_TYPES.SPARQL_UPDATE
  },
  {
    mime: MIME_TYPES.SPARQL_XML,
    mimeFull: [MIME_TYPES.SPARQL_XML],
    N3Mapping: '',
    fusekiMapping: MIME_TYPES.SPARQL_XML
  },
  {
    mime: MIME_TYPES.CSV,
    mimeFull: [MIME_TYPES.CSV],
    N3Mapping: '',
    fusekiMapping: MIME_TYPES.CSV
  },
  {
    mime: MIME_TYPES.TSV,
    mimeFull: [MIME_TYPES.TSV],
    N3Mapping: '',
    fusekiMapping: MIME_TYPES.TSV
  },
  {
    mime: MIME_TYPES.RDF,
    mimeFull: [MIME_TYPES.RDF],
    N3Mapping: '',
    fusekiMapping: MIME_TYPES.RDF
  }
];

module.exports = {
  MIME_TYPES,
  TYPES_REPO
};
