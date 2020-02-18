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
        actor,
        colibrisId: ctx.params['colibris-id']
      });
    },
    async process(ctx) {
      let actor, location;

      if( ctx.params.location === 'close-to-me' && ctx.params['address-result'] ) {
        const address = JSON.parse(ctx.params['address-result']);

        location = {
          type: 'Place',
          name: ctx.params.address,
          latitude: address.latlng.lat,
          longitude: address.latlng.lng,
          radius: 20 * 1000 // TODO set radius based on user response
        };
      }

      if( ctx.params['actor-id'] ) {
        actor = await ctx.call('activitypub.actor.update', {
          '@id': ctx.params['actor-id'],
          'foaf:mbox': ctx.params.email,
          'location': location,
          'pair:hasInterest': [ ctx.params.themes ]
        });
      } else {
        actor = await ctx.call('activitypub.actor.create', {
          '@id': ctx.params['colibris-id'],
          type: 'Person',
          'foaf:mbox': ctx.params.email,
          'location': location,
          'pair:hasInterest': [ ctx.params.themes ]
        });
      }

      console.log('actor', actor);

      ctx.meta.$statusCode = 302;
      ctx.meta.$location = "/?id=" + encodeURI(actor['@id']);
    }
  },
  async started() {
    const templateFile = await fs.readFile(__dirname + '/../templates/form.html');

    Handlebars.registerHelper('ifInActorThemes', function(elem, returnValue, options) {
      if(options.data.root.actor && options.data.root.actor['pair:hasInterest'] && options.data.root.actor['pair:hasInterest'].includes(elem)) {
        return returnValue;
      }
    });

    this.formTemplate = Handlebars.compile(templateFile.toString());
  }
};

module.exports = FormService;
