const { ServiceBroker } = require('moleculer');
const mailer = require('nodemailer');
const fetch = require('node-fetch');
const EventsWatcher = require('../../../tests/middleware/EventsWatcher');
const path = require('path');
const CONFIG = require('../config');

jest.setTimeout(60000);

const broker = new ServiceBroker({
  middlewares: [EventsWatcher],
  logger: false
});

beforeAll(async () => {
  await fetch(CONFIG.SPARQL_ENDPOINT + CONFIG.MAIN_DATASET + '/update', {
    method: 'POST',
    body: 'update=DROP+ALL',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(CONFIG.JENA_USER + ':' + CONFIG.JENA_PASSWORD).toString('base64')
    }
  });
  await broker.loadServices(path.resolve(__dirname, '../services'));
  await broker.start();
});

afterAll(async () => {
  await broker.stop();
});

describe('Test match-bot service', () => {
  let actors = [];

  test('Create 3 actors and make them follow the match bot', async () => {
    actors[1] = await broker.call('activitypub.actor.create', require('./actors/actor1.json'));
    actors[2] = await broker.call('activitypub.actor.create', require('./actors/actor2.json'));
    actors[3] = await broker.call('activitypub.actor.create', require('./actors/actor3.json'));

    for (let i = 1; i <= 3; i++) {
      await broker.call('activitypub.outbox.post', {
        collectionUri: actors[i].outbox,
        '@context': 'https://www.w3.org/ns/activitystreams',
        actor: actors[i].id,
        type: 'Follow',
        object: 'http://localhost:3000/actors/match-bot'
      });

      const followEvent = await broker.watchForEvent('activitypub.follow.added');

      expect(followEvent.follower).toBe(actors[i].id);
    }
  });

  test('Post project 1 and announce it to actor 3', async () => {
    await broker.call('activitypub.inbox.post', {
      username: 'match-bot',
      ...require('./projects/project1.json')
    });

    await broker.watchForEvent('mailer.objects.queued');

    // Actor 3 should match with this project
    const outbox = await broker.call('activitypub.inbox.list', {
      collectionUri: 'http://localhost:3000/actors/match-bot/outbox'
    });

    expect(outbox.orderedItems).not.toBeNull();
    expect(outbox.orderedItems[0]).toMatchObject({
      type: 'Announce',
      actor: 'http://localhost:3000/actors/match-bot',
      object: {
        type: 'Create',
        object: {
          type: 'pair:Project',
          id: 'https://colibris.social/objects/douce-france-le-film'
        }
      },
      to: [actors[3].id, 'as:Public']
    });
  });

  test('Post project 2 and announce it to actors 1 and 3', async () => {
    await broker.call('activitypub.inbox.post', {
      username: 'match-bot',
      ...require('./projects/project2.json')
    });

    await broker.watchForEvent('mailer.objects.queued');

    // Actors 1 and 3 should match
    const outbox = await broker.call('activitypub.inbox.list', {
      collectionUri: 'http://localhost:3000/actors/match-bot/outbox'
    });

    expect(outbox.orderedItems).not.toBeNull();
    expect(outbox.orderedItems[0]).toMatchObject({
      type: 'Announce',
      actor: 'http://localhost:3000/actors/match-bot',
      object: {
        type: 'Create',
        object: {
          type: 'pair:Project',
          id: 'https://colibris.social/objects/chantilly-en-transition'
        }
      },
      to: [actors[1].id, actors[3].id, 'as:Public']
    });
  });

  test('Make sure mails are queued', async () => {
    const collection = await broker.call('mail-queue.find');

    expect(collection['ldp:contains']).not.toBeNull();
    expect(collection['ldp:contains'][0]).toMatchObject({
      '@type': 'Mail',
      actor: actors[1].id,
      frequency: 'weekly',
      objects: 'https://colibris.social/objects/chantilly-en-transition'
    });
    expect(collection['ldp:contains'][1]).toMatchObject({
      '@type': 'Mail',
      actor: actors[3].id,
      frequency: 'daily',
      objects: [
        'https://colibris.social/objects/chantilly-en-transition',
        'https://colibris.social/objects/douce-france-le-film'
      ]
    });
  });

  test('Process queue with daily frequency', async () => {
    let results = await broker.call('mailer.processQueue', {
      frequency: 'daily'
    });

    expect(results.length).toBe(1);
    expect(results[0]).toMatchObject({
      accepted: ['loic@test.com'],
      rejected: []
    });

    for (let info of results) {
      const previewUrl = mailer.getTestMessageUrl(info);
      console.log('PREVIEW URL', previewUrl);
    }

    // Now queue is empty, we should not have any result here
    results = await broker.call('mailer.processQueue', {
      frequency: 'daily'
    });

    expect(results.length).toBe(0);
  });

  test('Process queue with weekly frequency', async () => {
    let results = await broker.call('mailer.processQueue', {
      frequency: 'weekly'
    });

    expect(results.length).toBe(1);
    expect(results[0]).toMatchObject({
      accepted: ['sebastien@test.com'],
      rejected: []
    });

    for (let info of results) {
      const previewUrl = mailer.getTestMessageUrl(info);
      console.log('PREVIEW URL', previewUrl);
    }
  });
});
