const mirrorAction = require('./actions/mirror');
const SubscriptionService = require('./subservices/subscription');

module.exports = {
  name: 'mirror',
  settings: {
    baseUrl: null,
    graphName: 'http://semapps.org/mirror',
    servers: [],
    acceptFollowOffers: true
  },
  dependencies: [
    'triplestore',
    'webfinger',
    'activitypub',
    'activitypub.relay',
    'auth.account',
    'ldp.container',
    'ldp.registry'
  ],
  created() {
    this.broker.createService(SubscriptionService, {
      acceptFollowOffers: this.settings.acceptFollowOffers
    });
  },
  async started() {
    if (this.settings.servers.length > 0) {
      for (let serverUrl of this.settings.servers) {
        // Do not await because we don't want to block the startup of the services.
        this.actions.mirror({ serverUrl })
          .catch(e => {
            this.logger.warn('Mirroring failed for ' + serverUrl + ' : ' + e.message)
          });
      }
    }
  },
  actions: {
    mirror: mirrorAction
  }
};
