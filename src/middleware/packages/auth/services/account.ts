import bcrypt from 'bcrypt';
import createSlug from 'speakingurl';
import DbService from 'moleculer-db';
import { TripleStoreAdapter } from '@semapps/triplestore';
import crypto from 'crypto';
import { ServiceSchema, defineAction } from 'moleculer';

// Taken from https://stackoverflow.com/a/9204568/7900695
const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthAccountSchema = {
  name: 'auth.account' as const,
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'AuthAccount', dataset: 'settings' }),
  settings: {
    idField: '@id',
    reservedUsernames: ['relay'],
    minPasswordLength: 1,
    minUsernameLength: 1
  },
  dependencies: ['triplestore'],
  actions: {
    create: defineAction({
      async handler(ctx) {
        let { uuid, username, password, email, webId, ...rest } = ctx.params;

        // FORMAT AND VERIFY PASSWORD

        if (password) {
          if (password.length < this.settings.minPasswordLength) {
            throw new Error('password.too-short');
          }

          password = await this.hashPassword(password);
        }

        // FORMAT AND VERIFY EMAIL

        if (email) {
          email = email.toLowerCase();

          const emailExists = await ctx.call('auth.account.emailExists', { email });
          if (emailExists) {
            throw new Error('email.already.exists');
          }

          if (!emailRegexp.test(email)) {
            throw new Error('email.invalid');
          }
        }

        // FORMAT AND VERIFY USERNAME

        if (username) {
          if (!ctx.meta.isSystemCall) {
            const { isValid, error } = await this.isValidUsername(ctx, username);
            if (!isValid) throw new Error(error);
          }
        } else if (email) {
          // If username is not provided, find one automatically from the email (without errors)
          username = createSlug(email.split('@')[0].toLowerCase());

          let { isValid, error } = await this.isValidUsername(ctx, username);

          if (!isValid) {
            if (error === 'username.invalid' || error === 'username.too-short') {
              // If username generated from email is invalid, use a generic name
              username = 'user';
            }

            // If necessary, add a number after the username
            let i = 0;
            do {
              username = i === 0 ? username : username + i;
              ({ isValid } = await this.isValidUsername(ctx, username));
            } while (!isValid);
          }
        } else {
          throw new Error('You must provide at least a username or an email address');
        }

        return await this._create(ctx, {
          ...rest,
          uuid,
          username,
          email,
          hashedPassword: password,
          webId
        });
      }
    }),

    attachWebId: defineAction({
      async handler(ctx) {
        const { accountUri, webId } = ctx.params;

        return await this._update(ctx, {
          '@id': accountUri,
          webId
        });
      }
    }),

    verify: defineAction({
      async handler(ctx) {
        const { username, password } = ctx.params;

        // If the username includes a @, assume it is an email
        const query = username.includes('@') ? { email: username } : { username };

        const accounts = await this._find(ctx, { query });

        if (accounts.length > 0) {
          const passwordMatch = await this.comparePassword(password, accounts[0].hashedPassword);
          if (passwordMatch) {
            return accounts[0];
          }
          throw new Error('account.not-found');
        } else {
          throw new Error('account.not-found');
        }
      }
    }),

    usernameExists: defineAction({
      async handler(ctx) {
        const { username } = ctx.params;
        const accounts = await this._find(ctx, { query: { username } });
        return accounts.length > 0;
      }
    }),

    emailExists: defineAction({
      async handler(ctx) {
        const { email } = ctx.params;
        const accounts = await this._find(ctx, { query: { email } });
        return accounts.length > 0;
      }
    }),

    find: defineAction({
      /** Overwrite find method, to filter accounts with tombstone. */
      async handler(ctx) {
        /** @type {object[]} */
        const accounts = await this._find(ctx, ctx.params);
        return accounts.filter((account: any) => !account.deletedAt);
      }
    }),

    findByUsername: defineAction({
      async handler(ctx) {
        const { username } = ctx.params;
        const accounts = await this._find(ctx, { query: { username } });
        return accounts.length > 0 ? accounts[0] : null;
      }
    }),

    findByWebId: defineAction({
      async handler(ctx) {
        const { webId } = ctx.params;
        const accounts = await this._find(ctx, { query: { webId } });
        return accounts.length > 0 ? accounts[0] : null;
      }
    }),

    findByEmail: defineAction({
      async handler(ctx) {
        const { email } = ctx.params;
        const accounts = await this._find(ctx, { query: { email } });
        return accounts.length > 0 ? accounts[0] : null;
      }
    }),

    setPassword: defineAction({
      async handler(ctx) {
        const { webId, password } = ctx.params;
        const hashedPassword = await this.hashPassword(password);
        const account = await ctx.call('auth.account.findByWebId', { webId });

        return await this._update(ctx, {
          '@id': account['@id'],
          hashedPassword
        });
      }
    }),

    setNewPassword: defineAction({
      async handler(ctx) {
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
      }
    }),

    generateResetPasswordToken: defineAction({
      async handler(ctx) {
        const { webId } = ctx.params;
        const resetPasswordToken = await this.generateResetPasswordToken();
        const account = await ctx.call('auth.account.findByWebId', { webId });

        await this._update(ctx, {
          '@id': account['@id'],
          resetPasswordToken
        });

        return resetPasswordToken;
      }
    }),

    findDatasetByWebId: defineAction({
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const account = await ctx.call('auth.account.findByWebId', { webId });
        return account?.username;
      }
    }),

    findSettingsByWebId: defineAction({
      async handler(ctx) {
        const { webId } = ctx.meta;

        const account = await ctx.call('auth.account.findByWebId', { webId });

        return {
          email: account.email,
          preferredLocale: account.preferredLocale
        };
      }
    }),

    updateAccountSettings: defineAction({
      async handler(ctx) {
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

        if (email !== account.email) {
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
    }),

    deleteByWebId: defineAction({
      async handler(ctx) {
        const { webId } = ctx.params;
        const account = await ctx.call('auth.account.findByWebId', { webId });

        if (account) {
          await this._remove(ctx, { id: account['@id'] });
          return true;
        }

        return false;
      }
    }),

    setTombstone: defineAction({
      // Remove email and password from an account, set deletedAt timestamp.
      async handler(ctx) {
        const { webId } = ctx.params;
        const account = await ctx.call('auth.account.findByWebId', { webId });

        return await this._update(ctx, {
          // Set all values to undefined...
          ...Object.fromEntries(Object.keys(account).map(key => [key, null])),
          '@id': account['@id'],
          // ...except for
          webId: account.webId,
          username: account.username,
          // And add a deletedAt date.
          deletedAt: new Date().toISOString()
        });
      }
    })
  },
  methods: {
    async isValidUsername(ctx, username) {
      let error;

      // Ensure the username has no space or special characters
      if (!/^[a-z0-9\-+_.]+$/.exec(username)) {
        error = 'username.invalid';
      }

      if (username.length < this.settings.minUsernameLength) {
        error = 'username.too-short';
      }

      // Ensure we don't use reservedUsernames
      if (this.settings.reservedUsernames.includes(username)) {
        error = 'username.reserved';
      }

      // Ensure username doesn't already exist
      const usernameExists = await ctx.call('auth.account.usernameExists', { username });
      if (usernameExists) {
        error = 'username.already.exists';
      }

      return { isValid: !error, error };
    },
    async hashPassword(password) {
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err: any, hash: any) => {
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
        bcrypt.compare(password, hash, (err: any, res: any) => {
          if (res === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    async generateResetPasswordToken() {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (ex, buf) => {
          if (ex) {
            reject(ex);
          }
          resolve(buf.toString('hex'));
        });
      });
    }
  }
} satisfies ServiceSchema;

export default AuthAccountSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AuthAccountSchema.name]: typeof AuthAccountSchema;
    }
  }
}
