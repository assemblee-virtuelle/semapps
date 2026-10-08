import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import MailService from 'moleculer-mail';
import type { ServiceSchema } from 'moleculer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The templates are at the root of the package, but this file also runs from dist/ (one level deeper)
const templateFolder = path.join(
  __dirname,
  __dirname.includes(`${path.sep}dist${path.sep}`) ? '../../templates' : '../templates'
);

const AuthMailSchema = {
  name: 'auth.mail' as const,
  mixins: [MailService],
  settings: {
    defaults: {
      locale: 'en',
      frontUrl: null
    },
    templateFolder,
    from: null,
    transport: null
  },
  actions: {
    sendResetPasswordEmail: {
      async handler(ctx) {
        const { account, token } = ctx.params;

        await this.actions.send(
          {
            to: account.email,
            template: 'reset-password',
            locale: this.getTemplateLocale(account.preferredLocale || this.settings.defaults.locale),
            data: {
              account,
              resetUrl: `${urlJoin(this.settings.defaults.frontUrl, 'login')}?new_password=true&token=${token}`
            }
          },
          {
            parentCtx: ctx
          }
        );
      }
    }
  },
  methods: {
    getTemplateLocale(userLocale) {
      switch (userLocale) {
        case 'fr':
          return 'fr-FR';
        case 'en':
          return 'en-EN';
        default:
          return 'en-EN';
      }
    }
  }
} satisfies ServiceSchema;

export default AuthMailSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [AuthMailSchema.name]: typeof AuthMailSchema;
    }
  }
}
