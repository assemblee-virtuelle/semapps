const { quad, namedNode, blankNode, literal } = require('rdf-data-model');
const CONFIG = require('../config');
const initialize = require('./initialize');

jest.setTimeout(50000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});
afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Resource CRUD operations', () => {
  let project1Uri;
  let project1;
  let project2;

  test('Post resource in container', async () => {
    project1Uri = await broker.call('ldp.container.post', {
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
      containerUri: `${CONFIG.HOME_URL}resources`
    });

    expect(project1Uri).toBeDefined();
  });

  test('Get resource', async () => {
    project1 = await broker.call('ldp.resource.get', { resourceUri: project1Uri });

    expect(project1).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project1['@id'],
      '@type': 'pair:Project',
      'pair:affiliates': expect.arrayContaining([
        'http://localhost:3000/users/guillaume',
        'http://localhost:3000/users/sebastien'
      ]),
      'pair:description': 'myProject',
      'pair:hasLocation': expect.objectContaining({ 'pair:description': 'The place to be', 'pair:label': 'Paris' }),
      'pair:label': 'myTitle'
    });
  });

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
      }
    });

    const updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': {
        'pair:label': 'Nantes'
      }
    });
    expect(updatedProject['pair:label']).toBeUndefined();
    expect(updatedProject['pair:hasLocation']['pair:description']).toBeUndefined();
  });

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
    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    let updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': expect.arrayContaining([
        {
          'pair:label': 'Nantes'
        },
        {
          'pair:label': 'Compiegne'
        }
      ])
    });
    expect(updatedProject['pair:label']).toBeUndefined();
    expect(updatedProject['pair:hasLocation']['pair:description']).toBeUndefined();

    resourceUpdated.hasLocation = [
      {
        label: 'Compiegne'
      }
    ];

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

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

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': expect.arrayContaining([
        {
          'pair:label': 'Compiegne'
        },
        {
          'pair:label': 'Nantes'
        },
        {
          'pair:label': 'Oloron'
        }
      ])
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

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

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
        description: 'the place to be'
      },
      {
        label: 'Compiegne',
        description: 'or not'
      }
    ];

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': expect.arrayContaining([
        {
          'pair:label': 'Compiegne',
          'pair:description': 'the place to be'
        },
        {
          'pair:label': 'Compiegne',
          'pair:description': 'or not'
        }
      ])
    });

    resourceUpdated.hasLocation = undefined;

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject['pair:hasLocation']).toBeUndefined();

    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' }
    ];

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'petr:openingTimesDay': {
        'petr:endingTime': '2021-10-07T09:40:56.131Z',
        'petr:startingTime': '2021-10-07T06:40:56.123Z'
      }
    });

    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' },
      { 'petr:startingTime': '2021-10-07T10:44:54.883Z', 'petr:endingTime': '2021-10-07T16:44:54.888Z' }
    ];

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project1['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'petr:openingTimesDay': expect.arrayContaining([
        { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' },
        { 'petr:startingTime': '2021-10-07T10:44:54.883Z', 'petr:endingTime': '2021-10-07T16:44:54.888Z' }
      ])
    });
  });

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
      containerUri: `${CONFIG.HOME_URL}resources2`
    });

    project2 = await broker.call('ldp.resource.get', { resourceUri });

    expect(project2).toMatchObject({
      'pair:hasLocation': {
        'pair:label': 'Paris',
        'pair:hasPostalAddress': {
          'pair:addressCountry': 'France'
        }
      }
    });

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
      containerUri: `${CONFIG.HOME_URL}resources2`
    });

    const project3 = await broker.call('ldp.resource.get', { resourceUri: resourceUri3 });

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
      containerUri: `${CONFIG.HOME_URL}resources2`
    });

    const project4 = await broker.call('ldp.resource.get', { resourceUri: resourceUri4 });

    expect(project4).toMatchObject({
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
            'pair:addressCountry': 'France'
          }
        }
      ]
    });
  });

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

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    let updatedProject = await broker.call('ldp.resource.get', { resourceUri: project2['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:hasLocation': expect.arrayContaining([
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
      ])
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

    await broker.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await broker.call('ldp.resource.get', { resourceUri: project2['@id'] });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:hasLocation': {
        'pair:label': 'Paris',
        'pair:hasPostalAddress': {
          'pair:addressCountry': 'France'
        }
      }
    });
  });

  // Ensure dereferenced resources with IDs are not deleted by PUT
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
      }
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
      }
    });

    // Ensure the theme has not been deleted
    const theme = await broker.call('ldp.resource.get', { resourceUri: themeUri });

    expect(theme).toMatchObject({
      '@id': themeUri,
      '@type': 'pair:Theme',
      'pair:label': 'Permaculture'
    });
  });

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
      ]
    });

    const project = await broker.call('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      '@id': projectUri,
      'pair:label': 'SemApps',
      'pair:comment': 'An open source toolbox to help you easily build semantic web applications'
    });
  });

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
      ]
    });

    let project = await broker.call('ldp.resource.get', { resourceUri: projectUri });

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
      ]
    });

    project = await broker.call('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      '@id': projectUri,
      'pair:label': 'ActivityPods',
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

  test('Delete resource', async () => {
    await broker.call('ldp.resource.delete', {
      resourceUri: project1['@id']
    });

    await expect(broker.call('ldp.resource.get', { resourceUri: project1['@id'] })).rejects.toThrow(`not found`);
  });
});
