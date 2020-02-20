const Handlebars = require('handlebars');
const fs = require('fs').promises;

const FormService = {
  name: 'form',
  dependencies: ['theme'],
  actions: {
    async display(ctx) {
      let actor = ctx.params.id && await ctx.call('activitypub.actor.get', { id: ctx.params.id });

      if( !actor ) {
        actor = {
          'foaf:mbox': ctx.params.email
        };
      }

      if( !actor.location ) {
        actor.location = { radius: '25000' };
      }

      const themes = await ctx.call('theme.list');

      ctx.meta.$responseType = 'text/html';
      return this.formTemplate({
        title: 'Suivez les projets de la Fabrique',
        themes: themes.rows,
        id: ctx.params.id,
        actor,
        message: ctx.params.message
      });
    },
    async process(ctx) {
      let message;

      // Check if an actor already exist with this ID
      let actor = await ctx.call('activitypub.actor.get', { id: ctx.params.id });

      let actorData = {
        'foaf:mbox': ctx.params.email,
        'pair:hasInterest': ctx.params.themes
      };

      if (ctx.params.location === 'close-to-me') {
        if (ctx.params['address-result']) {
          const address = JSON.parse(ctx.params['address-result']);
          actorData.location = {
            type: 'Place',
            name: ctx.params.address,
            latitude: address.latlng.lat,
            longitude: address.latlng.lng,
            radius: ctx.params.radius
          };
        } else if (actor && actor.location) {
          // If actor location is already set, only update the radius
          actorData.location = {
            ...actor.location,
            radius: ctx.params.radius
          };
        }
      } else if (ctx.params.location === 'whole-world') {
        // If actor location was set, remove it
        if (actor && actor.location) {
          actorData.location = undefined;
        }
      }

      if (actor) {
        actor = await ctx.call('activitypub.actor.update', {
          '@id': ctx.params.id,
          ...actorData
        });

        message = 'updated';
      } else {
        actor = await ctx.call('activitypub.actor.create', {
          slug: ctx.params.id,
          type: 'Person',
          ...actorData
        });

        message = 'created';
      }

      ctx.meta.$statusCode = 302;
      ctx.meta.$location = `/?id=${encodeURI(actor['@id'])}&message=${message}`;
    }
  },
  async started() {
    const templateFile = await fs.readFile(__dirname + '/../templates/form.html');

    Handlebars.registerHelper('ifInActorThemes', function(elem, returnValue, options) {
      if (
        options.data.root.actor &&
        options.data.root.actor['pair:hasInterest'] &&
        options.data.root.actor['pair:hasInterest'].includes(elem)
      ) {
        return returnValue;
      }
    });

    Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
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
  }
};

module.exports = FormService;
