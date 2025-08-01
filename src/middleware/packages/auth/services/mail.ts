import path from 'path';
import urlJoin from 'url-join';
import MailService from 'moleculer-mail';

const AuthMailSchema = {
  name: 'auth.mail',
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
    async sendResetPasswordEmail(ctx) {
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
};

export default AuthMailSchema;
