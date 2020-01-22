module.exports = {
  authentication: true,
  aliases: {
    'POST me': 'webid.create'
  },
  // When using multiple routes we must set the body parser for each route.
  bodyParsers: {
    json: true
  }
};
