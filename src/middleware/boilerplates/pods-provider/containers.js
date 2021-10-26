const readWritePermissionsToCreator = creatorUri => ({
  user: {
    uri: creatorUri,
    read: true,
    write: true,
    control: true
  }
});

module.exports = [
  {
    path: '/events',
    acceptedTypes: ['pair:Event'],
    newResourcesPermissions: readWritePermissionsToCreator
  },
  {
    path: '/files'
  },
  // This must be the last route, otherwise it will override the routes above
  {
    path: '/'
  }
];
