const Handlebars = require('handlebars');
const fs = require('fs').promises;

module.exports = {
  name: 'auth.form',
  settings: {
    instanceName: 'localhost:3000',
    path: '/'
  },
  dependencies: ['api'],
  actions: {
    async display(ctx) {
      const { mode, redirect, message, name, username, email, password } = ctx.params;

      ctx.meta.$responseType = 'text/html';
      return this.formTemplate({
        title: this.settings.instanceName,
        path: this.settings.path,
        mode,
        redirect,
        message,
        name,
        username,
        email,
        password
      });
    },
    async process(ctx) {
      let { mode, redirect, name, username, email, password } = ctx.params;

      if (mode === 'login') {
        try {
          const { token, newUser } = await ctx.call('auth.login', { username, password });
          return this.redirectToApp(ctx, redirect, token, newUser);
        } catch(e) {
          return this.redirectToForm(ctx, { message: e.message, mode, redirect, username, password });
        }
      } else if (mode === 'signup') {
        try {
          const { token, newUser } = await ctx.call('auth.signup', { name, username, email, password });
          return this.redirectToApp(ctx, redirect, token, newUser);
        } catch(e) {
          return this.redirectToForm(ctx, { message: e.message, mode, redirect, name, username, email, password });
        }
      }
    }
  },
  async started() {
    await this.broker.call('api.addRoute', {
      route: {
        authorization: false,
        authentication: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        path: this.settings.path,
        aliases: {
          'POST /': 'auth.form.process',
          'GET /': 'auth.form.display'
        }
      },
      toBottom: false
    });

    const templateFile = await fs.readFile(__dirname + '/../templates/form.hbs');

    Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
      if (typeof v2 === 'number') v1 = parseInt(v1, 10);
      switch (operator) {
        case '==':
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '!=':
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case '!==':
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case '<':
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case '<=':
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case '>':
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case '>=':
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case '&&':
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case '||':
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

    this.formTemplate = Handlebars.compile(templateFile.toString());
  },
  methods: {
    redirectToForm(ctx, searchParams) {
      searchParams = new URLSearchParams(searchParams);
      ctx.meta.$statusCode = 302;
      ctx.meta.$responseHeaders = { Location: `${this.settings.path}?${searchParams.toString()}` };
    },
    redirectToApp(ctx, redirect, token, newUser) {
      const url = new URL(redirect);
      url.searchParams.set('login', true);
      url.searchParams.set('token', token);
      url.searchParams.set('new', newUser ? 'true' : 'false');
      ctx.meta.$statusCode = 302;
      ctx.meta.$responseHeaders = { Location: url.toString() };
    },
  }
};
