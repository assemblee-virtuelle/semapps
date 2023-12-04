const fetch = require('node-fetch');

module.exports = {
  visibility: 'public',
  params: {
    url: 'string'
  },
  async handler(ctx) {
    const { url } = ctx.params;

    const response = await fetch(`http://prefix.cc/?q=${encodeURIComponent(url)}`);

    if (response.status === 302) {
      const redirectUrl = response.headers.get('Location');

      const result = redirectUrl?.replace('http://prefix.cc/', '').split(':');

      return result && result[0];
    }

    return null;
  }
};
