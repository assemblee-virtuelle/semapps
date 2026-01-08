import rdf from '@rdfjs/data-model';
import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
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

describe('Permissions check on a specific resource', () => {
  let containerUri: string;
  let resourceUri: string;

  test('Get/patch/put/delete resource without permission', async () => {
    containerUri = await alice.getContainerUri('as:Video');

    // When posting as system, no permissions are given on the resource
    resourceUri = await alice.call('ldp.container.post', {
      containerUri,
      resource: {
        type: 'Event',
        name: 'My event #1'
      },
      webId: 'system'
    });

    await expect(
      alice.call('ldp.resource.get', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).rejects.toThrow('Forbidden');

    await expect(
      alice.call('ldp.resource.patch', {
        resourceUri,
        triplesToAdd: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: BOB_WEBID
      })
    ).rejects.toThrow('Forbidden');

    await expect(
      alice.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1 - edited'
        },
        webId: BOB_WEBID
      })
    ).rejects.toThrow('Forbidden');

    await expect(
      alice.call('ldp.resource.delete', {
        resourceUri,
        webId: BOB_WEBID
      })
    ).rejects.toThrow('Forbidden');
  });

  test('Give Bob read permission on resource', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: BOB_WEBID, read: true }
      },
      webId: 'system'
    });

    await expect(alice.call('ldp.resource.get', { resourceUri, webId: BOB_WEBID })).resolves.toBeDefined();

    await expect(alice.call('ldp.container.get', { containerUri, webId: 'anon' })).rejects.toThrow('Forbidden');
  });

  test('Give Alice read permission on container', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri: containerUri,
      additionalRights: {
        user: { uri: BOB_WEBID, read: true }
      },
      webId: 'system'
    });

    await expect(alice.call('ldp.container.get', { containerUri })).resolves.toMatchObject({
      id: containerUri,
      type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
      'ldp:contains': expect.arrayContaining([
        expect.objectContaining({
          id: resourceUri
        })
      ])
    });
  });

  test('Give Craig default read permission on container', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri: containerUri,
      additionalRights: {
        default: {
          user: { uri: CRAIG_WEBID, read: true }
        }
      },
      webId: 'system'
    });

    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      await expect(
        alice.call('ldp.resource.get', {
          resourceUri,
          webId: CRAIG_WEBID
        })
      ).resolves.toBeDefined();
    });
  });

  test('Post data without append permission on container', async () => {
    await expect(
      alice.call('ldp.container.post', {
        containerUri,
        resource: {
          type: 'Event',
          name: 'My event #2'
        },
        webId: BOB_WEBID
      })
    ).rejects.toThrow();
  });

  test('Give Alice append permission on container', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri: containerUri,
      additionalRights: {
        user: { uri: BOB_WEBID, append: true }
      },
      webId: 'system'
    });

    await expect(
      alice.call('ldp.container.post', {
        containerUri,
        resource: {
          type: 'Event',
          name: 'My event #2'
        },
        webId: BOB_WEBID
      })
    ).resolves.toBeDefined();
  });

  test('Give Alice append permission on resource', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: BOB_WEBID, append: true }
      },
      webId: 'system'
    });

    await expect(
      alice.call('ldp.resource.patch', {
        resourceUri,
        triplesToAdd: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: BOB_WEBID
      })
    ).resolves.toBeDefined();

    await expect(
      alice.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1',
          content: 'Welcome everybody',
          startTime: '2014-12-31T23:00:00-08:00'
        },
        webId: BOB_WEBID
      })
    ).resolves.toBeDefined();

    // We cannot remove content with acl:Append permission
    await expect(
      alice.call('ldp.resource.patch', {
        resourceUri,
        triplesToRemove: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: BOB_WEBID
      })
    ).rejects.toThrow();

    // We cannot remove content with acl:Append permission
    await expect(
      alice.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1 - edited'
        },
        webId: BOB_WEBID
      })
    ).rejects.toThrow();
  });

  test('Give Alice write permission on resource', async () => {
    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: BOB_WEBID, write: true }
      },
      webId: 'system'
    });

    await expect(
      alice.call('ldp.resource.patch', {
        resourceUri,
        triplesToRemove: [
          rdf.quad(
            rdf.namedNode(resourceUri),
            rdf.namedNode('https://www.w3.org/ns/activitystreams#content'),
            rdf.literal('Welcome everybody')
          )
        ],
        webId: BOB_WEBID
      })
    ).resolves.toBeDefined();

    await expect(
      alice.call('ldp.resource.put', {
        resource: {
          id: resourceUri,
          type: 'Event',
          name: 'My event #1 - edited'
        },
        webId: BOB_WEBID
      })
    ).resolves.toBeDefined();
  });

  test('Give Bob control permission on resource', async () => {
    await expect(
      alice.call('webacl.resource.addRights', {
        resourceUri,
        additionalRights: {
          user: { uri: CRAIG_WEBID, write: true }
        },
        webId: BOB_WEBID
      })
    ).rejects.toThrow();

    await alice.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: { uri: BOB_WEBID, control: true }
      }
    });

    await expect(
      alice.call('webacl.resource.addRights', {
        resourceUri,
        additionalRights: {
          user: { uri: CRAIG_WEBID, write: true }
        },
        webId: BOB_WEBID
      })
    ).resolves.toBeDefined();
  });
});
