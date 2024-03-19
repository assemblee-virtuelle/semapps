const fetch = require('node-fetch');

module.exports = {
  visibility: 'public',
  params: {
    uri: 'string'
  },
  async handler(ctx) {
    const { uri } = ctx.params;

    const response = await fetch(`http://prefix.cc/?q=${encodeURIComponent(uri)}`, { redirect: 'manual' });

    if (response.status === 302) {
      const redirectUrl = response.headers.get('Location');

      const result = redirectUrl?.replace('http://prefix.cc/', '').split(':');

      return result && result[0];
    }

    return null;
  }
};
