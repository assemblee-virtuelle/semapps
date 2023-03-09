const validRemoteRelayAction = require('./actions/validRemoteRelay');
const mirrorAction = require('./actions/mirror');
const ListenerService = require('./subservices/listener');

module.exports = {
  name: 'mirror',
  settings: {
    baseUrl: null,
    podProvider: false,
    graphName: 'http://semapps.org/mirror',
    servers: []
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
    this.broker.createService(ListenerService, {
      podProvider: this.settings.podProvider
    });
  },
  async started() {
    this.mirroredServers = [];
    if (this.settings.servers.length > 0) {
      for (let serverUrl of this.settings.servers) {
        // Do not await because we don't want to block the startup of the services.
        this.actions.mirror({ serverUrl })
          .then(actorUri => this.mirroredServers.push(actorUri))
          .catch(e => {
            this.logger.error('Mirroring failed for ' + serverUrl + ' : ' + e.message)
          });
      }
    }
  },
  actions: {
    validRemoteRelay: validRemoteRelayAction,
    mirror: mirrorAction
  }
};
