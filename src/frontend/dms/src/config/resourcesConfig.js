const resourcesConfig = {
  Project: {
    types: ['pairv1:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/pairv1:Project'
  },
  Organization: {
    types: ['pairv1:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/pairv1:Organization'
  },
  Person: {
    types: ['pairv1:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/pairv1:Person'
  },
  Concept: {
    types: ['skos:Concept'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/skos:Concept'
  },
  Agent: {
    types: ['pairv1:Person', 'pairv1:Organization']
  }
};

export default resourcesConfig;
