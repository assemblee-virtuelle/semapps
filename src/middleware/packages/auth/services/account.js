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
      let { uuid, username, password, email, webId } = ctx.params;
      const hashedPassword = password ? await this.hashPassword(password) : undefined;

      const emailExists = await ctx.call('auth.account.emailExists', { email });
      if (emailExists) {
        throw new Error('email.already.exists');
      }

      if (username) {
        await this.isValidUsername(ctx, username);
      } else {
        // If username is not provided, find an username based on the email
        let usernameValid = false,
          i = 1;
        do {
          i++;
          username = email.split('@')[0].toLowerCase();
          if (i > 2) username += i;
          usernameValid = await this.isValidUsername(ctx, username);
        } while (usernameValid);
      }

      return await this._create(ctx, {
        uuid,
        username,
        email,
        hashedPassword,
        webId
      });
    },
    async attachWebId(ctx) {
      const { accountUri, webId } = ctx.params;

      return await this._update(ctx, {
        '@id': accountUri,
        webId
      });
    },
    async verify(ctx) {
      const { username, password } = ctx.params;

      const accounts = await this._find(ctx, {
        query: {
          username
        }
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
      const accounts = await this._find(ctx, { query: { webId } });
      return accounts.length > 0 ? accounts[0] : null;
    }
  },
  methods: {
    async isValidUsername(ctx, username) {
      // Ensure the username has no space or special characters
      if (!/^[a-zA-Z0-9\-_]+$/.exec(username)) {
        throw new Error('username.invalid');
      }

      // Ensure we don't use reservedUsernames
      if (this.settings.reservedUsernames.includes(username)) {
        throw new Error('username.already.exists');
      }

      // Ensure email or username doesn't already exist
      const usernameExists = await ctx.call('auth.account.usernameExists', { username });
      if (usernameExists) {
        throw new Error('username.already.exists');
      }
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
