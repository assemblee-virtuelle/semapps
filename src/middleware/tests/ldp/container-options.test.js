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
  let orga1;

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
        schema: 'http://schema.org/'
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
            type: 'schema:PostalAddress',
            'schema:streetAddress': 'Rue du Général Paton',
            'schema:postalCode': '28190',
            'schema:addressLocality': 'Pontgouin',
            'schema:addressCountry': 'France'
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
          type: 'schema:PostalAddress',
          'schema:streetAddress': 'Rue du Général Paton',
          'schema:postalCode': '28190',
          'schema:addressLocality': 'Pontgouin',
          'schema:addressCountry': 'France'
        }
      }
    });
  });

  test('Create resource with disassembly', async () => {
    const resourceUri = await broker.call('ldp.resource.post', {
      resource: {
        '@context': {
          pair: 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Organization',
        'pair:description': 'myOrga',
        'pair:label': 'myTitle',
        'pair:hasLocation': {
          '@type': 'pair:Place',
          'pair:description': 'myPlace'
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'organizations'
    });

    orga1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON });
    expect(orga1['pair:description']).toBe('myOrga');
    expect(orga1['pair:hasLocation']['@id']).toBeDefined();
    expect(orga1['pair:hasLocation']['pair:description']).toBe('myPlace');
  });

  test('Update (PUT) resource with disassembly', async () => {
    await broker.call('ldp.resource.put', {
      resource: {
        ...orga1,
        'pair:hasLocation': {
          ...orga1['pair:hasLocation'],
          '@type': 'pair:Place',
          'pair:description': 'myPlace2'
        },
        'pair:description': 'myOrga2'
      },
      contentType: MIME_TYPES.JSON
    });

    let orga1Updated = await broker.call('ldp.resource.get', {
      resourceUri: orga1['@id'],
      accept: MIME_TYPES.JSON
    });

    expect(orga1Updated['pair:description']).toBe('myOrga2');
    expect(orga1Updated['pair:hasLocation']['@id']).toBeDefined();
    expect(orga1Updated['pair:hasLocation']['pair:description']).toBe('myPlace2');
  }, 20000);

  test('Delete resource with disassembly', async () => {
    await broker.call('ldp.resource.delete', {
      resourceUri: orga1['@id']
    });

    let error;
    try {
      await broker.call('ldp.resource.get', {
        resourceUri: orga1['pair:hasLocation']['@id'],
        accept: MIME_TYPES.JSON
      });
    } catch (e) {
      error = e;
    } finally {
      expect(error && error.code).toBe(404);
    }
  }, 20000);
});
