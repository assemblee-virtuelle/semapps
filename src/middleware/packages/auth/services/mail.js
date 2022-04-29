const MailService = require('moleculer-mail');
const path = require('path');

module.exports = {
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
          locale: this.getTemplateLocale( account.preferredLocale || this.settings.defaults.locale),
          data: {
            account,
            token,
            frontUrl: account.preferredFrontUrl || this.settings.defaults.frontUrl
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
