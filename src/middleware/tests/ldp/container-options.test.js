const CONFIG = require('../config');
const { MIME_TYPES } = require('@semapps/mime-types');
const initialize = require('./initialize');

jest.setTimeout(20000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Container options', () => {
  test('Get resource with queryDepth', async () => {
    const resourceUri = await broker.call('ldp.resource.post', {
      resource: {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'Event',
        location: {
          type: 'Place',
          name: 'Chantilly'
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'resources'
    });

    // Get resource without queryDepth
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        jsonContext: 'https://www.w3.org/ns/activitystreams'
      })
    ).resolves.toMatchObject({
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Event',
      location: '_:b0'
    });

    // Get resource with queryDepth
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        queryDepth: 1,
        accept: MIME_TYPES.JSON,
        jsonContext: 'https://www.w3.org/ns/activitystreams'
      })
    ).resolves.toMatchObject({
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Event',
      location: {
        type: 'Place',
        name: 'Chantilly'
      }
    });
  });

  test('Get resource with dereference', async () => {
    const jsonContext = [
      'https://www.w3.org/ns/activitystreams',
      {
        'schema': 'http://schema.org/'
      }
    ];

    const resourceUri = await broker.call('ldp.resource.post', {
      resource: {
        '@context': jsonContext,
        type: 'Event',
        location: {
          type: 'Place',
          name: 'Chantilly',
          'schema:address': {
            type: "schema:PostalAddress",
            'schema:streetAddress': "Rue du Général Paton",
            'schema:postalCode': "28190",
            'schema:addressLocality': "Pontgouin",
            'schema:addressCountry': "France"
          }
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'resources'
    });

    // Get resource without dereference
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        jsonContext
      })
    ).resolves.toMatchObject({
      '@context': jsonContext,
      type: 'Event',
      location: '_:b0'
    });

    // Get resource with partial dereference
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        dereference: ['as:location'],
        accept: MIME_TYPES.JSON,
        jsonContext: jsonContext
      })
    ).resolves.toMatchObject({
      '@context': jsonContext,
      type: 'Event',
      location: {
        type: 'Place',
        name: 'Chantilly',
        'schema:address': {}
      }
    });

    // Get resource with full dereference
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri,
        dereference: ['as:location/schema:address'],
        accept: MIME_TYPES.JSON,
        jsonContext
      })
    ).resolves.toMatchObject({
      '@context': jsonContext,
      type: 'Event',
      location: {
        type: 'Place',
        name: 'Chantilly',
        'schema:address': {
          type: "schema:PostalAddress",
          'schema:streetAddress': "Rue du Général Paton",
          'schema:postalCode': "28190",
          'schema:addressLocality': "Pontgouin",
          'schema:addressCountry': "France"
        }
      }
    });
  });
});
