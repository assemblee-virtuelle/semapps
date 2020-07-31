const resources = {
  Project: {
    types: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Organization: {
    types: ['pair:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  User: {
    types: ['pair:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Concept: {
    types: ['skos:Concept'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Agent: {
    types: ['pair:Person', 'pair:Organization']
  }
};

export default resources;
