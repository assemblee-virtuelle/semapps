import urlJoin from 'url-join';
import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import { fetchServer } from '../utils.ts';
import CONFIG from '../config.ts';
import initialize from './initialize.ts';
jest.setTimeout(20000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('LDP handling through API', () => {
  const containerUri = urlJoin(CONFIG.HOME_URL, 'resources');
  let resourceUri;
  let subContainerUri;
  let subResourceUri;

  test('Create resource', async () => {
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
        '@type': 'pair:Project',
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
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': [
          {
            '@id': resourceUri,
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
        type: ['ldp:Container', 'ldp:BasicContainer'],
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
      '@type': 'pair:Project',
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
        '@type': 'pair:Project',
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
        '@type': 'pair:Project',
        'pair:description': 'myProjectPatched',
        'pair:label': 'myLabel',
        'pair:hasLocation': {
          '@type': 'pair:Place',
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
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': []
      }
    });
  });

  test('Create sub-container', async () => {
    const { headers } = await fetchServer(containerUri, {
      method: 'POST',
      body: {
        '@context': {
          dc: 'http://purl.org/dc/terms/',
          ldp: 'http://www.w3.org/ns/ldp#'
        },
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'dc:title': 'Sub-resources',
        'dc:description': 'Used to test dynamic containers creation'
      },
      headers: new fetch.Headers({
        Slug: 'sub-resources'
      })
    });

    subContainerUri = headers.get('Location');

    expect(subContainerUri).toBe(urlJoin(CONFIG.HOME_URL, 'resources', 'sub-resources'));

    await expect(fetchServer(subContainerUri)).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'dc:title': 'Sub-resources',
        'dc:description': 'Used to test dynamic containers creation'
      }
    });
  });

  test('Create resource in sub-container', async () => {
    const { headers } = await fetchServer(subContainerUri, {
      method: 'POST',
      body: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'My sub-resource'
      }
    });

    subResourceUri = headers.get('Location');

    const { json } = await fetchServer(containerUri);

    // Sub-containers appear as ldp:Resource
    expect(json).toMatchObject({
      'ldp:contains': [
        {
          '@id': subContainerUri,
          '@type': ['ldp:Container', 'ldp:BasicContainer', 'ldp:Resource']
        }
      ]
    });

    // The content of sub-containers is not displayed
    expect(json['ldp:contains'][0]['ldp:contains']).toBeUndefined();

    await expect(fetchServer(subContainerUri)).resolves.toMatchObject({
      json: {
        'dc:title': 'Sub-resources',
        'dc:description': 'Used to test dynamic containers creation',
        'ldp:contains': [
          {
            '@id': subResourceUri,
            '@type': 'pair:Project',
            'pair:description': 'My sub-resource'
          }
        ]
      }
    });
  });

  test('Delete sub-container', async () => {
    // Give write permission on sub-container, or we won't be able to delete it as anonymous
    await broker.call('webacl.resource.addRights', {
      webId: 'system',
      resourceUri: subContainerUri,
      additionalRights: {
        anon: {
          write: true
        }
      }
    });

    await expect(
      fetchServer(subContainerUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    await waitForExpect(async () => {
      await expect(fetchServer(subContainerUri)).resolves.toMatchObject({
        status: 404
      });
    });

    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': []
      }
    });

    // Sub-resource should NOT be deleted with the sub-container
    await expect(fetchServer(subResourceUri)).resolves.toMatchObject({
      json: {
        '@type': 'pair:Project',
        'pair:description': 'My sub-resource'
      }
    });
  });
});
