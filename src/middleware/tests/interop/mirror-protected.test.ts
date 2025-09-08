import urlJoin from 'url-join';
import waitForExpect from 'wait-for-expect';
import { ACTIVITY_TYPES } from '@semapps/activitypub';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50000);
let server1: any;
let server2: any;
const relay1 = 'http://localhost:3001/as/actor/relay';
const relay2 = 'http://localhost:3002/as/actor/relay';

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  // @ts-expect-error TS(2554): Expected 5 arguments, but got 4.
  server1 = await initialize(3001, 'testData1', 'settings1', 1);

  // Wait for Relay actor creation, or server2 won't be able to mirror server1
  await server1.call('activitypub.actor.awaitCreateComplete', {
    actorUri: relay1
  });

  server2 = await initialize(3002, 'testData2', 'settings2', 2, 'http://localhost:3001');
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (server1) await server1.stop();
  if (server2) await server2.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Resource on server1 is shared with user on server2', () => {
  let resourceUri: any;
  let user2: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Server2 follow server1', async () => {
    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        server1.call('activitypub.collection.includes', {
          collectionUri: urlJoin(relay1, 'followers'),
          itemUri: relay2
        })
      ).resolves.toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Protected resource on server1 is shared with a specific user on server2', async () => {
    const { webId } = await server2.call('auth.signup', {
      username: 'srosset81',
      email: 'sebastien@test.com',
      password: 'test',
      name: 'Sébastien'
    });

    user2 = await server2.call('activitypub.actor.awaitCreateComplete', { actorUri: webId });

    resourceUri = await server1.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Resource',
        label: 'My protected resource'
      },
      containerUri: 'http://localhost:3001/protected-resources',
      webId: 'system'
    });

    await server1.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: {
        user: {
          uri: user2.id,
          read: true
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      const outboxMenu = await server1.call('activitypub.collection.get', {
        resourceUri: `${relay1}/outbox`,
        webId: relay1
      });
      const inbox = await server1.call('activitypub.collection.get', {
        resourceUri: `${relay1}/outbox`,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: relay1
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox).not.toBeNull();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.CREATE,
        actor: relay1,
        object: resourceUri,
        bto: user2.id
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Protected resource is not shared anymore with a specific user', async () => {
    await server1.call('webacl.resource.removeRights', {
      resourceUri,
      rights: {
        user: {
          uri: user2.id,
          read: true
        }
      },
      webId: 'system'
    });

    await waitForExpect(async () => {
      const outboxMenu = await server1.call('activitypub.collection.get', {
        resourceUri: `${relay1}/outbox`,
        webId: relay1
      });
      const inbox = await server1.call('activitypub.collection.get', {
        resourceUri: `${relay1}/outbox`,
        afterEq: new URL(outboxMenu?.first).searchParams.get('afterEq'),
        webId: relay1
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox).not.toBeNull();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(inbox.orderedItems[0]).toMatchObject({
        type: ACTIVITY_TYPES.DELETE,
        actor: relay1,
        object: resourceUri,
        bto: user2.id
      });
    });
  });
});
