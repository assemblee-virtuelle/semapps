const { getPrefixJSON } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const CONFIG = require('../config');
const ontologies = require('../ontologies');
const initialize = require('./initialize');

jest.setTimeout(20000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('LDP container tests', () => {
  let resourceUri;

  test('Ensure container created in LdpService settings exists', async () => {
    await expect(broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}resources` })).resolves.toBe(
      true
    );
  });

  test('Create a new container', async () => {
    await expect(broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}objects` })).resolves.toBe(
      false
    );

    await broker.call(
      'ldp.container.create',
      { containerUri: `${CONFIG.HOME_URL}objects` },
      { meta: { webId: 'system' } }
    );

    await expect(broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}objects` })).resolves.toBe(true);

    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}objects`,
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@id': `${CONFIG.HOME_URL}objects`,
      '@type': ['ldp:Container', 'ldp:BasicContainer']
    });
  });

  test('Post a resource in a container', async () => {
    resourceUri = await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      contentType: MIME_TYPES.JSON,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project'
      }
    });

    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@context': getPrefixJSON(ontologies),
      '@id': `${CONFIG.HOME_URL}resources`,
      '@type': ['ldp:Container', 'ldp:BasicContainer'],
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
    await expect(
      broker.call('ldp.container.post', {
        containerUri: `${CONFIG.HOME_URL}unknownContainer`,
        contentType: MIME_TYPES.JSON,
        resource: {
          '@context': {
            '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'Project',
          label: 'My project'
        }
      })
    ).rejects.toThrow();
  });

  test('Attach a resource to a non-existing container', async () => {
    await expect(
      broker.call('ldp.container.attach', {
        containerUri: `${CONFIG.HOME_URL}unknownContainer`,
        resourceUri
      })
    ).rejects.toThrow('Cannot attach to a non-existing container');
  });

  test('Get container with jsonContext param', async () => {
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
        accept: MIME_TYPES.JSON,
        jsonContext: {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        }
      })
    ).resolves.toMatchObject({
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      '@id': `${CONFIG.HOME_URL}resources`,
      '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
      'http://www.w3.org/ns/ldp#contains': [
        {
          '@id': resourceUri,
          '@type': 'Project',
          label: 'My project'
        }
      ]
    });
  });

  test('Get container with filters param', async () => {
    await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      contentType: MIME_TYPES.JSON,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project 2'
      }
    });

    // Get without filters param
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@id': `${CONFIG.HOME_URL}resources`,
      '@type': ['ldp:Container', 'ldp:BasicContainer'],
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        },
        {
          'pair:label': 'My project'
        }
      ]
    });

    // Get with filters param
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
        accept: MIME_TYPES.JSON,
        filters: {
          'pair:label': 'My project 2'
        }
      })
    ).resolves.toMatchObject({
      '@id': `${CONFIG.HOME_URL}resources`,
      '@type': ['ldp:Container', 'ldp:BasicContainer'],
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        }
      ]
    });
  });

  test('Detach a resource from a container', async () => {
    await broker.call('ldp.container.detach', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      resourceUri
    });

    // Project 1 should have disappeared from the container
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
        accept: MIME_TYPES.JSON
      })
    ).resolves.toMatchObject({
      '@context': getPrefixJSON(ontologies),
      '@id': `${CONFIG.HOME_URL}resources`,
      '@type': ['ldp:Container', 'ldp:BasicContainer'],
      'ldp:contains': [
        {
          'pair:label': 'My project 2'
        }
      ]
    });
  });

  test('Clear container', async () => {
    await broker.call('ldp.container.clear', {
      containerUri: `${CONFIG.HOME_URL}resources`
    });

    // Container should now be empty
    const container = await broker.call('ldp.container.get', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      accept: MIME_TYPES.JSON
    });

    expect(container['ldp:contains']).toHaveLength(0);
  });
});
