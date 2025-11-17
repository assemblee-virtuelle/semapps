import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import { getAclUriFromResourceUri } from '@semapps/webacl';
import initialize from './initialize.ts';
import { createAccount } from '../utils.ts';

jest.setTimeout(20000);

const BOB_WEBID = 'http://localhost:3000/bob';
const CRAIG_WEBID = 'http://localhost:3000/craig';
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize();
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('Test various actions of the webacl.resource service', () => {
  let containerUri: string;
  let resourceUri: string;

  test('Bob see his rights correctly', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      // Container with no default permissions
      containerUri = await alice.call('ldp.registry.getUri', { type: 'as:Video', isContainer: true });
      expect(containerUri).not.toBeUndefined();
    });

    resourceUri = await alice.call('ldp.container.post', {
      containerUri,
      resource: {
        type: 'Event',
        name: 'My event #1'
      }
    });

    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        anon: { read: true },
        user: { uri: BOB_WEBID, read: true, write: true }
      },
      webId: 'system'
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).resolves.toMatchObject({
      read: true,
      append: false, // Even if we have given acl:Write permission, acl:Append is not given
      write: true,
      control: false
    });

    const rights = await alice.call('webacl.resource.getRights', { resourceUri, webId: BOB_WEBID });
    const baseUrl = rights['@context']['@base'];

    expect(rights['@graph']).toHaveLength(2);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Read`,
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID,
          'acl:agentClass': 'foaf:Agent',
          'acl:mode': 'acl:Read'
        }),
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Write`,
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID,
          'acl:mode': 'acl:Write'
        })
      ])
    });
  });

  test('With control right, Bob also see Alice rights', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        anon: { read: true },
        user: { uri: BOB_WEBID, control: true }
      },
      webId: 'system'
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).resolves.toMatchObject({
      read: true,
      append: false,
      write: true,
      control: true
    });

    const rights = await alice.call('webacl.resource.getRights', { resourceUri, webId: BOB_WEBID });
    const baseUrl = rights['@context']['@base'];

    expect(rights['@graph']).toHaveLength(6);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Read`,
          'acl:mode': 'acl:Read',
          'acl:accessTo': resourceUri,
          'acl:agent': expect.arrayContaining([BOB_WEBID, alice.webId]),
          'acl:agentClass': 'foaf:Agent'
        }),
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Write`,
          'acl:mode': 'acl:Write',
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID
        }),
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Control`,
          'acl:mode': 'acl:Control',
          'acl:accessTo': resourceUri,
          'acl:agent': BOB_WEBID
        })
      ])
    });
  });

  test('Anonymous user cannot see Bob rights', async () => {
    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        webId: 'anon'
      })
    ).resolves.toMatchObject({
      read: true,
      append: false,
      write: false,
      control: false
    });

    const rights = await alice.call('webacl.resource.getRights', { resourceUri, webId: 'anon' });
    const baseUrl = rights['@context']['@base'];

    expect(rights['@graph']).toHaveLength(1);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Read`,
          'acl:mode': 'acl:Read',
          'acl:accessTo': resourceUri,
          'acl:agentClass': 'foaf:Agent'
        })
      ])
    });
  });

  test('Craig can see his rights but not Bob rights', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: CRAIG_WEBID, read: true, write: true }
      },
      webId: 'system'
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        webId: CRAIG_WEBID
      })
    ).resolves.toMatchObject({
      read: true,
      append: false, // Even if we have given acl:Write permission, acl:Append is not given
      write: true,
      control: false
    });

    const rights = await alice.call('webacl.resource.getRights', { resourceUri, webId: CRAIG_WEBID });
    const baseUrl = rights['@context']['@base'];

    expect(rights['@graph']).toHaveLength(2);

    expect(rights).toMatchObject({
      '@graph': expect.arrayContaining([
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Read`,
          'acl:mode': 'acl:Read',
          'acl:accessTo': resourceUri,
          'acl:agent': CRAIG_WEBID,
          'acl:agentClass': 'foaf:Agent'
        }),
        expect.objectContaining({
          '@type': 'acl:Authorization',
          '@id': `${baseUrl}#Write`,
          'acl:mode': 'acl:Write',
          'acl:accessTo': resourceUri,
          'acl:agent': CRAIG_WEBID
        })
      ])
    });
  });

  test('Resource is public according to isPublic action', async () => {
    await expect(
      alice.call('webacl.resource.isPublic', {
        resourceUri
      })
    ).resolves.toBeTruthy();
  });

  test('Bob and Craig is returned by getUsersWithReadRights action', async () => {
    await expect(
      alice.call('webacl.resource.getUsersWithReadRights', {
        resourceUri
      })
    ).resolves.toEqual(expect.arrayContaining([BOB_WEBID, CRAIG_WEBID, alice.webId]));
  });

  test('Remove write permission for Craig', async () => {
    await alice.call('webacl.resource.removeRights', {
      resourceUri,
      rights: {
        user: { uri: CRAIG_WEBID, write: true }
      },
      webId: BOB_WEBID // Bob has acl:Control permission
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        webId: CRAIG_WEBID
      })
    ).resolves.toMatchObject({
      read: true, // Craig still has acl:Read permission
      append: false,
      write: false,
      control: false
    });
  });

  test('Remove all permissions for Bob', async () => {
    await alice.call('webacl.resource.deleteAllUserRights', {
      webId: BOB_WEBID
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).resolves.toMatchObject({
      read: true, // There still is anonymous acl:Read right
      append: false,
      write: false,
      control: false
    });
  });

  test('Remove all permissions for resource', async () => {
    await alice.call('webacl.resource.deleteAllRights', {
      resourceUri
    });

    await expect(
      alice.call('webacl.resource.hasRights', {
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
