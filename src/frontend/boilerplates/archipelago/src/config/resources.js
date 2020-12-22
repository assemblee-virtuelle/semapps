const resources = {
  Project: {
    types: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'projects',
    slugField: 'pair:label'
  },
  User: {
    types: ['pair:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'users',
    slugField: ['pair:firstName', 'pair:lastName']
  },
  Skill: {
    types: ['pair:Skill'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'skills',
    slugField: 'pair:label'
  },
  Theme: {
    types: ['pair:Theme'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'themes',
    slugField: 'pair:label'
  },
  Document: {
    types: ['pair:Document'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'documents',
    slugField: 'pair:label'
  },
  Event: {
    types: ['pair:Event'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'events',
    slugField: 'pair:label'
  },
  Folder: {
    types: ['pair:Folder'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'folders',
    slugField: 'pair:label'
  },
  // General classes
  Actor: {
    types: ['pair:Organization', 'pair:Person']
  },
  Activity: {
    types: ['pair:Project', 'pair:Event']
  },
  Subject: {
    types: ['pair:Project', 'pair:Organization', 'pair:Person', 'pair:Event']
  }
};

export default resources;
