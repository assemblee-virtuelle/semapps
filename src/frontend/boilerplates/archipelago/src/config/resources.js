const resources = {
  Subject: {
    types: ['pair:Project', 'pair:Organization', 'pair:Person', 'pair:Event']
  },
  Project: {
    types: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'projects',
    slugField: 'pair:label'
  },
  Organization: {
    types: ['pair:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'organizations',
    slugField: 'pair:label'
  },
  OrganizationType: {
    types: ['pair:OrganizationType'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'organization-types',
    slugField: 'pair:label'
  },
  User: {
    types: ['pair:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'users',
    slugField: ['pair:firstName', 'pair:lastName']
  },
  Theme: {
    types: ['pair:Theme'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'themes',
    slugField: 'pair:label'
  },
  Place: {
    types: ['pair:Place'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'places',
    slugField: 'pair:label'
  },
  Event: {
    types: ['pair:Event'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'events',
    slugField: 'pair:label'
  }
};

export default resources;
