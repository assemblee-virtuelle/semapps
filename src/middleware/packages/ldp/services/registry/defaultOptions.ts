const Schema = {
  accept: 'text/turtle',
  readOnly: false,
  excludeFromMirror: false,
  permissions: (webId: any) => {
    switch (webId) {
      case 'anon':
        return {
          anon: {
            read: true,
            append: true
          }
        };

      case 'system':
        return {
          anon: {
            read: true
          },
          anyUser: {
            write: true
          }
        };

      default:
        return {
          user: {
            uri: webId,
            read: true,
            write: true,
            control: true
          }
        };
    }
  },
  newResourcesPermissions: (webId: any) => {
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
            write: true
          }
        };
      default:
        return {
          anon: {
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
  },
  controlledActions: {}
};

export default Schema;
