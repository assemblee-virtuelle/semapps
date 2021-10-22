const bcrypt = require('bcrypt');
const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');

module.exports = {
  name: 'auth.account',
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'AuthAccount', dataset: 'settings' }),
  settings: {
    idField: '@id',
    reservedUsernames: []
  },
  dependencies: ['triplestore'],
  actions: {
    async create(ctx) {
      const { username, password, email, webId } = ctx.params;
      const hashedPassword = await this.hashPassword(password);

      // Ensure the username has no space or special characters
      if( !this.isValidUsername(username) ) {
        throw new Error('username.invalid');
      }

      // Ensure we don't use reservedUsernames
      if( this.settings.reservedUsernames.includes(username) ) {
        throw new Error('username.already.exists');
      }

      // Ensure email or username doesn't already exist
      const usernameExists = await ctx.call('auth.account.usernameExists', { username });
      if( usernameExists ) {
        throw new Error('username.already.exists');
      }
      const emailExists = await ctx.call('auth.account.emailExists', { email });
      if( emailExists ) {
        throw new Error('email.already.exists');
      }

      return await this._create(ctx, {
        username,
        email,
        hashedPassword,
        webId
      });
    },
    async attachWebId(ctx) {
      const { accountUri, webId } = ctx.params;

      await this._update(ctx, {
        '@id': accountUri,
        webId
      });
    },
    async verify(ctx) {
      const { username, password } = ctx.params;

      const accounts = await this._find(ctx, {
        query: {
          username,
        },
      });

      if (accounts.length > 0) {
        const passwordMatch = await this.comparePassword(password, accounts[0].hashedPassword);
        if (passwordMatch) {
          return accounts[0];
        } else {
          throw new Error('account.not-found');
        }
      } else {
        throw new Error('account.not-found');
      }
    },
    async usernameExists(ctx) {
      const { username } = ctx.params;
      const accounts = await this._find(ctx, { query: { username } });
      return accounts.length > 0;
    },
    async emailExists(ctx) {
      const { email } = ctx.params;
      const accounts = await this._find(ctx, { query: { email } });
      return accounts.length > 0;
    },
    async findByWebId(ctx) {
      const { webId } = ctx.params;
      return this._find(ctx, { query: { webId } });
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
