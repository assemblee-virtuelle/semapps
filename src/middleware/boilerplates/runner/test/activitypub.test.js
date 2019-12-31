const fetch = require('node-fetch');
const { ServiceBroker } = require('moleculer');
const EventsWatcher = require('./middleware/EventsWatcher');
const createServices = require('../createServices');

const broker = new ServiceBroker({
  logger: false,
  middlewares: [EventsWatcher]
});

beforeAll(async () => {
  let urlConfig = process.env.CONFIG_URL || 'https://assemblee-virtuelle.gitlab.io/semappsconfig/test.json';
  const response = await fetch(urlConfig);
  const config = await response.json();

  await createServices(broker, config);

  await broker.start();

  await broker.call('fuseki-admin.initDataset', {
    dataset: config.mainDataset
  });

  await broker.call('triplestore.dropAll');
});

afterAll(async () => {
  await broker.stop();
});

describe('Posting to followers', () => {
  test('Post follow request', async () => {
    const result = await broker.call('activitypub.outbox.post', {
      username: 'srosset81',
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: 'http://localhost:3000/activitypub/actor/srosset81',
      type: 'Follow',
      object: 'http://localhost:3000/activitypub/actor/simonLouvet'
    });

    // Wait for actor to be added to the followers collection
    await broker.watchForEvent('activitypub.follow.added');

    expect(result.type).toBe('Follow');
  }, 10000);

  test('Get followers list', async () => {
    const result = await broker.call('activitypub.follow.listFollowers', {
      username: 'simonLouvet'
    });

    expect(result.items).toContain('http://localhost:3000/activitypub/actor/srosset81');
  });

  test('Send message to followers', async () => {
    const result = await broker.call('activitypub.outbox.post', {
      username: 'simonLouvet',
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: 'Hello World',
      attributedTo: 'http://localhost:3000/activitypub/actor/simonLouvet',
      to: ['http://localhost:3000/activitypub/actor/simonLouvet/followers'],
      content: 'Voilà mon premier message, très content de faire partie du fedivers !'
    });

    // Wait for message to be received by all followers
    await broker.watchForEvent('activitypub.inbox.received');

    expect(result).toHaveProperty('type', 'Create');
    expect(result).toHaveProperty('object');
  });

  test('Find message in inbox', async () => {
    const result = await broker.call('activitypub.inbox.list', {
      username: 'srosset81'
    });

    expect(result.orderedItems).toHaveLength(1);
    expect(result.orderedItems[0]).toHaveProperty('type', 'Create');
    expect(result.orderedItems[0]).toHaveProperty('actor', 'http://localhost:3000/activitypub/actor/simonLouvet');
  });
});
