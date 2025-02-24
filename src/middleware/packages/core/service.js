const path = require('path');
const ApiGatewayService = require('moleculer-web');
const { Errors: E } = require('moleculer-web');
const { ActivityPubService, FULL_ACTOR_TYPES } = require('@semapps/activitypub');
const { JsonLdService } = require('@semapps/jsonld');
const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');
const { OntologiesService } = require('@semapps/ontologies');
const { SparqlEndpointService } = require('@semapps/sparql-endpoint');
const { TripleStoreService } = require('@semapps/triplestore');
const { VoidService } = require('@semapps/void');
const { WebAclService } = require('@semapps/webacl');
const { WebfingerService } = require('@semapps/webfinger');
const { KeysService, SignatureService, DataIntegrityService } = require('@semapps/crypto');
const { WebIdService } = require('@semapps/webid');

const botsContainer = {
  path: '/as/application',
  acceptedTypes: [FULL_ACTOR_TYPES.APPLICATION],
  readOnly: true
};

/**
 * @typedef {import('./serviceTypes').CoreServiceSettings} CoreServiceSettings
 */

/** @type {import('moleculer').ServiceSchema<CoreServiceSettings>} */
const CoreService = {
  name: 'core',
  settings: {
    baseUrl: undefined,
    baseDir: undefined,
    triplestore: {
      url: undefined,
      user: undefined,
      password: undefined,
      mainDataset: undefined,
      fusekiBase: undefined
    },
    // Optional
    containers: undefined,
    ontologies: [],
    // Services configurations
    activitypub: {},
    api: {},
    jsonld: {},
    keys: {},
    ldp: {},
    signature: {},
    sparqlEndpoint: {},
    dataIntegrity: {},
    void: {},
    webacl: {},
    webfinger: {},
    webid: {}
  },
  created() {
    const { baseUrl, baseDir, triplestore, containers, ontologies } = this.settings;

    if (this.settings.activitypub !== false) {
      this.broker.createService({
        mixins: [ActivityPubService],
        // Type support for settings could be given, once moleculer type definitions improve...
        settings: {
          baseUri: baseUrl,
          ...this.settings.activitypub
        }
      });
    }

    if (this.settings.api !== false) {
      this.broker.createService({
        mixins: [ApiGatewayService],
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
            }
            if (req.headers.authorization) {
              return ctx.call('auth.authenticate', { route, req, res });
            }
            ctx.meta.webId = 'anon';
            return Promise.resolve(null);
          },
          authorize(ctx, route, req, res) {
            if (req.headers.signature) {
              return ctx.call('signature.authorize', { route, req, res });
            }
            if (req.headers.authorization) {
              return ctx.call('auth.authorize', { route, req, res });
            }
            ctx.meta.webId = 'anon';
            return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
          },
          // Overwrite optimization method to put catchAll routes at the end
          // See https://github.com/moleculerjs/moleculer-web/issues/335
          optimizeRouteOrder() {
            this.routes.sort(a => (a.opts.catchAll ? 1 : -1));
            this.aliases.sort(a => (a.route.opts.catchAll ? 1 : -1));
          }
        }
      });
    }

    if (this.settings.jsonld !== false) {
      this.broker.createService({
        mixins: [JsonLdService],
        settings: {
          baseUri: baseUrl,
          ...this.settings.jsonld
        }
      });
    }

    this.broker.createService({
      mixins: [OntologiesService],
      settings: {
        ontologies
      }
    });

    if (this.settings.ldp !== false) {
      this.broker.createService({
        mixins: [DocumentTaggerMixin, LdpService],
        settings: {
          baseUrl,
          containers: containers || (this.settings.mirror !== false ? [botsContainer] : []),
          ...this.settings.ldp
        }
      });
    }

    if (this.settings.signature !== false) {
      this.broker.createService({
        mixins: [SignatureService],
        settings: {
          ...this.settings.signature
        }
      });
    }

    if (this.settings.dataIntegrity !== false) {
      this.broker.createService({
        mixins: [DataIntegrityService],
        settings: {
          baseUri: baseUrl,
          ...this.settings.dataIntegrity
        }
      });
    }

    if (this.settings.webId !== false) {
      this.broker.createService({
        mixins: [WebIdService],
        settings: {
          baseUrl,
          ...this.settings.webid
        }
      });
    }

    if (this.settings.keys !== false) {
      this.broker.createService({
        mixins: [KeysService],
        settings: {
          actorsKeyPairsDir: path.resolve(baseDir, './actors'),
          ...this.settings.keys
        }
      });
    }

    if (this.settings.sparqlEndpoint !== false) {
      this.broker.createService({
        mixins: [SparqlEndpointService],
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

      this.broker.createService({
        mixins: [TripleStoreService],
        settings: {
          ...triplestore
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
      this.broker.createService({
        mixins: [VoidService],
        settings: {
          baseUrl,
          ...this.settings.void
        }
      });
    }

    if (this.settings.webacl !== false) {
      this.broker.createService({
        mixins: [WebAclService],
        settings: {
          baseUrl,
          ...this.settings.webacl
        }
      });
    }

    if (this.settings.webfinger !== false) {
      this.broker.createService({
        mixins: [WebfingerService],
        settings: {
          baseUrl,
          ...this.settings.webfinger
        }
      });
    }
  }
};

module.exports = CoreService;
