import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import MailService from 'moleculer-mail';
import { ServiceSchema, defineAction } from 'moleculer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    sendResetPasswordEmail: defineAction({
      async handler(ctx) {
        const { account, token } = ctx.params;

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        await this.actions.send(
          {
            // @ts-expect-error TS(2339): Property 'email' does not exist on type 'never'.
            to: account.email,
            template: 'reset-password',
            // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
            locale: this.getTemplateLocale(account.preferredLocale || this.settings.defaults.locale),
            data: {
              account,
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              resetUrl: `${urlJoin(this.settings.defaults.frontUrl, 'login')}?new_password=true&token=${token}`
            }
          },
          {
            parentCtx: ctx
          }
        );
      }
    })
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
