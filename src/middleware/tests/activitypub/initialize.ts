import path from 'path';
import { ServiceBroker } from 'moleculer';
import { AuthLocalService } from '@semapps/auth';
import { solid } from '@semapps/ontologies';
import { CoreService } from '@semapps/core';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { FULL_OBJECT_TYPES } from '@semapps/activitypub';
import { fileURLToPath } from 'url';
import * as CONFIG from '../config.ts';
import { clearQueue } from '../utils.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const containers = [
  {
    path: '/as/object',
    types: Object.values(FULL_OBJECT_TYPES)
  }
];

const initialize = async (number: number) => {
  const port = 3000 + number;
  const baseUrl = `http://localhost:${port}/`;
  const queueServiceUrl = `redis://localhost:6379/${number}`;

  await clearQueue(queueServiceUrl);

  const broker = new ServiceBroker({
    nodeID: `server${number}`,
    // @ts-expect-error TS(2322): Type '{ name: string; created(broker: any): void; ... Remove this comment to see the full error message
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl })],
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
      baseUrl,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        secure: false // TODO Remove when we move to Fuseki 5
      },
      containers,
      ontologies: [solid],
      void: false,
      mirror: false,
      activitypub: {
        queueServiceUrl
      },
      ldp: {
        allowSlugs: true
      },
      api: {
        port
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, '../jwt'),
      accountsDataset: `settings${number}`,
      mail: false
    }
  });

  // // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  // await broker.call('webacl.resource.addRights', {
  //   webId: 'system',
  //   resourceUri: urlJoin(baseUrl, 'as/object'),
  //   additionalRights: {
  //     anon: {
  //       write: true
  //     }
  //   }
  // });
  // await broker.call('webacl.resource.addRights', {
  //   webId: 'system',
  //   resourceUri: urlJoin(baseUrl, 'as/actor'),
  //   additionalRights: {
  //     anon: {
  //       write: true
  //     }
  //   }
  // });
  // await broker.call('webacl.resource.addRights', {
  //   webId: 'system',
  //   resourceUri: urlJoin(baseUrl, 'as/activity'),
  //   additionalRights: {
  //     anon: {
  //       write: true
  //     }
  //   }
  // });
  // await broker.call('webacl.resource.addRights', {
  //   webId: 'system',
  //   resourceUri: urlJoin(baseUrl, 'as/collection'),
  //   additionalRights: {
  //     anon: {
  //       write: true
  //     }
  //   }
  // });

  return broker;
};

export default initialize;
