import rdf from '@rdfjs/data-model';
import waitForExpect from 'wait-for-expect';
import { ActionParamSchema, CallingOptions, ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';

jest.setTimeout(50000);
let broker: ServiceBroker;
let webId: string;
let dataset: string;
let callAsAlice: (actionName: string, params: ActionParamSchema, options?: CallingOptions) => Promise<any>;

beforeAll(async () => {
  broker = await initialize(true);
  await broker.start();
  ({ webId, dataset } = (await broker.call('solid-storage.create', { username: 'alice' })) as {
    webId: string;
    dataset: string;
  });
  callAsAlice = (actionName, params, options = {}) =>
    broker.call(actionName, params, { ...options, meta: { ...options.meta, webId, dataset } });
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Resource CRUD operations', () => {
  let project1: any;
  let project2: any;
  let containerUri: string;
  let project1Uri: string;

  test('Post resource in container', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      containerUri = await callAsAlice('ldp.registry.getUri', { type: 'pair:Project', isContainer: true });
      expect(containerUri).not.toBeUndefined();
    });

    project1Uri = await callAsAlice('ldp.container.post', {
      containerUri,
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
      }
    });

    expect(project1Uri).toBeDefined();
  });

  test('Get resource', async () => {
    project1 = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

    expect(project1).toMatchObject({
      id: project1Uri,
      type: 'pair:Project',
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
    await callAsAlice('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1Uri,
        description: 'myProjectUpdatedAgain',
        affiliates: {
          '@id': 'http://localhost:3000/users/pierre'
        },
        hasLocation: {
          label: 'Nantes'
        }
      }
    });

    const updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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
      '@id': project1Uri,
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
    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    let updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type '{ labe... Remove this comment to see the full error message
    resourceUpdated.hasLocation = undefined;

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

    expect(updatedProject['pair:hasLocation']).toBeUndefined();

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' }
    ];

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project1Uri });

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

    const resourceUri = await callAsAlice('ldp.container.post', {
      resource: resourceToPost,
      containerUri
    });

    project2 = await callAsAlice('ldp.resource.get', { resourceUri });

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

    const resourceUri3 = await callAsAlice('ldp.container.post', {
      resource: resourceToPost,
      containerUri
    });

    const project3 = await callAsAlice('ldp.resource.get', { resourceUri: resourceUri3 });

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

    const resourceUri4 = await callAsAlice('ldp.container.post', {
      resource: resourceToPost,
      containerUri
    });

    const project4 = await callAsAlice('ldp.resource.get', { resourceUri: resourceUri4 });

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
      '@id': project2.id,
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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    let updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project2.id });

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

    await callAsAlice('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await callAsAlice('ldp.resource.get', { resourceUri: project2.id });

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
    const themeContainerUri = await callAsAlice('ldp.registry.getUri', { type: 'pair:Theme', isContainer: true });

    const themeUri = await callAsAlice('ldp.container.post', {
      containerUri: themeContainerUri,
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
    await callAsAlice('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        '@id': project1Uri,
        label: 'myTitle',
        hasTopic: {
          '@id': themeUri
        }
      }
    });

    // Remove the relation to the theme
    await callAsAlice('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        '@id': project1Uri,
        label: 'myTitle'
      }
    });

    // Ensure the theme has not been deleted
    const theme = await callAsAlice('ldp.resource.get', { resourceUri: themeUri });

    expect(theme).toMatchObject({
      id: themeUri,
      type: 'pair:Theme',
      'pair:label': 'Permaculture'
    });
  });

  test('PATCH resource', async () => {
    const projectUri = await callAsAlice('ldp.container.post', {
      containerUri,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'SemanticApps'
      },
      slug: 'SemApps'
    });

    await callAsAlice('ldp.resource.patch', {
      resourceUri: projectUri,
      triplesToAdd: [
        rdf.quad(
          rdf.namedNode(projectUri),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#label'),
          rdf.literal('SemApps')
        ),
        rdf.quad(
          rdf.namedNode(projectUri),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#comment'),
          rdf.literal('An open source toolbox to help you easily build semantic web applications')
        )
      ],
      triplesToRemove: [
        rdf.quad(
          rdf.namedNode(projectUri),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#label'),
          rdf.literal('SemanticApps')
        )
      ]
    });

    const project = await callAsAlice('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      id: projectUri,
      'pair:label': 'SemApps',
      'pair:comment': 'An open source toolbox to help you easily build semantic web applications'
    });
  });

  test('PATCH resource with blank nodes', async () => {
    const projectUri = await callAsAlice('ldp.container.post', {
      containerUri,
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        label: 'ActivityPods'
      },
      slug: 'ActivityPods'
    });

    await callAsAlice('ldp.resource.patch', {
      resourceUri: projectUri,
      triplesToAdd: [
        rdf.quad(
          rdf.namedNode(projectUri),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#hasLocation'),
          rdf.blankNode('b_0')
        ),
        rdf.quad(
          rdf.blankNode('b_0'),
          rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#Place')
        ),
        rdf.quad(
          rdf.blankNode('b_0'),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#label'),
          rdf.literal('Paris')
        )
      ]
    });

    let project = await callAsAlice('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      id: projectUri,
      'pair:label': 'ActivityPods',
      'pair:hasLocation': {
        type: 'pair:Place',
        'pair:label': 'Paris'
      }
    });

    await callAsAlice('ldp.resource.patch', {
      resourceUri: projectUri,
      triplesToAdd: [
        rdf.quad(
          rdf.namedNode(projectUri),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#hasLocation'),
          rdf.blankNode('b_0')
        ),
        rdf.quad(
          rdf.blankNode('b_0'),
          rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#Place')
        ),
        rdf.quad(
          rdf.blankNode('b_0'),
          rdf.namedNode('http://virtual-assembly.org/ontologies/pair#label'),
          rdf.literal('Compiègne')
        )
      ]
    });

    project = await callAsAlice('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      id: projectUri,
      'pair:label': 'ActivityPods',
      'pair:hasLocation': expect.arrayContaining([
        {
          type: 'pair:Place',
          'pair:label': 'Paris'
        },
        {
          type: 'pair:Place',
          'pair:label': 'Compiègne'
        }
      ])
    });
  }, 20000);

  test('Delete resource', async () => {
    await callAsAlice('ldp.resource.delete', {
      resourceUri: project1Uri
    });

    await expect(callAsAlice('ldp.resource.get', { resourceUri: project1Uri })).rejects.toThrow(`not found`);
  });
});
