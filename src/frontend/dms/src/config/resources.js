const resources = {
  Actor: {
    types: ['as:Person', 'as:Organization']
  },
  Tag: {
    types: ['pair:Thema', 'semapps:ProjectState']
  },
  Activity: {
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'activities'
  },
  Project: {
    types: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects/projects'
  },
  Note: {
    types: ['as:Note'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects/notes'
  },
  Theme: {
    types: ['pair:Thema'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'themes'
  }
};

export default resources;
