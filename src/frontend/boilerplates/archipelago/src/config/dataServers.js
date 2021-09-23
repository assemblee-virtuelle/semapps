

const dataServers = {
  default: {
    domain: 'data.virtual-assembly.org',
  },
  cdlt: {
    domain: 'data.lescheminsdelatransition.org'
  }
  // On utilisera plutôt le CacheService pour ça
/*   pdcn: {
    type: 'gogocarto',
    baseUri: 'https://presdecheznous.org',
    reference: 'Organization'
  } */
};

const dataModel = {
  Project: {
    class: 'pair:Project',
    list: {
      servers: '@all', // Default value
      forceArray: []
    },
    create: {
      server: '@default', // Ou @pod ou la clé d'un serveur ou le nom de domaine d'un serveur
    },
    specialFields: {
      title: 'pair:label',
      latitude: '',
    }
  }
};

const voidDescription = {
  '@id': 'https://data.virtual-assembly.org/.well-known/void',
  '@type': 'void:Dataset',
  'dc:title': "Virtual Assembly",
  'dc:description': "Virtual Assembly ecosystem",
  'dc:modified': "2020-11-17",
  'dc:license': 'http://www.opendatacommons.org/norms/odc-by-sa/',
  'void:feature': 'http://www.w3.org/ns/formats/N-Triples',
  'void:sparqlEndpoint': 'https://data.virtual-assembly.org/sparql',
  'void:rootResource': 'https://data.virtual-assembly.org/',
  'void:uriSpace': 'https://data.virtual-assembly.org/',
  'void:vocabulary': 'http://purl.org/dc/terms/',
  'void:classPartition': [{
    'void:uriSpace': "https://data.virtual-assembly.org/organizations/",
    'void:class': 'pair:Organization',
    'void:entities': 35,
    'semapps:blankNodes': ['pair:hasLocation', 'pair:hasLocation/pair:hasPostalAddress'],
    // Défini au niveau du data provider ?
    // Si c'est une pair:Organization, on peut déduire ces champs
    'semapps:specialFields': {
      'semapps:titleField': 'pair:label',
      'semapps:latitudeField': 'pair:hasLocation/pair:latitude',
    }
  }]
}
