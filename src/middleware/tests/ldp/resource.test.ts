import { MIME_TYPES } from '@semapps/mime-types';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'rdf-... Remove this comment to see the full error message
import { quad, namedNode, blankNode, literal } from 'rdf-data-model';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Resource CRUD operations', () => {
  let project1: any;
  let project2: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post resource in container', async () => {
    const resourceUri = await broker.call('ldp.container.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myTitle',
        affiliates: [
          {
            '@id': 'http://localhost:3000/users/guillaume'
          },
          {
            '@id': 'http://localhost:3000/users/sebastien'
          }
        ],
        hasLocation: {
          label: 'Paris',
          description: 'The place to be'
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: `${CONFIG.HOME_URL}resources`
    });

    project1 = await broker.call('ldp.resource.get', {
      resourceUri,
      accept: MIME_TYPES.JSON
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project1['pair:description']).toBe('myProject');
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource in JSON-LD format', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.JSON,
      resourceUri: project1['@id']
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject['pair:description']).toBe('myProject');
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource in turtle format', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TURTLE,
      resourceUri: project1['@id']
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(new RegExp(`<${project1['@id']}>`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(new RegExp(`a.*pair:Project`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(new RegExp(`pair:description.*"myProject"`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(new RegExp(`pair:label.*"myTitle"`));
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource in triple format', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TRIPLE,
      resourceUri: project1['@id']
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(
      new RegExp(
        `<${project1['@id']}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>.*<http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#description>.*"myProject"`)
    );
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#label>.*"myTitle"`)
    );
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Put resource', async () => {
    await broker.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdatedAgain',
        affiliates: {
          '@id': 'http://localhost:3000/users/pierre'
        },
        hasLocation: {
          label: 'Nantes'
        }
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    const updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': {
        'pair:label': 'Nantes'
      }
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject['pair:label']).toBeUndefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject['pair:hasLocation']['pair:description']).toBeUndefined();
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Put resource with multiple blank nodes including same values', async () => {
    const resourceUpdated = {
      '@context': {
        petr: 'https://data.petr-msb.data-players.com/ontology#',
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      '@id': project1['@id'],
      description: 'myProjectUpdatedAgain',
      affiliates: {
        '@id': 'http://localhost:3000/users/pierre'
      },
      hasLocation: [
        {
          label: 'Nantes'
        },
        {
          label: 'Compiegne'
        }
      ]
    };
    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    let updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': [
        {
          'pair:label': 'Nantes'
        },
        {
          'pair:label': 'Compiegne'
        }
      ]
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject['pair:label']).toBeUndefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject['pair:hasLocation']['pair:description']).toBeUndefined();

    resourceUpdated.hasLocation = [
      {
        label: 'Compiegne'
      }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': {
        'pair:label': 'Compiegne'
      }
    });

    resourceUpdated.hasLocation = [
      {
        label: 'Compiegne'
      },
      {
        label: 'Nantes'
      },
      {
        label: 'Oloron'
      }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': [
        {
          'pair:label': 'Compiegne'
        },
        {
          'pair:label': 'Nantes'
        },
        {
          'pair:label': 'Oloron'
        }
      ]
    });

    resourceUpdated.hasLocation = [
      {
        label: 'Compiegne'
      },
      {
        label: 'Compiegne'
      },
      {
        label: 'Compiegne'
      }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': {
        'pair:label': 'Compiegne'
      }
    });

    resourceUpdated.hasLocation = [
      {
        label: 'Compiegne',
        // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
        description: 'the place to be'
      },
      {
        label: 'Compiegne',
        // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
        description: 'or not'
      }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': [
        {
          'pair:label': 'Compiegne',
          'pair:description': 'the place to be'
        },
        {
          'pair:label': 'Compiegne',
          'pair:description': 'or not'
        }
      ]
    });

    // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type '{ labe... Remove this comment to see the full error message
    resourceUpdated.hasLocation = undefined;

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject['pair:hasLocation']).toBeUndefined();

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'petr:openingTimesDay': {
        'petr:endingTime': '2021-10-07T09:40:56.131Z',
        'petr:startingTime': '2021-10-07T06:40:56.123Z'
      }
    });

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' },
      { 'petr:startingTime': '2021-10-07T10:44:54.883Z', 'petr:endingTime': '2021-10-07T16:44:54.888Z' }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'petr:openingTimesDay': [
        { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' },
        { 'petr:startingTime': '2021-10-07T10:44:54.883Z', 'petr:endingTime': '2021-10-07T16:44:54.888Z' }
      ]
    });
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Post resource with multiple blank nodes with 2 imbrications blank nodes', async () => {
    const resourceToPost = {
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      '@type': 'Project',
      description: 'myProject',
      label: 'myTitle',
      hasLocation: {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'France'
        }
      }
    };

    const resourceUri = await broker.call('ldp.container.post', {
      resource: resourceToPost,
      contentType: MIME_TYPES.JSON,
      containerUri: `${CONFIG.HOME_URL}resources2`
    });

    project2 = await broker.call('ldp.resource.get', {
      resourceUri,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project2).toMatchObject({
      'pair:hasLocation': {
        'pair:label': 'Paris',
        'pair:hasPostalAddress': {
          'pair:addressCountry': 'France'
        }
      }
    });

    // @ts-expect-error TS(2739): Type '{ label: string; hasPostalAddress: { address... Remove this comment to see the full error message
    resourceToPost.hasLocation = [
      {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'France'
        }
      },
      {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'USA'
        }
      }
    ];

    const resourceUri3 = await broker.call('ldp.container.post', {
      resource: resourceToPost,
      contentType: MIME_TYPES.JSON,
      containerUri: `${CONFIG.HOME_URL}resources2`
    });

    const project3 = await broker.call('ldp.resource.get', {
      resourceUri: resourceUri3,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project3).toMatchObject({
      'pair:hasLocation': [
        {
          'pair:label': 'Paris',
          'pair:hasPostalAddress': {
            'pair:addressCountry': 'France'
          }
        },
        {
          'pair:label': 'Paris',
          'pair:hasPostalAddress': {
            'pair:addressCountry': 'USA'
          }
        }
      ]
    });

    // @ts-expect-error TS(2739): Type '{ label: string; hasPostalAddress: { address... Remove this comment to see the full error message
    resourceToPost.hasLocation = [
      {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'France'
        }
      },
      {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'France'
        }
      }
    ];

    const resourceUri4 = await broker.call('ldp.container.post', {
      resource: resourceToPost,
      contentType: MIME_TYPES.JSON,
      containerUri: `${CONFIG.HOME_URL}resources2`
    });

    const project4 = await broker.call('ldp.resource.get', {
      resourceUri: resourceUri4,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project4).toMatchObject({
      'pair:hasLocation': {
        'pair:label': 'Paris',
        'pair:hasPostalAddress': {
          'pair:addressCountry': 'France'
        }
      }
    });
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Put resource with multiple blank nodes with 2 imbrications blank nodes', async () => {
    const resourceUpdated = {
      '@context': {
        '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
      },
      '@id': project2['@id'],
      description: 'myProjectUpdatedAgain',
      hasLocation: [
        {
          label: 'Paris',
          hasPostalAddress: {
            addressCountry: 'France'
          }
        },
        {
          label: 'Paris',
          hasPostalAddress: {
            addressCountry: 'USA'
          }
        }
      ]
    };

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    let updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project2['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:hasLocation': [
        {
          'pair:label': 'Paris',
          'pair:hasPostalAddress': {
            'pair:addressCountry': 'France'
          }
        },
        {
          'pair:label': 'Paris',
          'pair:hasPostalAddress': {
            'pair:addressCountry': 'USA'
          }
        }
      ]
    });

    resourceUpdated.hasLocation = [
      {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'France'
        }
      },
      {
        label: 'Paris',
        hasPostalAddress: {
          addressCountry: 'France'
        }
      }
    ];

    await broker.call('ldp.resource.put', {
      resource: resourceUpdated,
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project2['@id'],
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:hasLocation': {
        'pair:label': 'Paris',
        'pair:hasPostalAddress': {
          'pair:addressCountry': 'France'
        }
      }
    });
  }, 20000);

  // Ensure dereferenced resources with IDs are not deleted by PUT
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('PUT resource with ID', async () => {
    const themeUri = await broker.call('ldp.container.post', {
      containerUri: 'http://localhost:3000/themes',
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Theme',
        label: 'Permaculture'
      },
      contentType: MIME_TYPES.JSON,
      slug: 'Permaculture'
    });

    // Add a relation to the theme
    await broker.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        '@id': project1['@id'],
        label: 'myTitle',
        hasTopic: {
          '@id': themeUri
        }
      },
      contentType: MIME_TYPES.JSON
    });

    // Remove the relation to the theme
    await broker.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        '@id': project1['@id'],
        label: 'myTitle'
      },
      contentType: MIME_TYPES.JSON
    });

    // Ensure the theme has not been deleted
    const theme = await broker.call('ldp.resource.get', {
      resourceUri: themeUri,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(theme).toMatchObject({
      '@id': themeUri,
      '@type': 'pair:Theme',
      'pair:label': 'Permaculture'
    });
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('PATCH resource', async () => {
    const projectUri = await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'SemanticApps'
      },
      contentType: MIME_TYPES.JSON,
      slug: 'SemApps'
    });

    await broker.call('ldp.resource.patch', {
      resourceUri: projectUri,
      triplesToAdd: [
        quad(namedNode(projectUri), namedNode('http://virtual-assembly.org/ontologies/pair#label'), literal('SemApps')),
        quad(
          namedNode(projectUri),
          namedNode('http://virtual-assembly.org/ontologies/pair#comment'),
          literal('An open source toolbox to help you easily build semantic web applications')
        )
      ],
      triplesToRemove: [
        quad(
          namedNode(projectUri),
          namedNode('http://virtual-assembly.org/ontologies/pair#label'),
          literal('SemanticApps')
        )
      ],
      contentType: MIME_TYPES.JSON
    });

    const project = await broker.call('ldp.resource.get', {
      resourceUri: projectUri,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project).toMatchObject({
      '@id': projectUri,
      'pair:label': 'SemApps',
      'pair:comment': 'An open source toolbox to help you easily build semantic web applications'
    });
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('PATCH resource with blank nodes', async () => {
    const projectUri = await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'ActivityPods'
      },
      contentType: MIME_TYPES.JSON,
      slug: 'ActivityPods'
    });

    await broker.call('ldp.resource.patch', {
      resourceUri: projectUri,
      triplesToAdd: [
        quad(
          namedNode(projectUri),
          namedNode('http://virtual-assembly.org/ontologies/pair#hasLocation'),
          blankNode('b_0')
        ),
        quad(
          blankNode('b_0'),
          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          namedNode('http://virtual-assembly.org/ontologies/pair#Place')
        ),
        quad(blankNode('b_0'), namedNode('http://virtual-assembly.org/ontologies/pair#label'), literal('Paris'))
      ],
      contentType: MIME_TYPES.JSON
    });

    let project = await broker.call('ldp.resource.get', {
      resourceUri: projectUri,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project).toMatchObject({
      '@id': projectUri,
      'pair:label': 'ActivityPods',
      'pair:hasLocation': {
        '@type': 'pair:Place',
        'pair:label': 'Paris'
      }
    });

    await broker.call('ldp.resource.patch', {
      resourceUri: projectUri,
      triplesToAdd: [
        quad(
          namedNode(projectUri),
          namedNode('http://virtual-assembly.org/ontologies/pair#hasLocation'),
          blankNode('b_0')
        ),
        quad(
          blankNode('b_0'),
          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          namedNode('http://virtual-assembly.org/ontologies/pair#Place')
        ),
        quad(blankNode('b_0'), namedNode('http://virtual-assembly.org/ontologies/pair#label'), literal('Compiègne'))
      ],
      contentType: MIME_TYPES.JSON
    });

    project = await broker.call('ldp.resource.get', {
      resourceUri: projectUri,
      accept: MIME_TYPES.JSON
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project).toMatchObject({
      '@id': projectUri,
      'pair:label': 'ActivityPods',
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      'pair:hasLocation': expect.arrayContaining([
        {
          '@type': 'pair:Place',
          'pair:label': 'Paris'
        },
        {
          '@type': 'pair:Place',
          'pair:label': 'Compiègne'
        }
      ])
    });
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Delete resource', async () => {
    await broker.call('ldp.resource.delete', {
      resourceUri: project1['@id']
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('ldp.resource.get', {
        resourceUri: project1['@id'],
        accept: MIME_TYPES.JSON
      })
    ).rejects.toThrow(`Cannot get permissions of non-existing container or resource ${project1['@id']}`);
  }, 20000);
});
