const { ServiceBroker } = require('moleculer');
const { TripleStoreService } = require('@semapps/triplestore');
const { LdpService, getPrefixJSON } = require('@semapps/ldp');
const { ActivityPubService } = require('@semapps/activitypub');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

jest.setTimeout(20000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
});

beforeAll(async () => {
  broker.createService(TripleStoreService, {
    settings: {
      sparqlEndpoint: CONFIG.SPARQL_ENDPOINT,
      mainDataset: CONFIG.MAIN_DATASET,
      jenaUser: CONFIG.JENA_USER,
      jenaPassword: CONFIG.JENA_PASSWORD
    }
  });
  broker.createService(LdpService, {
    settings: {
      baseUrl: CONFIG.HOME_URL + 'ldp/',
      ontologies
    }
  });
  broker.createService(ActivityPubService, {
    settings: {
      baseUri: CONFIG.HOME_URL,
      additionalContext: getPrefixJSON(ontologies)
    }
  });

  await broker.start();
  await broker.call('triplestore.dropAll');
});

afterAll(async () => {
  await broker.stop();
});

describe('Posting to followers', () => {
  let simon, sebastien;

  test('Create actor directly', async () => {
    sebastien = await broker.call('activitypub.actor.create', {
      slug: 'srosset81',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'srosset81',
      name: 'Sébastien Rosset'
    });

    simon = await broker.call('activitypub.actor.create', {
      slug: 'simonLouvet',
      '@context': 'https://www.w3.org/ns/activitystreams',
      preferredUsername: 'simonLouvet',
      name: 'Simon Louvet'
    });

    expect(sebastien.preferredUsername).toBe('srosset81');
    expect(simon.preferredUsername).toBe('simonLouvet');
  }, 20000);

  test('Post follow request', async () => {
    const result = await broker.call('activitypub.outbox.post', {
      username: sebastien.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      actor: sebastien.id,
      type: 'Follow',
      object: simon.id
    });

    // Wait for actor to be added to the followers collection
    await broker.watchForEvent('activitypub.follow.added');

    expect(result.type).toBe('Follow');
  }, 20000);

  test('Get followers list', async () => {
    const result = await broker.call('activitypub.follow.listFollowers', {
      username: simon.preferredUsername
    });

    expect(result.items).toContain(sebastien.id);
  });

  test('Send message to followers', async () => {
    const result = await broker.call('activitypub.outbox.post', {
      username: simon.preferredUsername,
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: 'Hello World',
      attributedTo: simon.id,
      to: [simon.followers],
      content: 'Voilà mon premier message, très content de faire partie du fedivers !'
    });

    // Wait for message to be received by all followers
    await broker.watchForEvent('activitypub.inbox.received');

    expect(result).toHaveProperty('type', 'Create');
    expect(result).toHaveProperty('object');
  });

  test('Find message in inbox', async () => {
    const result = await broker.call('activitypub.inbox.list', {
      username: sebastien.preferredUsername
    });

    expect(result.orderedItems).toHaveLength(1);
  });
});
