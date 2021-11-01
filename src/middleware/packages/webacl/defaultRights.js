const defaultContainerRights = webId => {
  switch (webId) {
    case 'anon':
      return({
        anon: {
          read: true,
          append: true
        }
      });

    case 'system':
      return({
        anon: {
          read: true
        },
        anyUser: {
          read: true,
          write: true
        }
      });

    default:
      return({
        user: {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      });
  }
};

const defaultCollectionRights = webId => ({
  anon: {
    write: true
  }
});

module.exports = {
  defaultContainerRights,
  defaultCollectionRights
};
