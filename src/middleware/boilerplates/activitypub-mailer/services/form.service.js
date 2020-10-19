const Handlebars = require('handlebars');
const slugify = require('slugify');
const urlJoin = require('url-join');
const fs = require('fs').promises;
const { ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } = require('@semapps/activitypub');
const CONFIG = require('../config');
const { defaultToArray } = require('../utils');

const FormService = {
  name: 'form',
  dependencies: ['match-bot'],
  settings: {
    matchBotUri: null
  },
  actions: {
    async display(ctx) {
      let actor;

      if (ctx.params.id) {
        try {
          actor = await ctx.call('activitypub.actor.get', { id: ctx.params.id });
        } catch (e) {
          // Do nothing if actor is not found, the ID will be used for the creation
        }
      }

      // If no actor was found with the ID, try to find it with the email address
      if (!actor && ctx.params.email) {
        actor = await this.findActorByEmail(ctx.params.email);
      }

      // If no actor was found, fill default values
      if (!actor) {
        actor = {
          'pair:e-mail': ctx.params.email,
          'semapps:mailFrequency': 'weekly'
        };
      }

      if (!actor.location || !actor.location.radius) {
        actor.location = { radius: '25000' };
      }

      ctx.meta.$responseType = 'text/html';
      return this.formTemplate({
        title: 'Suivez les projets de la Fabrique',
        themes: [
          'Agriculture & alimentation',
          'Économie locale',
          'Démocratie',
          'Arts & culture',
          'Éducation',
          'Habitat & oasis',
          'Énergie',
          'Transport',
          'Bien-être',
          'Autre'
        ],
        id: actor.id || ctx.params.id,
        actor,
        message: ctx.params.message
      });
    },
    async process(ctx) {
      if (ctx.params.unsubscribe) {
        await ctx.call('activitypub.actor.remove', { id: ctx.params.id });
        return this.redirectToForm(ctx, 'deleted');
      } else {
        let actor;

        if (ctx.params.id) {
          try {
            actor = await ctx.call('activitypub.actor.get', { id: ctx.params.id });
          } catch (e) {
            // Do nothing if actor is not found, the ID will be used for the creation
          }
        }

        // Make sure email is not already used by another account
        const actorByEmail = await this.findActorByEmail(ctx.params.email);
        if ((!actor && actorByEmail) || (actor && actorByEmail && actor.id !== actorByEmail.id)) {
          return this.redirectToForm(ctx, 'email-exist', actorByEmail.id);
        }

        if (!ctx.params.themes) {
          return this.redirectToForm(ctx, 'missing-themes', ctx.params.id);
        }

        let themes = [];
        ctx.params.themes.forEach(themeLabel => {
          themes.push(this.getThemesUrisFromLabel(themeLabel));
        });

        let actorData = {
          'pair:e-mail': ctx.params.email,
          'pair:hasInterest': themes,
          'semapps:mailFrequency': ctx.params.frequency
        };

        if (ctx.params.location === 'close-to-me') {
          if (ctx.params['address-result']) {
            const address = JSON.parse(ctx.params['address-result']);
            actorData.location = {
              type: OBJECT_TYPES.PLACE,
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
            // TODO find a way to remove location completely
            actorData.location = {
              type: OBJECT_TYPES.PLACE
            };
          }
        }

        if (actor) {
          actor = await ctx.call('activitypub.actor.update', {
            '@id': ctx.params.id,
            ...actorData
          });

          return this.redirectToForm(ctx, 'updated', actor.id);
        } else {
          actor = await ctx.call('activitypub.actor.create', {
            slug: ctx.params.id,
            type: 'Person',
            published: new Date().toISOString(),
            ...actorData
          });

          await ctx.call('activitypub.outbox.post', {
            collectionUri: actor.outbox,
            '@context': 'https://www.w3.org/ns/activitystreams',
            actor: actor.id,
            type: ACTIVITY_TYPES.FOLLOW,
            object: this.settings.matchBotUri,
            to: [this.settings.matchBotUri, urlJoin(actor.id, 'followers'), PUBLIC_URI]
          });

          // Do not wait for mail to be sent
          ctx.call('mailer.sendConfirmationMail', { actor });

          return this.redirectToForm(ctx, 'created', actor.id);
        }
      }
    }
  },
  async started() {
    this.settings.matchBotUri = await this.broker.call('match-bot.getUri');

    const templateFile = await fs.readFile(__dirname + '/../templates/form.html');

    Handlebars.registerHelper('ifInActorThemes', (elem, returnValue, options) => {
      const themes = this.getThemesUrisFromLabel(elem);
      if (options.data.root.actor && options.data.root.actor['pair:hasInterest']) {
        const interests = defaultToArray(options.data.root.actor['pair:hasInterest']);
        if (interests.some(interest => themes.includes(interest))) return returnValue;
      }
    });

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
    redirectToForm(ctx, message, id) {
      ctx.meta.$statusCode = 302;
      if (id) {
        ctx.meta.$location = `/?id=${encodeURI(id)}&message=${encodeURI(message)}`;
      } else {
        ctx.meta.$location = `/?message=${encodeURI(message)}`;
      }
    },
    async findActorByEmail(email) {
      try {
        const result = await this.broker.call('activitypub.actor.find', { query: { 'pair:e-mail': email } });
        if (result['ldp:contains'] && result['ldp:contains'].length > 0) {
          return result['ldp:contains'][0];
        }
      } catch (e) {
        // Do nothing if actor is not found
      }
    },
    getThemesUrisFromLabel(label) {
      return (
        label &&
        label.split('&').map(themeLabel => urlJoin(CONFIG.THEMES_CONTAINER, slugify(themeLabel, { lower: true })))
      );
    }
  }
};

module.exports = FormService;
