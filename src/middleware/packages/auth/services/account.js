const bcrypt = require('bcrypt');
const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const crypto = require('crypto');

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
      let { uuid, username, password, email, webId, ...rest } = ctx.params;
      const hashedPassword = password ? await this.hashPassword(password) : undefined;

      email = email && email.toLowerCase();

      const emailExists = await ctx.call('auth.account.emailExists', { email });
      if (emailExists) {
        throw new Error('email.already.exists');
      }

      if (username) {
        await this.isValidUsername(ctx, username);
      } else {
        // If username is not provided, find an username based on the email
        const usernameFromEmail = email.split('@')[0].toLowerCase();
        let usernameValid = false,
          i = 0;
        do {
          username = i === 0 ? usernameFromEmail : usernameFromEmail + i;
          try {
            usernameValid = await this.isValidUsername(ctx, username);
          } catch (e) {
            // Do nothing, the loop will continue
          }
          i++;
        } while (!usernameValid);
      }

      return await this._create(ctx, {
        ...rest,
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

      // If the username includes a @, assume it is an email
      const query = username.includes('@') ? { email: username } : { username };

      const accounts = await this._find(ctx, { query });

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
    },
    async findByEmail(ctx) {
      const { email } = ctx.params;
      const accounts = await this._find(ctx, { query: { email } });
      return accounts.length > 0 ? accounts[0] : null;
    },
    async setPassword(ctx) {
      const { webId, password } = ctx.params;
      const hashedPassword = await this.hashPassword(password);
      const account = await ctx.call('auth.account.findByWebId', { webId });

      return await this._update(ctx, {
        '@id': account['@id'],
        hashedPassword
      });
    },
    async setNewPassword(ctx) {
      const { webId, token, password } = ctx.params;
      const hashedPassword = await this.hashPassword(password);
      const account = await ctx.call('auth.account.findByWebId', { webId });

      if (account.resetPasswordToken !== token) {
        throw new Error('auth.password.invalid_reset_token');
      }

      return await this._update(ctx, {
        '@id': account['@id'],
        hashedPassword,
        resetPasswordToken: undefined
      });
    },
    async generateResetPasswordToken(ctx) {
      const { webId } = ctx.params;
      const resetPasswordToken = await this.generateResetPasswordToken();
      const account = await ctx.call('auth.account.findByWebId', { webId });

      await this._update(ctx, {
        '@id': account['@id'],
        resetPasswordToken
      });

      return resetPasswordToken;
    },
    async findSettingsByWebId(ctx) {
      const { webId } = ctx.meta;
      const account = await ctx.call('auth.account.findByWebId', { webId });

      return {
        email: account['email'],
        preferredLocale: account['preferredLocale']
      };
    },
    async updateAccountSettings(ctx) {
      const { currentPassword, email, newPassword } = ctx.params;
      const { webId } = ctx.meta;
      const account = await ctx.call('auth.account.findByWebId', { webId });
      const passwordMatch = await this.comparePassword(currentPassword, account.hashedPassword);
      let params = {};

      if (!passwordMatch) {
        throw new Error('auth.account.invalid_password');
      }

      if (newPassword) {
        const hashedPassword = await this.hashPassword(newPassword);
        params = { ...params, hashedPassword };
      }

      if (email !== account['email']) {
        const existing = await ctx.call('auth.account.findByEmail', { email });
        if (existing) {
          throw new Error('email.already.exists');
        }

        params = { ...params, email };
      }

      return await this._update(ctx, {
        '@id': account['@id'],
        ...params
      });
    }
  },
  methods: {
    async isValidUsername(ctx, username) {
      // Ensure the username has no space or special characters
      if (!/^[a-z0-9\-+_.]+$/.exec(username)) {
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

      return true;
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
    },
    async generateResetPasswordToken() {
      return new Promise(resolve => {
        crypto.randomBytes(32, function(ex, buf) {
          if (ex) {
            reject(ex);
          }
          resolve(buf.toString('hex'));
        });
      });
    }
  }
};
