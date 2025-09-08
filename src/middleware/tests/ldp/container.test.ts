import waitForExpect from 'wait-for-expect';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('LDP container tests', () => {
  let resourceUri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure container created in LdpService settings exists', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}resources` })).resolves.toBe(
      true
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Create a new container', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}objects` })).resolves.toBe(
      false
    );

    await broker.call('ldp.container.create', { containerUri: `${CONFIG.HOME_URL}objects`, webId: 'system' });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}objects` })).resolves.toBe(true);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}objects`
      })
    ).resolves.toMatchObject({
      '@id': `${CONFIG.HOME_URL}objects`,
      '@type': ['ldp:Container', 'ldp:BasicContainer']
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Create a sub-container and attach it to the root container', async () => {
    await broker.call('ldp.container.createAndAttach', {
      containerUri: `${CONFIG.HOME_URL}parent/child`,
      webId: 'system'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}parent` })
    ).resolves.toBeTruthy();

    // Intermediate containers have no permissions
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.container.get', { containerUri: `${CONFIG.HOME_URL}parent` })).rejects.toThrow();

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.exist', { containerUri: `${CONFIG.HOME_URL}parent/child` })
    ).resolves.toBeTruthy();

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}`,
        webId: 'system'
      })
    ).resolves.toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      'ldp:contains': expect.arrayContaining([
        {
          '@id': `${CONFIG.HOME_URL}parent`,
          '@type': ['ldp:Container', 'ldp:BasicContainer', 'ldp:Resource']
        }
      ])
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}parent`,
        webId: 'system'
      })
    ).resolves.toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      'ldp:contains': expect.arrayContaining([
        {
          '@id': `${CONFIG.HOME_URL}parent/child`,
          '@type': ['ldp:Container', 'ldp:BasicContainer', 'ldp:Resource']
        }
      ])
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post a resource in a container', async () => {
    resourceUri = await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project'
      }
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`
      })
    ).resolves.toMatchObject({
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post a resource in a non-existing container', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.post', {
        containerUri: `${CONFIG.HOME_URL}unknownContainer`,
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Attach a resource to a non-existing container', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.attach', {
        containerUri: `${CONFIG.HOME_URL}unknownContainer`,
        resourceUri
      })
    ).rejects.toThrow('Cannot attach to a non-existing container');
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container with jsonContext param', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container with filters param', async () => {
    await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'My project 2'
      }
    });

    // Get without filters param
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`
      })
    ).resolves.toMatchObject({
      '@id': `${CONFIG.HOME_URL}resources`,
      '@type': ['ldp:Container', 'ldp:BasicContainer'],
      'ldp:contains': [
        {
          'pair:label': 'My project'
        },
        {
          'pair:label': 'My project 2'
        }
      ]
    });

    // Get with filters param
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`,
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container without resources', async () => {
    const container = await broker.call('ldp.container.get', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      doNotIncludeResources: true
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(container['ldp:contained']).toBeUndefined();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Detach a resource from a container', async () => {
    await broker.call('ldp.container.detach', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      resourceUri
    });

    // Project 1 should have disappeared from the container
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.container.get', {
        containerUri: `${CONFIG.HOME_URL}resources`
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Clear container', async () => {
    await broker.call('ldp.container.clear', {
      containerUri: `${CONFIG.HOME_URL}resources`
    });

    // Container should now be empty
    await waitForExpect(async () => {
      const container = await broker.call('ldp.container.get', { containerUri: `${CONFIG.HOME_URL}resources` });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(container['ldp:contains']).toHaveLength(0);
    });
  });
});
