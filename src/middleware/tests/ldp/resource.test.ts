import rdf from '@rdfjs/data-model';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount, clearAllDatasets, backupAllDatasets } from '../utils.ts';

jest.setTimeout(50000);
let broker: ServiceBroker;
let alice: any;

describe.each(['ng', 'fuseki'])('Resource CRUD operations with triplestore %s', (triplestore: string) => {
  beforeAll(async () => {
    broker = await initialize(triplestore);
    await broker.start();
    await clearAllDatasets(broker);
    alice = await createAccount(broker, 'alice6');
  });

  afterAll(async () => {
    if (broker) {
      if (triplestore === 'ng') await backupAllDatasets(broker); // Allow to see what was persisted
      await broker.stop();
    }
  });

  let project1: any;
  let project2: any;
  let containerUri: string;
  let project1Uri: string;

  test('Post resource in container', async () => {
    containerUri = await alice.getContainerUri('pair:Project');

    project1Uri = await alice.call('ldp.container.post', {
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
    project1 = await alice.call('ldp.resource.get', { resourceUri: project1Uri });

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
    await alice.call('ldp.resource.put', {
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

    const updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });

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
    await alice.call('ldp.resource.put', { resource: resourceUpdated });

    let updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': expect.arrayContaining([
        expect.objectContaining({
          'pair:label': 'Nantes'
        }),
        expect.objectContaining({
          'pair:label': 'Compiegne'
        })
      ])
    });
    expect(updatedProject['pair:label']).toBeUndefined();
    expect(updatedProject['pair:hasLocation']['pair:description']).toBeUndefined();
    resourceUpdated.hasLocation = [
      {
        label: 'Compiegne'
      }
    ];
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
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
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': expect.arrayContaining([
        expect.objectContaining({
          'pair:label': 'Compiegne'
        }),
        expect.objectContaining({
          'pair:label': 'Nantes'
        }),
        expect.objectContaining({
          'pair:label': 'Oloron'
        })
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
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
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
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': 'http://localhost:3000/users/pierre',
      'pair:hasLocation': expect.arrayContaining([
        expect.objectContaining({
          'pair:label': 'Compiegne',
          'pair:description': 'the place to be'
        }),
        expect.objectContaining({
          'pair:label': 'Compiegne',
          'pair:description': 'or not'
        })
      ])
    });
    // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type '{ labe... Remove this comment to see the full error message
    resourceUpdated.hasLocation = undefined;
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
    expect(updatedProject['pair:hasLocation']).toBeUndefined();
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' }
    ];
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'petr:openingTimesDay': expect.objectContaining({
        'petr:endingTime': '2021-10-07T09:40:56.131Z',
        'petr:startingTime': '2021-10-07T06:40:56.123Z'
      })
    });
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    resourceUpdated['petr:openingTimesDay'] = [
      { 'petr:endingTime': '2021-10-07T09:40:56.131Z', 'petr:startingTime': '2021-10-07T06:40:56.123Z' },
      { 'petr:startingTime': '2021-10-07T10:44:54.883Z', 'petr:endingTime': '2021-10-07T16:44:54.888Z' }
    ];
    await alice.call('ldp.resource.put', { resource: resourceUpdated });
    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project1Uri });
    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'petr:openingTimesDay': expect.arrayContaining([
        expect.objectContaining({
          'petr:endingTime': '2021-10-07T09:40:56.131Z',
          'petr:startingTime': '2021-10-07T06:40:56.123Z'
        }),
        expect.objectContaining({
          'petr:startingTime': '2021-10-07T10:44:54.883Z',
          'petr:endingTime': '2021-10-07T16:44:54.888Z'
        })
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

    const resourceUri = await alice.call('ldp.container.post', {
      resource: resourceToPost,
      containerUri
    });

    project2 = await alice.call('ldp.resource.get', { resourceUri });

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

    const resourceUri3 = await alice.call('ldp.container.post', {
      resource: resourceToPost,
      containerUri
    });

    const project3 = await alice.call('ldp.resource.get', { resourceUri: resourceUri3 });

    expect(project3).toMatchObject({
      'pair:hasLocation': expect.arrayContaining([
        expect.objectContaining({
          'pair:label': 'Paris',
          'pair:hasPostalAddress': expect.objectContaining({
            'pair:addressCountry': 'USA'
          })
        }),
        expect.objectContaining({
          'pair:label': 'Paris',
          'pair:hasPostalAddress': expect.objectContaining({
            'pair:addressCountry': 'France'
          })
        })
      ])
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

    const resourceUri4 = await alice.call('ldp.container.post', {
      resource: resourceToPost,
      containerUri
    });

    const project4 = await alice.call('ldp.resource.get', { resourceUri: resourceUri4 });

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

    await alice.call('ldp.resource.put', { resource: resourceUpdated });

    let updatedProject = await alice.call('ldp.resource.get', { resourceUri: project2.id });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:hasLocation': expect.arrayContaining([
        expect.objectContaining({
          'pair:label': 'Paris',
          'pair:hasPostalAddress': expect.objectContaining({
            'pair:addressCountry': 'France'
          })
        }),
        expect.objectContaining({
          'pair:label': 'Paris',
          'pair:hasPostalAddress': expect.objectContaining({
            'pair:addressCountry': 'USA'
          })
        })
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

    await alice.call('ldp.resource.put', { resource: resourceUpdated });

    updatedProject = await alice.call('ldp.resource.get', { resourceUri: project2.id });

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
    const themeContainerUri = await alice.getContainerUri('pair:Theme');

    const themeUri = await alice.call('ldp.container.post', {
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
    await alice.call('ldp.resource.put', {
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
    await alice.call('ldp.resource.put', {
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
    const theme = await alice.call('ldp.resource.get', { resourceUri: themeUri });

    expect(theme).toMatchObject({
      id: themeUri,
      type: 'pair:Theme',
      'pair:label': 'Permaculture'
    });
  });

  test('PATCH resource', async () => {
    const projectUri = await alice.call('ldp.container.post', {
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

    await alice.call('ldp.resource.patch', {
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

    const project = await alice.call('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      id: projectUri,
      'pair:label': 'SemApps',
      'pair:comment': 'An open source toolbox to help you easily build semantic web applications'
    });
  });

  test('PATCH resource with blank nodes', async () => {
    const projectUri = await alice.call('ldp.container.post', {
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

    await alice.call('ldp.resource.patch', {
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

    let project = await alice.call('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      id: projectUri,
      'pair:label': 'ActivityPods',
      'pair:hasLocation': {
        type: 'pair:Place',
        'pair:label': 'Paris'
      }
    });

    await alice.call('ldp.resource.patch', {
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

    project = await alice.call('ldp.resource.get', { resourceUri: projectUri });

    expect(project).toMatchObject({
      id: projectUri,
      'pair:label': 'ActivityPods',
      'pair:hasLocation': expect.arrayContaining([
        expect.objectContaining({
          type: 'pair:Place',
          'pair:label': 'Paris'
        }),
        expect.objectContaining({
          type: 'pair:Place',
          'pair:label': 'Compiègne'
        })
      ])
    });
  }, 20000);

  test('Delete resource', async () => {
    await alice.call('ldp.resource.delete', {
      resourceUri: project1Uri
    });

    await expect(alice.call('ldp.resource.get', { resourceUri: project1Uri })).rejects.toThrow(`not found`);
  });
});
