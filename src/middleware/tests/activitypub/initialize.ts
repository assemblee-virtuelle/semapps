// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fse from 'fs-extra';
import path from 'path';
import urlJoin from 'url-join';
import { ServiceBroker } from 'moleculer';
import { AuthLocalService } from '@semapps/auth';
import { CoreService } from '@semapps/core';
import { WebAclMiddleware, CacherMiddleware } from '@semapps/webacl';
import { FULL_OBJECT_TYPES, FULL_ACTOR_TYPES } from '@semapps/activitypub';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import { clearDataset, clearQueue } from '../utils.ts';

const containers = [
  {
    path: '/as/object',
    acceptedTypes: Object.values(FULL_OBJECT_TYPES)
  }
];

const initialize = async (port: any, mainDataset: any, accountsDataset: any, queueServiceDb = 0) => {
  const baseUrl = `http://localhost:${port}/`;
  const queueServiceUrl = `redis://localhost:6379/${queueServiceDb}`;

  await clearDataset(mainDataset);
  await clearDataset(accountsDataset);
  await clearQueue(queueServiceUrl);

  const broker = new ServiceBroker({
    nodeID: `server${port}`,
    // @ts-expect-error TS(2322): Type '{ name: "CacherMiddleware"; created(broker: ... Remove this comment to see the full error message
    middlewares: [CacherMiddleware(CONFIG.ACTIVATE_CACHE), WebAclMiddleware({ baseUrl })],
    logger: {
      type: 'Console',
      options: {
        level: 'warn'
      }
    }
  });

  // Remove all actors keys
  await fse.emptyDir(path.resolve(__dirname, './actors'));

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "core"; settin... Remove this comment to see the full error message
  broker.createService({
    mixins: [CoreService],
    settings: {
      baseUrl,
      baseDir: path.resolve(__dirname, '..'),
      triplestore: {
        url: CONFIG.SPARQL_ENDPOINT,
        user: CONFIG.JENA_USER,
        password: CONFIG.JENA_PASSWORD,
        mainDataset
      },
      containers,
      void: false,
      mirror: false,
      activitypub: {
        queueServiceUrl
      },
      api: {
        port
      },
      webid: {
        path: '/as/actor',
        acceptedTypes: Object.values(FULL_ACTOR_TYPES)
      }
    }
  });

  // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "auth"; mixins... Remove this comment to see the full error message
  broker.createService({
    mixins: [AuthLocalService],
    settings: {
      baseUrl,
      jwtPath: path.resolve(__dirname, './jwt'),
      accountsDataset,
      mail: false
    }
  });

  await broker.start();

  // setting some write permission on the containers for anonymous user, which is the one that will be used in the tests.
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/object'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/actor'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/activity'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });
  await broker.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: urlJoin(baseUrl, 'as/collection'),
    additionalRights: {
      anon: {
        write: true
      }
    }
  });

  return broker;
};

export default initialize;
