const Handlebars = require('handlebars');
const fs = require('fs').promises;

const FormService = {
  name: 'form',
  dependencies: ['theme'],
  actions: {
    async display(ctx) {
      let actor = {};

      if( ctx.params.id ) {
        try {
          actor = await ctx.call('activitypub.actor.get', { id: ctx.params.id });
        } catch( e ) {
          actor = {};
        }
      }

      if( ctx.params.email ) actor['foaf:mbox'] = ctx.params.email;

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
      let actor, message;

      // Check if an actor already exist with this ID
      try {
        actor = await ctx.call('activitypub.actor.get', { id: ctx.params.id });
      } catch( e ) {}

      let actorData = {
        'foaf:mbox': ctx.params.email,
        'pair:hasInterest': ctx.params.themes
      };

      if( ctx.params.location === 'close-to-me' && ctx.params['address-result'] ) {
        const address = JSON.parse(ctx.params['address-result']);

        actorData.location = {
          type: 'Place',
          name: ctx.params.address,
          latitude: address.latlng.lat,
          longitude: address.latlng.lng,
          radius: 20 * 1000 // TODO set radius based on user response
        };
      } else if ( ctx.params.location === 'whole-world' && actor.location ) {
        actorData.location = undefined;
      }

      if( actor ) {
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
      if(options.data.root.actor && options.data.root.actor['pair:hasInterest'] && options.data.root.actor['pair:hasInterest'].includes(elem)) {
        return returnValue;
      }
    });

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

    this.formTemplate = Handlebars.compile(templateFile.toString());
  }
};

module.exports = FormService;
