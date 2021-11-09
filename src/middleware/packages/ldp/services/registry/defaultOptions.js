module.exports = {
  accept: 'text/turtle',
  jsonContext: null,
  queryDepth: 0,
  dereference: [],
  newResourcesPermissions: webId => {
    switch (webId) {
      case 'anon':
        return {
          anon: {
            read: true,
            write: true
          }
        };
      case 'system':
        return {
          anon: {
            read: true
          },
          anyUser: {
            read: true,
            write: true
          }
        };
      default:
        return {
          anon: {
            read: true
          },
          anyUser: {
            read: true
          },
          user: {
            uri: webId,
            read: true,
            write: true,
            control: true
          }
        };
    }
  }
};
