const urlJoin = require('url-join');
const { arrayOf } = require('@semapps/ldp');
const {
  parseUrl,
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  saveDatasetMeta
} = require('@semapps/middlewares');
const { FULL_ACTOR_TYPES } = require('../../../constants');

const ApiService = {
  name: 'activitypub.api',
  settings: {
    baseUri: null,
    podProvider: false
  },
  dependencies: ['api', 'ldp.registry'],
  async started() {
    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', { route: this.getBoxesRoute('/:username([^/.][^/]+)') });
    } else {
      // If some actor containers are already registered, add the corresponding API routes
      const registeredContainers = await this.broker.call('ldp.registry.list');
      for (const container of Object.values(registeredContainers)) {
        if (arrayOf(container.acceptedTypes).some(type => Object.values(FULL_ACTOR_TYPES).includes(type))) {
          await this.broker.call('api.addRoute', { route: this.getBoxesRoute(container.fullPath) });
        }
      }
    }
  },
  actions: {
    async inbox(ctx) {
      const { actorSlug, ...activity } = ctx.params;
      const { requestUrl } = ctx.meta;

      await ctx.call('activitypub.inbox.post', {
        collectionUri: urlJoin(this.settings.baseUri, requestUrl),
        ...activity
      });

      ctx.meta.$statusCode = 202;
    },
    async outbox(ctx) {
      let { actorSlug, ...activity } = ctx.params;
      const { requestUrl } = ctx.meta;

      activity = await ctx.call('activitypub.outbox.post', {
        collectionUri: urlJoin(this.settings.baseUri, requestUrl),
        ...activity
      });

      ctx.meta.$responseHeaders = {
        Location: activity.id || activity['@id'],
        'Content-Length': 0
      };
      ctx.meta.$statusCode = 201;
    }
  },
  events: {
    async 'ldp.registry.registered'(ctx) {
      // TODO ensure that no events of this kind are sent before the service start, or routes may be missing
      const { container } = ctx.params;
      if (
        !this.settings.podProvider &&
        arrayOf(container.acceptedTypes).some(type => Object.values(FULL_ACTOR_TYPES).includes(type))
      ) {
        await ctx.call('api.addRoute', { route: this.getBoxesRoute(container.fullPath) });
      }
    }
  },
  methods: {
    getBoxesRoute(actorsPath) {
      const middlewares = [
        parseUrl,
        parseHeader,
        negotiateContentType,
        negotiateAccept,
        parseSparql,
        parseJson,
        parseTurtle,
        parseFile,
        saveDatasetMeta
      ];

      return {
        name: this.settings.podProvider ? 'boxes' : `boxes${actorsPath}`,
        path: actorsPath,
        // Disable the body parsers so that we can parse the body ourselves
        // (Moleculer-web doesn't handle non-JSON bodies, so we must do it)
        bodyParsers: false,
        authorization: false,
        authentication: true,
        aliases: {
          'POST /:actorSlug/inbox': [...middlewares, 'activitypub.api.inbox'],
          'POST /:actorSlug/outbox': [...middlewares, 'activitypub.api.outbox']
        }
      };
    }
  }
};

module.exports = ApiService;
