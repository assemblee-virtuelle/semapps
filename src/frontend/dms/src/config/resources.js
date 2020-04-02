const resources = {
  Project: {
    types: ['pairv1:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Organization: {
    types: ['pairv1:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Person: {
    types: ['pairv1:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Concept: {
    types: ['skos:Concept'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Agent: {
    types: ['pairv1:Person', 'pairv1:Organization']
  }
};

export default resources;
