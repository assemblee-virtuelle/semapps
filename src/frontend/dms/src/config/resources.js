const resources = {
  Project: {
    types: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'resources'
  },
  Organization: {
    types: ['pair:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'resources'
  },
  User: {
    types: ['pair:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'resources'
  },
  Skill: {
    types: ['pair:Skill'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'resources'
  },
  Interest: {
    types: ['pair:Thema'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'resources'
  }
};

export default resources;
