const resources = {
  User: {
    types: ['foaf:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'persons',
    slugField: ['foaf:name', 'foaf:familyName']
  }
};

export default resources;
