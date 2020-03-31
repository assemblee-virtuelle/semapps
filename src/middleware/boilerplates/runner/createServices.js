const ApiGatewayService = require('moleculer-web');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');

const { LdpService, TripleStoreAdapter, Routes: LdpRoutes } = require('@semapps/ldp');
const { SparqlEndpointService, Routes: SparqlEndpointRoutes } = require('@semapps/sparql-endpoint');
const FusekiAdminService = require('@semapps/fuseki-admin');
const { ActivityPubService, Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebIdService, Routes: WebIdRoutes } = require('@semapps/webid');
const { CasConnector, OidcConnector } = require('@semapps/connector');

const CONFIG = require('./config');
const ontologies = require('./ontologies');
const path = require('path');

function createServices(broker) {
  // TripleStore
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(FusekiAdminService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });

  // SOLiD
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });
  broker.createService(SparqlEndpointService, {
    settings: {}
  });
  broker.createService(WebIdService, {
    settings: {
      usersContainer: CONFIG.HOME_URL + 'users/'
    }
  });

  // ActivityPub
  broker.createService(ActivityPubService, {
    baseUri: CONFIG.HOME_URL,
    storage: {
      collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
      activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
      actors: new TripleStoreAdapter('ldp'),
      objects: new TripleStoreAdapter('ldp')
    }
  });

  // ApiGateway
  broker.createService({
    mixins: [ApiGatewayService],
    settings: {
      cors: {
        origin: '*',
        exposedHeaders: '*'
      },
      routes: [...LdpRoutes, ...SparqlEndpointRoutes, ...WebIdRoutes, ...ActivityPubRoutes],
      defaultLdpAccept: 'text/turtle'
    },
    async started() {
      const findOrCreateProfile = async profileData => {
        return await this.broker.call('webid.create', profileData);
      };

      this.connector =
        CONFIG.CONNECT_TYPE === 'OIDC'
          ? new OidcConnector({
            issuer: CONFIG.OIDC_ISSUER,
            clientId: CONFIG.OIDC_CLIENT_ID,
            clientSecret: CONFIG.OIDC_CLIENT_SECRET,
            publicKey: CONFIG.OIDC_PUBLIC_KEY,
            redirectUri: CONFIG.HOME_URL + 'auth',
            selectProfileData: authData => ({
              email: authData.email,
              name: authData.given_name,
              familyName: authData.family_name
            }),
            findOrCreateProfile
          })
          : new CasConnector({
            casUrl: CONFIG.CAS_URL,
            privateKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key'),
            publicKeyPath: path.resolve(__dirname, './jwt/jwtRS256.key.pub'),
            selectProfileData: authData => ({
              nick: authData.displayName,
              email: authData.mail[0],
              name: authData.field_first_name[0],
              familyName: authData.field_last_name[0]
            }),
            findOrCreateProfile
          });

      await this.connector.initialize();

      this.addRoute(this.connector.getRoute());
    },
    methods: {
      authenticate(ctx, route, req, res) {
        return this.connector.authenticate(ctx, route, req, res);
      },
      authorize(ctx, route, req, res) {
        return this.connector.authorize(ctx, route, req, res);
      }
    }
  });
}

module.exports = createServices;
