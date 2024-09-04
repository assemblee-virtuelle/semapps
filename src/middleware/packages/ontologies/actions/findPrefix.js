const fetch = require('node-fetch');
const { isURL } = require('../utils');

module.exports = {
  visibility: 'public',
  params: {
    uri: 'string'
  },
  async handler(ctx) {
    const { uri } = ctx.params;

    if (!isURL(uri)) throw new Error(`The uri param of the ontologies.findPrefix action must be a full URL`);

    const response = await fetch(`http://prefix.cc/?q=${encodeURIComponent(uri)}`, { redirect: 'manual' });

    if (response.status === 302) {
      const redirectUrl = response.headers.get('Location');

      const result = redirectUrl?.replace('http://prefix.cc/', '').split(':');

      return result && result[0];
    }

    return null;
  }
};
