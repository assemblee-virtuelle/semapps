'use strict';

module.exports = {
  name: 'webid',
  dependencies: ['ldp'],
  actions: {
    async create(ctx) {
      const { nick, email, name, familyName } = ctx.params;
      await ctx.call('ldp.post', {
        typeURL: 'foaf:Person',
        '@context': { foaf: 'http://xmlns.com/foaf/0.1/' },
        'foaf:nick': nick,
        'foaf:email': email,
        'foaf:name': name,
        'foaf:familyName': familyName
      });
      return ctx.meta.$responseHeaders.Location;
    }
  }
};
