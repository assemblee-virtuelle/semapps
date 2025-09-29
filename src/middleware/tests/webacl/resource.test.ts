import rdf from '@rdfjs/data-model';
import waitForExpect from 'wait-for-expect';
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

describe('Permissions check on a specific resource', () => {
  const containerUri = `${CONFIG.HOME_URL}resources2`; // Container with no default permissions
  let resourceUri: any;

  test('Get/patch/put/delete resource without permission', async () => {
    // When posting as system, no permissions are given on the resource
    resourceUri = await broker.call('ldp.container.post', {
      containerUri,
      resource: {
        type: 'Event',
        name: 'My event #1'
      },
      webId: 'system'
    });

    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        webId: ALICE_WEBID
      })
    ).rejects.toThrow('Forbidden');

    await expect(
      broker.call('ldp.resource.patch', {
        resourceUri,
        triplesToAdd: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: ALICE_WEBID
      })
    ).rejects.toThrow('Forbidden');

    await expect(
      broker.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1 - edited'
        },
        webId: ALICE_WEBID
      })
    ).rejects.toThrow('Forbidden');

    await expect(
      broker.call('ldp.resource.delete', {
        resourceUri,
        webId: ALICE_WEBID
      })
    ).rejects.toThrow('Forbidden');
  });

  test('Give Alice read permission on resource', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: ALICE_WEBID, read: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();

    await expect(
      broker.call('ldp.container.get', {
        containerUri,
        webId: ALICE_WEBID
      })
    ).rejects.toThrow('Forbidden');
  });

  test('Give Alice read permission on container', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri: containerUri,
      additionalRights: {
        user: { uri: ALICE_WEBID, read: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('ldp.container.get', {
        containerUri,
        webId: ALICE_WEBID
      })
    ).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'ldp:contains': expect.arrayContaining([
        expect.objectContaining({
          id: resourceUri
        })
      ])
    });
  });

  test('Give Bob default read permission on container', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri: containerUri,
      additionalRights: {
        default: {
          user: { uri: BOB_WEBID, read: true }
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      await expect(
        broker.call('ldp.resource.get', {
          resourceUri,
          webId: BOB_WEBID
        })
      ).resolves.toBeDefined();
    });
  });

  test('Post data without append permission on container', async () => {
    await expect(
      broker.call('ldp.container.post', {
        containerUri,
        resource: {
          type: 'Event',
          name: 'My event #2'
        },
        webId: ALICE_WEBID
      })
    ).rejects.toThrow();
  });

  test('Give Alice append permission on container', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri: containerUri,
      additionalRights: {
        user: { uri: ALICE_WEBID, append: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('ldp.container.post', {
        containerUri,
        resource: {
          type: 'Event',
          name: 'My event #2'
        },
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();
  });

  test('Give Alice append permission on resource', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: ALICE_WEBID, append: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('ldp.resource.patch', {
        resourceUri,
        triplesToAdd: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();

    await expect(
      broker.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1',
          content: 'Welcome everybody',
          startTime: '2014-12-31T23:00:00-08:00'
        },
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();

    // We cannot remove content with acl:Append permission
    await expect(
      broker.call('ldp.resource.patch', {
        resourceUri,
        triplesToRemove: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: ALICE_WEBID
      })
    ).rejects.toThrow();

    // We cannot remove content with acl:Append permission
    await expect(
      broker.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1 - edited'
        },
        webId: ALICE_WEBID
      })
    ).rejects.toThrow();
  });

  test('Give Alice write permission on resource', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: ALICE_WEBID, write: true }
      },
      webId: 'system'
    });

    await expect(
      broker.call('ldp.resource.patch', {
        resourceUri,
        triplesToRemove: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();

    await expect(
      broker.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1 - edited'
        },
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();
  });

  test('Give Alice control permission on resource', async () => {
    await expect(
      broker.call('webacl.resource.addRights', {
        resourceUri,
        additionalRights: {
          user: { uri: BOB_WEBID, write: true }
        },
        webId: ALICE_WEBID
      })
    ).rejects.toThrow();

    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: ALICE_WEBID, control: true }
      },
      webId: 'system'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.resource.addRights', {
        resourceUri,
        additionalRights: {
          user: { uri: BOB_WEBID, write: true }
        },
        webId: ALICE_WEBID
      })
    ).resolves.toBeDefined();
  });
});
