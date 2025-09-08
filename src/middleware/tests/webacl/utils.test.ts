// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
const ALICE_WEBID = 'http://localhost:3000/alice';
const BOB_WEBID = 'http://localhost:3000/bob';
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Test various actions of the webacl.resource service', () => {
  const containerUri = `${CONFIG.HOME_URL}resources2`; // Container with no default permissions
  let resourceUri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rights['@graph']).toHaveLength(3);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rights).toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      '@graph': expect.arrayContaining([
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
          '@id': '#Read',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': ALICE_WEBID,
          'acl:agentClass': 'foaf:Agent',
          'acl:mode': 'acl:Read'
        }),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
          '@id': '#Write',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': ALICE_WEBID,
          'acl:mode': 'acl:Write'
        }),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Anonymous user cannot see Alice rights', async () => {
    const rights = await broker.call('webacl.resource.getRights', { resourceUri });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rights['@graph']).toHaveLength(1);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rights).toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      '@graph': expect.arrayContaining([
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Bob can see his rights but not Alice rights', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: BOB_WEBID, read: true, write: true }
      },
      webId: 'system'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rights['@graph']).toHaveLength(2);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rights).toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      '@graph': expect.arrayContaining([
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
          '@id': '#Read',
          '@type': 'acl:Authorization',
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID,
          'acl:agentClass': 'foaf:Agent',
          'acl:mode': 'acl:Read'
        }),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Resource is public according to isPublic action', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.resource.isPublic', {
        resourceUri
      })
    ).resolves.toBeTruthy();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Alice and Bob is returned by getUsersWithReadRights action', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.resource.getUsersWithReadRights', {
        resourceUri
      })
    ).resolves.toContain(ALICE_WEBID, BOB_WEBID);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Remove write permission for Bob', async () => {
    await broker.call('webacl.resource.removeRights', {
      resourceUri,
      rights: {
        user: { uri: BOB_WEBID, write: true }
      },
      webId: ALICE_WEBID // Alice has acl:Control permission
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Remove all permissions for Alice', async () => {
    await broker.call('webacl.resource.deleteAllUserRights', {
      webId: ALICE_WEBID
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
