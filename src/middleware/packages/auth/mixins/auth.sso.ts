import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'expr... Remove this comment to see the full error message
import session from 'express-session';
import { ServiceSchema } from 'moleculer';
import AuthMixin from './auth.ts';
import saveRedirectUrl from '../middlewares/saveRedirectUrl.ts';
import redirectToFront from '../middlewares/redirectToFront.ts';
import localLogout from '../middlewares/localLogout.ts';
import { Account } from '../types.ts';

const AuthSSOMixin = {
  mixins: [AuthMixin],
  settings: {
    baseUrl: null,
    jwtPath: null,
    registrationAllowed: true,
    reservedUsernames: [],
    // SSO-specific settings
    sessionSecret: 's€m@pps',
    selectSsoData: null
  },
  actions: {
    loginOrSignup: {
      async handler(ctx) {
        const { ssoData } = ctx.params;

        const profileData = this.settings.selectSsoData ? await this.settings.selectSsoData(ssoData) : ssoData;

        // TODO use UUID to identify unique accounts with SSO
        const existingAccounts: Account[] = await ctx.call('auth.account.find', {
          query: { email: profileData.email }
        });

        let webId: string;
        let newUser;
        if (existingAccounts.length > 0) {
          webId = existingAccounts[0].webId;
          newUser = false;

          // TODO update account with recent profileData information

          ctx.emit('auth.connected', { webId }, { meta: { webId: null, dataset: null } });
        } else {
          if (!this.settings.registrationAllowed) {
            throw new Error('registration.not-allowed');
          }

          ({ webId } = (await ctx.call('auth.account.create', {
            uuid: profileData.uuid,
            email: profileData.email,
            username: profileData.username
          })) as Account);

          newUser = true;

          ctx.emit('auth.registered', { webId }, { meta: { webId: null, dataset: null } });
        }

        const token = await ctx.call('auth.jwt.generateServerSignedToken', { payload: { webId } });

        return { token, newUser };
      }
    }
  },
  methods: {
    getApiRoutes(basePath) {
      const sessionMiddleware = session({ secret: this.settings.sessionSecret, maxAge: null });
      return [
        {
          path: path.join(basePath, '/auth'),
          name: 'auth',
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            'GET /': [saveRedirectUrl, this.passport.authenticate(this.passportId, { session: false }), redirectToFront]
          }
        },
        {
          path: path.join(basePath, '/auth/logout'),
          name: 'auth-logout',
          use: [sessionMiddleware, this.passport.initialize(), this.passport.session()],
          aliases: {
            'GET /': [saveRedirectUrl, localLogout, redirectToFront]
          }
        }
      ];
    }
  }
} satisfies Partial<ServiceSchema>;

export default AuthSSOMixin;
