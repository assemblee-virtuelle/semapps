const containers = require('../containers');
const delay = t => new Promise(resolve => setTimeout(resolve, t));

module.exports = {
  name: 'pod',
  settings: {
    baseUrl: null,
    containers
  },
  dependencies: ['fuseki-admin', 'ldp', 'auth.account'],
  async started() {
    await this.broker.call('ldp.addApiRoutes', {
      containers: this.settings.containers.map(config => ({ ...config, path: '/:username' + config.path })),
    });

    // Keep a list of pods in cache
    this.registeredPods = (await this.broker.call('auth.account.find')).map(account => account.username);
  },
  actions: {
    async create(ctx) {
      const { username } = ctx.params;
      if( !username ) throw new Error('Cannot create pod without a username');

      await ctx.call('fuseki-admin.createDataset', {
        dataset: username,
        secure: true
      });

      // Make sure dataset is created before continuing
      let datasetExist;
      do {
        await delay(1000);
        datasetExist = await ctx.call('fuseki-admin.datasetExist', {
          dataset: username
        });
      } while( !datasetExist );

      await ctx.call('ldp.container.createMany', {
        containers: this.settings.containers.map(config => ({ ...config, path: '/' + username + config.path })),
      });
    },
    async list(ctx) {
      return this.registeredPods;
    }
  },
  events: {
    'auth.registered'(ctx) {
      const { accountData } = ctx.params;
      this.registeredPods.push(accountData.username);
    }
  }
};
