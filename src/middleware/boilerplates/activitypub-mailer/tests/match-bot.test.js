const { ServiceBroker } = require('moleculer');
const mailer = require('nodemailer');
const fetch = require('node-fetch');
const EventsWatcher = require('../../../tests/middleware/EventsWatcher');
const path = require('path');
const CONFIG = require('../config');

jest.setTimeout(30000);

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
  const matchBotUri = 'http://localhost:4000/actors/match-bot';

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
        object: matchBotUri,
        to: [actors[i].followers, matchBotUri]
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
      collectionUri: matchBotUri + '/outbox'
    });

    expect(outbox.orderedItems).not.toBeNull();
    expect(outbox.orderedItems[0]).toMatchObject({
      type: 'Announce',
      actor: matchBotUri,
      object: {
        type: 'Create',
        object: {
          type: 'pair:Project',
          id: 'http://localhost:3000/objects/mongrenier'
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
      collectionUri: matchBotUri + '/outbox'
    });

    expect(outbox.orderedItems).not.toBeNull();
    expect(outbox.orderedItems[0]).toMatchObject({
      type: 'Announce',
      actor: matchBotUri,
      object: {
        type: 'Create',
        object: {
          type: 'pair:Project',
          id: 'http://localhost:3000/objects/chateau-darvieu'
        }
      },
      to: [actors[1].id, actors[3].id, 'as:Public']
    });
  });

  test('Process queue with daily frequency', async () => {
    const job = await broker.call('mailer.processNotifications', { frequency: 'daily' });

    const result = await job.finished();

    expect(result).toMatchObject({
      [actors[3].id]: ['http://localhost:3000/objects/mongrenier', 'http://localhost:3000/objects/chateau-darvieu']
    });
  });

  test('Process queue with weekly frequency', async () => {
    const job = await broker.call('mailer.processNotifications', { frequency: 'weekly' });

    const result = await job.finished();

    expect(result).toMatchObject({
      [actors[1].id]: ['http://localhost:3000/objects/chateau-darvieu']
    });
  });

  test('Send confirmation mail', async () => {
    const job = await broker.call('mailer.sendConfirmationMail', { actor: actors[1] });

    const result = await job.finished();

    const previewUrl = mailer.getTestMessageUrl(result);
    console.log('CONFIRMATION MAIL PREVIEW', previewUrl);

    expect(result.accepted[0]).toBe('sebastien@test.com');
  });

  test('Send notification mail', async () => {
    const job = await broker.call('mailer.sendNotificationMail', {
      actorUri: actors[3].id,
      objects: ['http://localhost:3000/objects/mongrenier', 'http://localhost:3000/objects/chateau-darvieu']
    });

    const result = await job.finished();

    const previewUrl = mailer.getTestMessageUrl(result);
    console.log('NOTIFICATION MAIL PREVIEW', previewUrl);

    expect(result.accepted[0]).toBe('loic@test.com');
  });
});
