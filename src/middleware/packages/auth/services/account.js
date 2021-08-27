const bcrypt = require('bcrypt');
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'auth.account',
  settings: {
    containerUri: null
  },
  dependencies: ['ldp', 'triplestore'],
  actions: {
    async create(ctx) {
      const { email, password, webId } = ctx.params;
      const hashedPassword = await this.hashPassword(password);
      const accountUri = await ctx.call('ldp.resource.post', {
        containerUri: this.settings.containerUri,
        resource: {
          '@context': {
            semapps: 'http://semapps.org/ns/core#'
          },
          '@type': 'semapps:Account',
          'semapps:email': email,
          'semapps:password': hashedPassword,
          'semapps:webId': webId
        },
        contentType: MIME_TYPES.JSON,
        webId
      });

      return await ctx.call('ldp.resource.get', {
        resourceUri: accountUri,
        accept: MIME_TYPES.JSON,
        webId
      });
    },
    async verify(ctx) {
      const { email, password } = ctx.params;
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?accountUri ?passwordHash ?webId
          WHERE {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:email '${email}' .
            ?accountUri semapps:password ?passwordHash .
            ?accountUri semapps:webId ?webId .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      if (results.length > 0) {
        const passwordMatch = await this.comparePassword(password, results[0].passwordHash.value);
        if (passwordMatch) {
          return { accountUri: results[0].accountUri.value, webId: results[0].webId.value };
        } else {
          throw new Error('account.not-found');
        }
      } else {
        throw new Error('account.not-found');
      }
    },
    async findByEmail(ctx) {
      const { email } = ctx.params;
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?accountUri ?webId
          WHERE {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:email '${email}' .
            ?accountUri semapps:webId ?webId .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
      return results.length > 0 ? results[0].webId.value : null;
    },
    async findByWebId(ctx) {
      const { webId } = ctx.params;
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?accountUri 
          WHERE {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:webId "${webId}" .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
      return results.length > 0 ? results[0].accountUri.value : null;
    }
  },
  methods: {
    async hashPassword(password) {
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });
    },
    async comparePassword(password, hash) {
      return new Promise(resolve => {
        bcrypt.compare(password, hash, (err, res) => {
          if (res === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }
  }
};
