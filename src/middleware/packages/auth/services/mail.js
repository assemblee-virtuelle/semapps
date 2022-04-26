const MailService = require('moleculer-mail');
const path = require("path");

module.exports = {
  name: 'auth.mail',
  settings: {
    defaultLocale: 'en',
    templateFolder: path.join(__dirname, "../mail/templates"),
    from: null,
    transport: null
  },
  async created() {
    await this.broker.createService(MailService, {
      settings: this.settings
    });
  },
  actions: {
    async sendResetPasswordEmail(ctx) {
      const { account: { email, username, preferredLocale }, token } = ctx.params;
      ctx.call("mail.send", {
        to: email,
        template: "reset-password",
        locale: this.getTemplateLocale(ctx, preferredLocale),
        data: {
          username,
          token,
        }
      })
    }
  },
  methods: {
    getTemplateLocale(ctx, userLocale) {
      switch (userLocale) {
        case "fr":
          return "fr-FR"
        case "en":
          return "en-EN"
        default:
          return "en-EN"
      }
    }
  }
};
