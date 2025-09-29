import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
const ALICE_WEBID = 'http://localhost:3000/alice';
const BOB_WEBID = 'http://localhost:3000/bob';
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('Test various actions of the webacl.resource service', () => {
  const containerUri = `${CONFIG.HOME_URL}resources2`; // Container with no default permissions
  let resourceUri: any;

  test('Alice see her rights correctly', async () => {
    resourceUri = await broker.call('ldp.container.post', {
      containerUri,
      resource: {
        type: 'Event',
        name: 'My event #1'
      },
      webId: 'system'
    });

    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        anon: { read: true },
        user: { uri: ALICE_WEBID, read: true, write: true, control: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri,
        webId: ALICE_WEBID
      })
    ).resolves.toMatchObject({
      read: true,
      append: false, // Even if we have given acl:Write permission, acl:Append is not given
      write: true,
      control: true
    });

    const rights = await broker.call('webacl.resource.getRights', { resourceUri, webId: ALICE_WEBID });

    expect(rights['@graph']).toHaveLength(3);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@id': '#Read',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': ALICE_WEBID,
          'acl:agentClass': 'foaf:Agent',
          'acl:mode': 'acl:Read'
        }),
        expect.objectContaining({
          '@id': '#Write',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': ALICE_WEBID,
          'acl:mode': 'acl:Write'
        }),
        expect.objectContaining({
          '@id': '#Control',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': ALICE_WEBID,
          'acl:mode': 'acl:Control'
        })
      ])
    });
  });

  test('Anonymous user cannot see Alice rights', async () => {
    const rights = await broker.call('webacl.resource.getRights', { resourceUri });

    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri
      })
    ).resolves.toMatchObject({
      read: true,
      append: false,
      write: false,
      control: false
    });

    expect(rights['@graph']).toHaveLength(1);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@id': '#Read',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agentClass': 'foaf:Agent',
          'acl:mode': 'acl:Read'
        })
      ])
    });
  });

  test('Bob can see his rights but not Alice rights', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: BOB_WEBID, read: true, write: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).resolves.toMatchObject({
      read: true,
      append: false, // Even if we have given acl:Write permission, acl:Append is not given
      write: true,
      control: false
    });

    const rights = await broker.call('webacl.resource.getRights', { resourceUri, webId: BOB_WEBID });

    expect(rights['@graph']).toHaveLength(2);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@id': '#Read',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID,
          'acl:agentClass': 'foaf:Agent',
          'acl:mode': 'acl:Read'
        }),
        expect.objectContaining({
          '@id': '#Write',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID,
          'acl:mode': 'acl:Write'
        })
      ])
    });
  });

  test('Resource is public according to isPublic action', async () => {
    await expect(
      broker.call('webacl.resource.isPublic', {
        resourceUri
      })
    ).resolves.toBeTruthy();
  });

  test('Alice and Bob is returned by getUsersWithReadRights action', async () => {
    await expect(
      broker.call('webacl.resource.getUsersWithReadRights', {
        resourceUri
      })
    ).resolves.toContain(ALICE_WEBID, BOB_WEBID);
  });

  test('Remove write permission for Bob', async () => {
    await broker.call('webacl.resource.removeRights', {
      resourceUri,
      rights: {
        user: { uri: BOB_WEBID, write: true }
      },
      webId: ALICE_WEBID // Alice has acl:Control permission
    });

    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).resolves.toMatchObject({
      read: true, // Bob still has acl:Read permission
      append: false,
      write: false,
      control: false
    });
  });

  test('Remove all permissions for Alice', async () => {
    await broker.call('webacl.resource.deleteAllUserRights', {
      webId: ALICE_WEBID
    });

    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri,
        webId: ALICE_WEBID
      })
    ).resolves.toMatchObject({
      read: true, // There still is anonymous acl:Read right
      append: false,
      write: false,
      control: false
    });
  });

  test('Remove all permissions for resource', async () => {
    await broker.call('webacl.resource.deleteAllRights', {
      resourceUri
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.resource.hasRights', {
        resourceUri,
        webId: 'anon'
      })
    ).resolves.toMatchObject({
      read: false,
      append: false,
      write: false,
      control: false
    });
  });
});
