const urlJoin = require('url-join');
const { ACTOR_TYPES } = require('@semapps/activitypub');
const { getSlugFromUri } = require('@semapps/ldp');
const getPodsRoute = require('./routes/getPodsRoute');

module.exports = {
  name: 'pod',
  settings: {
    baseUrl: null
  },
  dependencies: ['triplestore', 'ldp', 'auth.account', 'api'],
  async started() {
    // Container with actors
    // The `podsContainer: true` config will register the container but not create LDP containers on a dataset
    await this.broker.call('ldp.registry.register', {
      name: 'pods',
      path: '/',
      podsContainer: true,
      acceptedTypes: [ACTOR_TYPES.PERSON],
      excludeFromMirror: true,
      controlledActions: {
        get: 'pod.getActor'
      }
    });

    // API routes to actors (and their collections) are added manually
    await this.broker.call('api.addRoute', { route: getPodsRoute() });

    // Root container for the POD (/:username/data/)
    await this.broker.call('ldp.registry.register', {
      path: '/',
      excludeFromMirror: true,
      permissions: {},
      newResourcesPermissions: {}
    });

    const accounts = await this.broker.call('auth.account.find');
    this.registeredPods = accounts.map(account => account.username);
  },
  actions: {
    async create(ctx) {
      const { username } = ctx.params;
      if (!username) throw new Error('Cannot create pod without a username');

      await ctx.call('triplestore.dataset.create', {
        dataset: username,
        secure: true
      });

      ctx.meta.dataset = username;

      // Create the POD root container so that the LdpRegistryService can create the default containers
      const podUri = urlJoin(this.settings.baseUrl, username, 'data');
      await ctx.call('ldp.container.create', { containerUri: podUri, webId: 'system' });

      // Attach the POD URI to the user's account
      const accounts = await ctx.call('auth.account.find', { query: { username } });

      await ctx.call('auth.account.update', {
        id: accounts[0]['@id'],
        podUri
      });

      this.registeredPods.push(username);
    },
    list() {
      return this.registeredPods;
    },
    exist(ctx) {
      let { username, webId } = ctx.params;
      if (!username) {
        if (webId) {
          username = getSlugFromUri(webId);
        } else {
          throw new Error(`No username or webId passed to pod.exist action`);
        }
      }
      return !!this.registeredPods[username];
    },
    getActor(ctx) {
      return ctx.call('ldp.resource.get', ctx.params);
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId, accountData } = ctx.params;
      const { podUri, username } = accountData;

      this.registeredPods.push(username);

      // Give full rights to user on his pod
      await ctx.call('webacl.resource.addRights', {
        resourceUri: podUri,
        additionalRights: {
          user: {
            uri: webId,
            read: true,
            write: true,
            control: true
          },
          default: {
            user: {
              uri: webId,
              read: true,
              write: true,
              control: true
            }
          }
        },
        webId: 'system'
      });

      // TODO Does not work, this is done in the webacl middleware. Good ?
      // Give public right to the webId
      // await ctx.call('webacl.resource.addRights', {
      //   resourceUri: webId,
      //   additionalRights: {
      //     anon: {
      //       read: true,
      //     },
      //     user: {
      //       uri: webId,
      //       read: true,
      //       write: true,
      //       control: true
      //     },
      //   },
      //   webId: 'system'
      // });
    }
  }
};
