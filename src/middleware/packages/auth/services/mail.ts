import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import MailService from 'moleculer-mail';
import { ServiceSchema } from 'moleculer';
<<<<<<< HEAD
=======
import { fileURLToPath } from 'url';

// @ts-expect-error TS(1470): The 'import.meta' meta-property is not allowed in ... Remove this comment to see the full error message
const __dirname = path.dirname(fileURLToPath(import.meta.url));
>>>>>>> 2.0

const AuthMailSchema = {
  name: 'auth.mail' as const,
  mixins: [MailService],
  settings: {
    defaults: {
      locale: 'en',
      frontUrl: null
    },
    templateFolder: path.join(__dirname, '../templates'),
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
