import urlJoin from 'url-join';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(70000);
const NUM_USERS = 1;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Actors are correctly created', () => {
  let broker: any;
  const actors: any = [];
  let alice: any;

  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
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

  // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
  afterAll(async () => {
    await broker.stop();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Actor has the required informations', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.type).toContain('Person');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.preferredUsername).toBe('alice');
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.outbox).toBe(urlJoin(alice.id, 'outbox'));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.inbox).toBe(urlJoin(alice.id, 'inbox'));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.followers).toBe(urlJoin(alice.id, 'followers'));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.following).toBe(urlJoin(alice.id, 'following'));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(alice.publicKey).toMatchObject({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      type: expect.arrayContaining(['https://www.w3.org/ns/auth/rsa#RSAKey', 'sec:VerificationMethod']),
      controller: alice.id,
      owner: alice.id
    });
  });
});
