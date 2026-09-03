import path from 'path';
import { ServiceBroker } from 'moleculer';
import ApiGatewayService from 'moleculer-web';
import { CoreService } from '@semapps/core';
import { as, pair, petr, semapps, solid, vcard } from '@semapps/ontologies';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import {
  NotificationsProviderService,
  NotificationsListenerService,
  EndpointService,
  WebSocketMixin
} from '@semapps/solid';
import { AuthLocalService } from '@semapps/auth';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ProxyService, SignatureService } from '@semapps/crypto';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { listDatasets, dropDataset, clearQueue } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initialize = async (allowSlugs = true): Promise<ServiceBroker> => {
  const datasets: string[] = await listDatasets();
  for (let dataset of datasets) {
    await dropDataset(dataset);
  }

  const queueServiceUrl = 'redis://localhost:6379/0';

  await clearQueue(queueServiceUrl);

  const broker = new ServiceBroker({
    // @ts-expect-error TS(2322): Type '{ name: string; created(broker: any): void; ... Remove this comment to see the full error message
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  broker.createService({
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
    mixins: [CoreService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      containers: [
        {
          name: 'events',
          types: ['Event']
        },
        {
          name: 'notes',
          types: ['Note']
        }
      ],
      ontologies: [as, pair, petr, solid, vcard, semapps],
      activitypub: true,
      api: false, // We create manually the service below so that we can include the WebSocketMixin
      webfinger: false,
      webid: false,
      ldp: {
        allowSlugs
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [ApiGatewayService, WebSocketMixin],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      port: 3000
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

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [ProxyService]
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [SignatureService]
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      podProvider: true,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  // @ts-expect-error TS(2322): Type '{ name: "solid-notifications.provider"; sett... Remove this comment to see the full error message
  broker.createService({
    mixins: [NotificationsProviderService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      settingsDataset: CONFIG.SETTINGS_DATASET,
      queueServiceUrl
    }
  });

  // @ts-expect-error TS(2322): Type '{ name: "solid-notifications.provider"; sett... Remove this comment to see the full error message
  broker.createService({
    mixins: [NotificationsListenerService],
    adapter: new TripleStoreAdapter({ type: 'WebhookChannelListener', dataset: CONFIG.SETTINGS_DATASET }),
    settings: {
      baseUrl: CONFIG.HOME_URL
    }
  });

  // @ts-expect-error TS(2322): Type '{ name: "solid-endpoint"; mixins: { settings... Remove this comment to see the full error message
  broker.createService({
    mixins: [EndpointService],
    settings: {
      baseUrl: CONFIG.HOME_URL,
      settingsDataset: CONFIG.SETTINGS_DATASET
    }
  });

  return broker;
};

export default initialize;
