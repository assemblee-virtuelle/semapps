const bcrypt = require('bcrypt');
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'auth.account',
  settings: {
    containerUri: null,
    reservedUsernames: []
  },
  dependencies: ['ldp.resource', 'ldp.container', 'triplestore'],
  async started() {
    const { containerUri } = this.settings;
    const exists = await this.broker.call('ldp.container.exist', { containerUri }, { meta: { dataset: 'config' } });
    if (!exists) {
      console.log(`Container ${containerUri} doesn't exist, creating it...`);
      await this.broker.call('ldp.container.create', { containerUri }, { meta: { dataset: 'config' } });
    }
  },
  actions: {
    async create(ctx) {
      const { username, password, email, webId } = ctx.params;
      const hashedPassword = await this.hashPassword(password);

      // Ensure the username has no space or special characters
      if (!this.isValidUsername(username)) {
        throw new Error('username.invalid');
      }

      // Ensure we don't use reservedUsernames
      if (this.settings.reservedUsernames.includes(username)) {
        throw new Error('username.already.exists');
      }

      // Ensure email or username doesn't already exist
      if (await ctx.call('auth.account.usernameExists', { username })) {
        throw new Error('username.already.exists');
      }
      if (await ctx.call('auth.account.emailExists', { email })) {
        throw new Error('email.already.exists');
      }

      const accountUri = await ctx.call(
        'ldp.resource.post',
        {
          containerUri: this.settings.containerUri,
          resource: {
            '@context': {
              semapps: 'http://semapps.org/ns/core#'
            },
            '@type': 'semapps:Account',
            'semapps:username': username,
            'semapps:email': email,
            'semapps:password': hashedPassword,
            'semapps:webId': webId
          },
          contentType: MIME_TYPES.JSON,
          webId
        },
        { meta: { dataset: 'config' } }
      );

      return await ctx.call(
        'ldp.resource.get',
        {
          resourceUri: accountUri,
          accept: MIME_TYPES.JSON,
          webId
        },
        { meta: { dataset: 'config' } }
      );
    },
    async attachWebId(ctx) {
      const { accountUri, webId } = ctx.params;

      await ctx.call('triplestore.insert', {
        resource: `<${accountUri}> <http://semapps.org/ns/core#webId> <${webId}>`,
        webId: 'system',
        dataset: 'config'
      });
    },
    async verify(ctx) {
      const { username, password } = ctx.params;
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?accountUri ?passwordHash ?webId
          WHERE {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:username '${username}' .
            ?accountUri semapps:password ?passwordHash .
            ?accountUri semapps:webId ?webId .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system',
        dataset: 'config'
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
    async list(ctx) {
      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?username
          WHERE {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:username ?username .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system',
        dataset: 'config'
      });
      return results.length > 0 ? results.map(r => r.username.value) : [];
    },
    async usernameExists(ctx) {
      const { username } = ctx.params;
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          ASK {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:username '${username}' .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system',
        dataset: 'config'
      });
    },
    async emailExists(ctx) {
      const { email } = ctx.params;
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX semapps: <http://semapps.org/ns/core#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          ASK {
            <${this.settings.containerUri}> ldp:contains ?accountUri .
            ?accountUri semapps:email '${email}' .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system',
        dataset: 'config'
      });
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
        webId: 'system',
        dataset: 'config'
      });
      return results.length > 0 ? results[0].accountUri.value : null;
    }
  },
  methods: {
    isValidUsername(username) {
      const res = /^[a-zA-Z0-9\-_]+$/.exec(username);
      return !!res;
    },
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
