module.exports = {
  authorization: true,
  authentication: false,
  aliases: {
    'GET me': 'webid.view'
  },
  // When using multiple routes we must set the body parser for each route.
  bodyParsers: {
    json: true
  }
};
