const path = require('path');
const urlJoin = require('url-join');
const ApiGatewayService = require('moleculer-web');
const { ActivityPubService } = require('@semapps/activitypub');
const { DatasetService } = require('@semapps/dataset');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');
const { SignatureService } = require('@semapps/signature');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const { TripleStoreService } = require('@semapps/triplestore');
const { WebAclService } = require('@semapps/webacl');
const { WebfingerService } = require('@semapps/webfinger');
const defaultContainers = require('./config/containers.json');
const defaultOntologies = require('./config/ontologies.json');

const CoreService = {
  name: 'core',
  settings: {
    baseUrl: null,
    baseDir: null,
    triplestore: {
      url: null,
      user: null,
      password: null,
      dataset: null,
    },
    // Optional
    containers: null,
    jsonContext: null,
    ontologies: null,
    // Services configurations
    activitypub: {},
    api: {},
    dataset: {},
    jsonld: {},
    ldp: {},
    mirror: {},
    signature: {},
    sparqlEndpoint: {},
    void: {},
    webacl: {},
    webfinger: {}
  },
  created() {
    let { baseUrl, baseDir, triplestore, containers, jsonContext, ontologies } = this.settings;

    // If an external JSON context is not provided, we will use a local one
    const defaultJsonContext = urlJoin(baseUrl, '_system', 'context.json');

    if (this.settings.activitypub !== false) {
      this.broker.createService(ActivityPubService, {
        settings: {
          baseUri: baseUrl,
          jsonContext: jsonContext || defaultJsonContext,
          ...this.settings.activitypub,
        },
      });
    }

    if (this.settings.api !== false) {
      this.broker.createService(ApiGatewayService, {
        settings: {
          cors: {
            origin: '*',
            methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
            exposedHeaders: '*',
          },
          httpServerTimeout: 300000,
          ...this.settings.api,
        },
        methods: {
          authenticate(ctx, route, req, res) {
            if (req.headers.signature) {
              return ctx.call('signature.authenticate', {route, req, res});
            } else {
              return ctx.call('auth.authenticate', {route, req, res});
            }
          },
          authorize(ctx, route, req, res) {
            if (req.headers.signature) {
              return ctx.call('signature.authorize', {route, req, res});
            } else {
              return ctx.call('auth.authorize', {route, req, res});
            }
          },
        },
      });
    }

    if (this.settings.dataset !== false && this.settings.triplestore !== false) {
      this.broker.createService(DatasetService, {
        settings: {
          url: triplestore.url,
          user: triplestore.user,
          password: triplestore.password,
          ...this.settings.dataset,
        },
        async started() {
          if (triplestore.dataset) {
            await this.actions.createDataset({
              dataset: triplestore.dataset,
              secure: this.settings.webacl !== false // If WebACL service is disabled, don't create a secure dataset
            });
          }
        }
      });
    }

    if (this.settings.jsonld !== false) {
      this.broker.createService(JsonLdService, {
        settings: {
          baseUri: baseUrl,
          localContextFiles: jsonContext
            ? undefined
            : [
              {
                path: '_system/context.json',
                file: path.resolve(__dirname, './config/context.json'),
              },
            ],
          remoteContextFiles: [
            {
              uri: 'https://www.w3.org/ns/activitystreams',
              file: path.resolve(__dirname, './config/context-as.json'),
            },
          ],
          ...this.settings.jsonld,
        },
      });
    }

    if (this.settings.ldp !== false) {
      this.broker.createService(LdpService, {
        mixins: [DocumentTaggerMixin],
        settings: {
          baseUrl,
          ontologies: ontologies || defaultOntologies,
          containers: containers || defaultContainers,
          ...this.settings.ldp,
          defaultContainerOptions: {
            jsonContext: jsonContext || defaultJsonContext,
            ...this.settings.ldp.defaultContainerOptions,
          },
        },
      });
    }

    if (this.settings.signature !== false) {
      this.broker.createService(SignatureService, {
        settings: {
          actorsKeyPairsDir: path.resolve(baseDir, './actors'),
          ...this.settings.signature
        },
      });
    }

    if (this.settings.sparqlEndpoint !== false) {
      this.broker.createService(SparqlEndpointService, {
        settings: {
          defaultAccept: 'application/ld+json',
          ...this.settings.sparqlEndpoint
        },
      });
    }

    if (this.settings.triplestore !== false) {
      this.broker.createService(TripleStoreService, {
        settings: {
          sparqlEndpoint: triplestore.url,
          mainDataset: triplestore.dataset,
          jenaUser: triplestore.user,
          jenaPassword: triplestore.password,
          ...this.settings.triplestore
        },
      });
    }

    if (this.settings.webacl !== false) {
      this.broker.createService(WebAclService, {
        settings: {
          baseUrl,
          ...this.settings.webacl
        },
      });
    }

    if (this.settings.webfinger !== false) {
      this.broker.createService(WebfingerService, {
        settings: {
          baseUrl,
          ...this.settings.webfinger
        },
      });
    }
  },
};

module.exports = CoreService;
