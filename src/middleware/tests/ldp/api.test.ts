import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import { fetchServer } from '../utils.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize(false);
  await broker.start();
});

afterAll(async () => {
  await broker.stop();
});

describe('LDP handling through API', () => {
  let containerUri: string;
  let resourceUri: any;

  test('Create resource', async () => {
    await waitForExpect(async () => {
      containerUri = await broker.call('ldp.registry.getUri', { type: 'pair:Project', isContainer: true });
      expect(containerUri).not.toBeUndefined();
    });

    const { headers } = await fetchServer(containerUri, {
      method: 'POST',
      body: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myLabel'
      }
    });

    resourceUri = headers.get('Location');

    expect(resourceUri).not.toBeNull();
  });

  test('Get resource', async () => {
    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      json: {
        type: 'pair:Project',
        'pair:description': 'myProject',
        'pair:label': 'myLabel'
      }
    });
  });

  test('Get resource with JsonLdContext header', async () => {
    // Use string
    await expect(
      fetchServer(resourceUri, {
        headers: new fetch.Headers({
          JsonLdContext: 'https://www.w3.org/ns/activitystreams'
        })
      })
    ).resolves.toMatchObject({
      json: {
        type: 'http://virtual-assembly.org/ontologies/pair#Project'
      }
    });

    // Use object
    await expect(
      fetchServer(resourceUri, {
        headers: new fetch.Headers({
          JsonLdContext: JSON.stringify({ pr: 'http://virtual-assembly.org/ontologies/pair#' }) // Exotic prefix
        })
      })
    ).resolves.toMatchObject({
      json: {
        '@type': 'pr:Project'
      }
    });

    // Use array
    await expect(
      fetchServer(resourceUri, {
        headers: new fetch.Headers({
          JsonLdContext: JSON.stringify([
            'https://www.w3.org/ns/activitystreams',
            { pr: 'http://virtual-assembly.org/ontologies/pair#' } // Exotic prefix
          ])
        })
      })
    ).resolves.toMatchObject({
      json: {
        type: 'pr:Project'
      }
    });
  });

  test('Get container', async () => {
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': [
          {
            id: resourceUri,
            'pair:label': 'myLabel'
          }
        ]
      }
    });
  });

  test('Get container with JsonLdContext header', async () => {
    await expect(
      fetchServer(containerUri, {
        headers: new fetch.Headers({
          JsonLdContext: 'https://www.w3.org/ns/activitystreams'
        })
      })
    ).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': [
          {
            id: resourceUri,
            'http://virtual-assembly.org/ontologies/pair#label': 'myLabel'
          }
        ]
      }
    });
  });

  // See https://www.w3.org/TR/ldp/#prefer-parameters
  test('Get container with minimal representation', async () => {
    const { json, headers } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Prefer: 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
      })
    });

    expect(json['ldp:contains']).toBeUndefined();
    expect(headers.get('Preference-Applied')).toBe('return=representation');
  });

  test('Replace resource', async () => {
    await fetchServer(resourceUri, {
      method: 'PUT',
      body: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProjectUpdated'
      }
    });

    const { json } = await fetchServer(resourceUri);

    expect(json).toMatchObject({
      type: 'pair:Project',
      'pair:description': 'myProjectUpdated'
    });

    expect(json['pair:label']).toBeUndefined();
  });

  test('Patch resource', async () => {
    await fetchServer(resourceUri, {
      method: 'PATCH',
      body: `
        PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
        INSERT DATA {
          <${resourceUri}> pair:label "myLabel" .
          <${resourceUri}> pair:description "myProjectPatched" .
        };
        DELETE DATA {
          <${resourceUri}> pair:description "myProjectUpdated" .
        }
      `,
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      })
    });

    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      json: {
        type: 'pair:Project',
        'pair:description': 'myProjectPatched',
        'pair:label': 'myLabel'
      }
    });
  });

  test('Patch resource with blank nodes', async () => {
    await fetchServer(resourceUri, {
      method: 'PATCH',
      body: `
        PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
        INSERT DATA {
          <${resourceUri}> pair:hasLocation [
            a pair:Place ;
            pair:label "Paris"
          ]
        }
      `,
      headers: new fetch.Headers({
        'Content-Type': 'application/sparql-update'
      })
    });

    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      json: {
        type: 'pair:Project',
        'pair:description': 'myProjectPatched',
        'pair:label': 'myLabel',
        'pair:hasLocation': {
          type: 'pair:Place',
          'pair:label': 'Paris'
        }
      }
    });
  });

  test('Delete resource', async () => {
    await expect(
      fetchServer(resourceUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      status: 404
    });

    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        type: expect.arrayContaining(['ldp:Container', 'ldp:BasicContainer']),
        'ldp:contains': []
      }
    });
  });
});
