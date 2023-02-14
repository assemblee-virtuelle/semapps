const MirrorResourceService = require('./services/resource');
const MirrorServerService = require('./services/server');

module.exports = {
  name: 'mirror',
  settings: {
    baseUrl: null,
    ontologies: [],
    podProvider: false,
    graphName: 'http://semapps.org/mirror',
    serversToFollow: [],
    acceptFollowers: false
  },
  dependencies: ['api'],
  async created() {
    const { baseUrl, ontologies, podProvider, graphName, serversToFollow, acceptFollowers } = this.settings;

    await this.broker.createService(MirrorResourceService, {
      settings: {
        baseUrl,
        ontologies,
        podProvider,
        graphName
      }
    });

    if (acceptFollowers || serversToFollow.length > 0) {
      await this.broker.createService(MirrorServerService, {
        settings: {
          baseUrl,
          graphName,
          serversToFollow,
        }
      });
    }
  }
};
