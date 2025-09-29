import path from 'path';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import ApiGatewayService, { Errors as E } from 'moleculer-web';
import { ActivityPubService, FULL_ACTOR_TYPES } from '@semapps/activitypub';
import { JsonLdService } from '@semapps/jsonld';
import { LdpService, DocumentTaggerMixin } from '@semapps/ldp';
import { OntologiesService } from '@semapps/ontologies';
import { SparqlEndpointService } from '@semapps/sparql-endpoint';
import { TripleStoreService } from '@semapps/triplestore';
import { VoidService } from '@semapps/void';
import { WebAclService } from '@semapps/webacl';
import { WebfingerService } from '@semapps/webfinger';
import { KeysService, SignatureService } from '@semapps/crypto';
import { WebIdService } from '@semapps/webid';
import { ServiceSchema } from 'moleculer';
import { CoreServiceSettings } from './serviceTypes.js';

const botsContainer = {
  path: '/as/application',
  acceptedTypes: [FULL_ACTOR_TYPES.APPLICATION],
  readOnly: true
};

const CoreService = {
  name: 'core' as const,
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
    void: {},
    webacl: {},
    webfinger: {},
    webid: {}
  },
  created() {
    const { baseUrl, baseDir, triplestore, containers, ontologies } = this.settings;

    if (this.settings.activitypub !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "activitypub";... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2345): Argument of type '{ mixins: (ServiceSchema<Service... Remove this comment to see the full error message
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
            this.routes.sort((a: any) => (a.opts.catchAll ? 1 : -1));
            this.aliases.sort((a: any) => (a.route.opts.catchAll ? 1 : -1));
          }
        }
      });
    }

    if (this.settings.jsonld !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "jsonld"; sett... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2345): Argument of type '{ mixins: ({ name: "ldp"; settin... Remove this comment to see the full error message
      this.broker.createService({
        mixins: this.settings.ldp.documentTagger !== false ? [DocumentTaggerMixin, LdpService] : [LdpService],
        settings: {
          baseUrl,
          containers: containers || [botsContainer],
          ...this.settings.ldp
        }
      });
    }

    if (this.settings.signature !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: any[]; settings: any; ... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [SignatureService],
        settings: {
          ...this.settings.signature
        }
      });
    }

    if (this.settings.webId !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "webid"; mixin... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [WebIdService],
        settings: {
          baseUrl,
          ...this.settings.webid
        }
      });
    }

    if (this.settings.keys !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: any[]; settings: any; ... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [KeysService],
        settings: {
          actorsKeyPairsDir: path.resolve(baseDir, './actors'),
          ...this.settings.keys
        }
      });
    }

    if (this.settings.sparqlEndpoint !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "sparqlEndpoin... Remove this comment to see the full error message
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
      const secure = this.settings.triplestore?.secure !== false && this.settings.webacl !== false;

      // @ts-expect-error TS(2322): Type '{ name: "triplestore"; settings: { url: null... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "void"; settin... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [VoidService],
        settings: {
          baseUrl,
          ...this.settings.void
        }
      });
    }

    if (this.settings.webacl !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "webacl"; sett... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [WebAclService],
        settings: {
          baseUrl,
          ...this.settings.webacl
        }
      });
    }

    if (this.settings.webfinger !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "webfinger"; s... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [WebfingerService],
        settings: {
          baseUrl,
          ...this.settings.webfinger
        }
      });
    }
  }
} satisfies ServiceSchema<CoreServiceSettings>;

export default CoreService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [CoreService.name]: typeof CoreService;
    }
  }
}
