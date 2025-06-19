import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'node... Remove this comment to see the full error message
import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import { fetchServer } from '../utils.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('LDP handling through API', () => {
  const containerUri = urlJoin(CONFIG.HOME_URL, 'resources');
  let resourceUri: any;
  let subContainerUri: any;
  let subResourceUri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(resourceUri).not.toBeNull();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      json: {
        '@type': 'pair:Project',
        'pair:description': 'myProject',
        'pair:label': 'myLabel'
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource with JsonLdContext header', async () => {
    // Use string
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container with JsonLdContext header', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container with minimal representation', async () => {
    const { json, headers } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Prefer: 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(json['ldp:contains']).toBeUndefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(headers.get('Preference-Applied')).toBe('return=representation');
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(json).toMatchObject({
      '@type': 'pair:Project',
      'pair:description': 'myProjectUpdated'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(json['pair:label']).toBeUndefined();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      json: {
        '@type': 'pair:Project',
        'pair:description': 'myProjectPatched',
        'pair:label': 'myLabel'
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Delete resource', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      fetchServer(resourceUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(resourceUri)).resolves.toMatchObject({
      status: 404
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': []
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(subContainerUri).toBe(urlJoin(CONFIG.HOME_URL, 'resources', 'sub-resources'));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(subContainerUri)).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'dc:title': 'Sub-resources',
        'dc:description': 'Used to test dynamic containers creation'
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(json).toMatchObject({
      'ldp:contains': [
        {
          '@id': subContainerUri,
          '@type': ['ldp:Container', 'ldp:BasicContainer', 'ldp:Resource']
        }
      ]
    });

    // The content of sub-containers is not displayed
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(json['ldp:contains'][0]['ldp:contains']).toBeUndefined();

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      fetchServer(subContainerUri, {
        method: 'DELETE'
      })
    ).resolves.toMatchObject({
      status: 204
    });

    await waitForExpect(async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(fetchServer(subContainerUri)).resolves.toMatchObject({
        status: 404
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(containerUri)).resolves.toMatchObject({
      json: {
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': []
      }
    });

    // Sub-resource should NOT be deleted with the sub-container
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetchServer(subResourceUri)).resolves.toMatchObject({
      json: {
        '@type': 'pair:Project',
        'pair:description': 'My sub-resource'
      }
    });
  });
});
