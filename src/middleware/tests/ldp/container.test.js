const { ServiceBroker } = require('moleculer');
const { LdpService, getPrefixJSON } = require('@semapps/ldp');
const { TripleStoreService } = require('@semapps/triplestore');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');
const { MIME_TYPES } = require('@semapps/mime-types');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});

beforeAll(async () => {
  await broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  await broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL,
      ontologies,
      containers: ['/resources']
    }
  });

  await broker.start();
  await broker.call('triplestore.dropAll');

  // Restart broker after dropAll, so that the default container is recreated
  await broker.start();
});

afterAll(async () => {
  await broker.stop();
});

describe('Create container and post resource', () => {
  let resourceUri;

  test('Ensure container created in LdpService settings exists', async () => {
    expect(broker.call('ldp.container.exist', { containerUri: CONFIG.HOME_URL + 'resources' })).resolves.toBe(true);
  });

  test('Create a new container', async () => {
    expect(broker.call('ldp.container.exist', { containerUri: CONFIG.HOME_URL + 'objects' })).resolves.toBe(false);

    await broker.call('ldp.container.create', { containerUri: CONFIG.HOME_URL + 'objects' });

    expect(broker.call('ldp.container.exist', { containerUri: CONFIG.HOME_URL + 'objects' })).resolves.toBe(true);

    expect(
      broker.call('ldp.container.get', {
        containerUri: CONFIG.HOME_URL + 'objects',
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@id': CONFIG.HOME_URL + 'objects',
      '@type': 'ldp:BasicContainer'
    });
  });

  test('Post a resource in a container', async () => {
    resourceUri = await broker.call('ldp.resource.post', {
      containerUri: CONFIG.HOME_URL + 'resources',
      contentType: MIME_TYPES.JSON,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project'
      }
    });

    expect(
      broker.call('ldp.container.get', {
        containerUri: CONFIG.HOME_URL + 'resources',
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@context': getPrefixJSON(ontologies),
      '@id': CONFIG.HOME_URL + 'resources',
      '@type': 'ldp:BasicContainer',
      'ldp:contains': [
        {
          '@id': resourceUri,
          '@type': 'pair:Project',
          'pair:label': 'My project'
        }
      ]
    });
  });

  test('Post a resource in a non-existing container', async () => {
    expect(
      broker.call('ldp.resource.post', {
        containerUri: CONFIG.HOME_URL + 'unknownContainer',
        contentType: MIME_TYPES.JSON,
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          label: 'My project'
        }
      })
    ).rejects.toThrow('Cannot create resource in non-existing container');
  });

  test('Attach a resource to a non-existing container', async () => {
    expect(
      broker.call('ldp.container.attach', {
        containerUri: CONFIG.HOME_URL + 'unknownContainer',
        resourceUri
      })
    ).rejects.toThrow('Cannot attach to a non-existing container');
  });

  test('Get container with jsonContext param', async () => {
    expect(
      broker.call('ldp.container.get', {
        containerUri: CONFIG.HOME_URL + 'resources',
        accept: MIME_TYPES.JSON,
        jsonContext: {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        }
      })
    ).resolves.toMatchObject({
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      '@id': CONFIG.HOME_URL + 'resources',
      '@type': 'http://www.w3.org/ns/ldp#BasicContainer',
      'http://www.w3.org/ns/ldp#contains': [
        {
          '@id': resourceUri,
          '@type': 'Project',
          label: 'My project'
        }
      ]
    });
  });

  test('Get container with query param', async () => {
    await broker.call('ldp.resource.post', {
      containerUri: CONFIG.HOME_URL + 'resources',
      contentType: MIME_TYPES.JSON,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project 2'
      }
    });

    // Get without query param
    expect(
      broker.call('ldp.container.get', {
        containerUri: CONFIG.HOME_URL + 'resources',
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@id': CONFIG.HOME_URL + 'resources',
      '@type': 'ldp:BasicContainer',
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        },
        {
          'pair:label': 'My project'
        }
      ]
    });

    // Get with query param
    expect(
      broker.call('ldp.container.get', {
        containerUri: CONFIG.HOME_URL + 'resources',
        accept: MIME_TYPES.JSON,
        query: {
          'pair:label': 'My project 2'
        }
      })
    ).resolves.toMatchObject({
      '@id': CONFIG.HOME_URL + 'resources',
      '@type': 'ldp:BasicContainer',
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        }
      ]
    });
  });
});
