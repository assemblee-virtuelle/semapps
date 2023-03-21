const path = require('path');
const urlJoin = require('url-join');
const ApiGatewayService = require('moleculer-web');
const { Errors: E } = require('moleculer-web');
const { ActivityPubService } = require('@semapps/activitypub');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');
const { MirrorService, botsContainer } = require('@semapps/mirror');
const { SignatureService } = require('@semapps/signature');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const { TripleStoreService } = require('@semapps/triplestore');
const { VoidService } = require('@semapps/void');
const { WebAclService } = require('@semapps/webacl');
const { WebfingerService } = require('@semapps/webfinger');
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
      mainDataset: null
    },
    // Optional
    containers: null,
    jsonContext: null,
    ontologies: null,
    // Services configurations
    activitypub: {}, // if you want the relay service to run, insert a relay:{ /* relay options*/ } inside the activitypub config.
    api: {},
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
    const defaultJsonContext = urlJoin(baseUrl, 'context.json');

    // relay service will automatically start if we want mirror and activitypub services
    if (this.settings.mirror !== false && this.settings.activitypub !== false) {
      this.settings.activitypub.relay = this.settings.activitypub.relay || {};
    }

    if (this.settings.activitypub !== false) {
      this.broker.createService(ActivityPubService, {
        settings: {
          baseUri: baseUrl,
          jsonContext: jsonContext || defaultJsonContext,
          ...this.settings.activitypub
        }
      });
    }

    if (this.settings.api !== false) {
      this.broker.createService(ApiGatewayService, {
        settings: {
          cors: {
            origin: '*',
            methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
            exposedHeaders: '*'
          },
          httpServerTimeout: 300000,
          ...this.settings.api
        },
        methods: {
          authenticate(ctx, route, req, res) {
            if (req.headers.signature) {
              return ctx.call('signature.authenticate', { route, req, res });
            } else if (req.headers.authorization) {
              return ctx.call('auth.authenticate', { route, req, res });
            } else {
              ctx.meta.webId = 'anon';
              return Promise.resolve(null);
            }
          },
          authorize(ctx, route, req, res) {
            if (req.headers.signature) {
              return ctx.call('signature.authorize', { route, req, res });
            } else if (req.headers.authorization) {
              return ctx.call('auth.authorize', { route, req, res });
            } else {
              ctx.meta.webId = 'anon';
              return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
            }
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
                  path: 'context.json',
                  file: path.resolve(__dirname, './config/context.json')
                }
              ],
          remoteContextFiles: [
            {
              uri: 'https://www.w3.org/ns/activitystreams',
              file: path.resolve(__dirname, './config/context-as.json')
            }
          ],
          ...this.settings.jsonld
        }
      });
    }

    if (this.settings.ldp !== false) {
      this.broker.createService(LdpService, {
        mixins: [DocumentTaggerMixin],
        settings: {
          baseUrl,
          ontologies: ontologies || defaultOntologies,
          containers: containers || (this.settings.mirror !== false ? [botsContainer] : []),
          ...this.settings.ldp,
          defaultContainerOptions: {
            jsonContext: jsonContext || defaultJsonContext,
            ...this.settings.ldp.defaultContainerOptions
          }
        }
      });
    }

    if (this.settings.mirror !== false && this.settings.activitypub !== false) {
      this.broker.createService(MirrorService, {
        settings: {
          baseUrl,
          ...this.settings.mirror
        }
      });
    }

    if (this.settings.signature !== false) {
      this.broker.createService(SignatureService, {
        settings: {
          actorsKeyPairsDir: path.resolve(baseDir, './actors'),
          ...this.settings.signature
        }
      });
    }

    if (this.settings.sparqlEndpoint !== false) {
      this.broker.createService(SparqlEndpointService, {
        settings: {
          defaultAccept: 'application/ld+json',
          ...this.settings.sparqlEndpoint
        }
      });
    }

    if (this.settings.triplestore !== false) {
      // If WebACL service is disabled, don't create a secure dataset
      // We define a constant here, because this.settings.webacl is not available inside the started method
      const secure = this.settings.webacl !== false;

      this.broker.createService(TripleStoreService, {
        settings: {
          url: triplestore.url,
          user: triplestore.user,
          password: triplestore.password,
          mainDataset: triplestore.mainDataset,
          ...this.settings.triplestore
        },
        async started() {
          if (triplestore.mainDataset) {
            await this.broker.call('triplestore.dataset.create', {
              dataset: triplestore.mainDataset,
              secure
            });
          }
        }
      });
    }

    if (this.settings.void !== false) {
      this.broker.createService(VoidService, {
        settings: {
          baseUrl,
          ontologies: ontologies || defaultOntologies,
          ...this.settings.void
        }
      });
    }

    if (this.settings.webacl !== false) {
      this.broker.createService(WebAclService, {
        settings: {
          baseUrl,
          ...this.settings.webacl
        }
      });
    }

    if (this.settings.webfinger !== false) {
      this.broker.createService(WebfingerService, {
        settings: {
          baseUrl,
          ...this.settings.webfinger
        }
      });
    }
  }
};

module.exports = CoreService;
