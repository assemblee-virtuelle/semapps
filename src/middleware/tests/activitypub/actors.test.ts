import urlJoin from 'url-join';
import initialize from './initialize.ts';

jest.setTimeout(70000);
const NUM_USERS = 1;

describe('Actors are correctly created', () => {
  let broker: any;
  const actors: any = [];
  let alice: any;

  beforeAll(async () => {
    broker = await initialize(3000, 'testData', 'settings');

    for (let i = 1; i <= NUM_USERS; i++) {
      const { webId } = await broker.call('auth.signup', require(`./data/actor${i}.json`));
      actors[i] = await broker.call('activitypub.actor.awaitCreateComplete', { actorUri: webId });
      actors[i].call = (actionName: any, params: any, options = {}) =>
        // @ts-expect-error TS(2339): Property 'meta' does not exist on type '{}'.
        broker.call(actionName, params, { ...options, meta: { ...options.meta, webId } });
    }

    alice = actors[1];
  });

  afterAll(async () => {
    await broker.stop();
  });

  test('Actor has the required informations', async () => {
    expect(alice.type).toContain('Person');
    expect(alice.preferredUsername).toBe('alice');
    expect(alice.outbox).toBe(urlJoin(alice.id, 'outbox'));
    expect(alice.inbox).toBe(urlJoin(alice.id, 'inbox'));
    expect(alice.followers).toBe(urlJoin(alice.id, 'followers'));
    expect(alice.following).toBe(urlJoin(alice.id, 'following'));
    expect(alice.publicKey).toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      type: expect.arrayContaining(['https://www.w3.org/ns/auth/rsa#RSAKey', 'sec:VerificationMethod']),
      controller: alice.id,
      owner: alice.id
    });
  });
});
