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

describe('Resource CRUD operations', () => {
  let project1;

  test('Post resource in container', async () => {
    const resourceUri = await broker.call('ldp.resource.post', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myTitle',
        affiliates: [
          { '@id': 'http://localhost:3000/users/guillaume' },
          { '@id': 'http://localhost:3000/users/sebastien' }
        ],
        hasLocation: {
          label: 'Paris',
          description: 'The place to be'
        }
      },
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'resources'
    });

    project1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON });
    expect(project1['pair:description']).toBe('myProject');
  }, 20000);

  test('Get resource in JSON-LD format', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.JSON,
      resourceUri: project1['@id']
    });
    expect(newProject['pair:description']).toBe('myProject');
  }, 20000);

  test('Get resource in turtle format', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TURTLE,
      resourceUri: project1['@id']
    });
    expect(newProject).toMatch(new RegExp(`<${project1['@id']}>`));
    expect(newProject).toMatch(new RegExp(`a.*pair:Project`));
    expect(newProject).toMatch(new RegExp(`pair:description.*"myProject"`));
    expect(newProject).toMatch(new RegExp(`pair:label.*"myTitle"`));
  }, 20000);

  test('Get resource in triple format', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TRIPLE,
      resourceUri: project1['@id']
    });
    expect(newProject).toMatch(
      new RegExp(
        `<${project1['@id']}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>.*<http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#description>.*"myProject"`)
    );
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#label>.*"myTitle"`)
    );
  }, 20000);

  test('Patch resource', async () => {
    await broker.call('ldp.resource.patch', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdated',
        affiliates: { '@id': 'http://localhost:3000/users/simon' },
        hasLocation: {
          label: 'Compiègne'
        }
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });

    const updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdated',
      'pair:label': 'myTitle',
      'pair:affiliates': [
        { '@id': 'http://localhost:3000/users/simon' },
        { '@id': 'http://localhost:3000/users/sebastien' },
        { '@id': 'http://localhost:3000/users/guillaume' }
      ],
      'pair:hasLocation': {
        'pair:label': 'Compiègne',
        'pair:description': 'The place to be'
      }
    });
  }, 20000);

  test('Put resource', async () => {
    await broker.call('ldp.resource.put', {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdatedAgain',
        affiliates: { '@id': 'http://localhost:3000/users/pierre' },
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

    expect(updatedProject).toMatchObject({
      'pair:description': 'myProjectUpdatedAgain',
      'pair:affiliates': { '@id': 'http://localhost:3000/users/pierre' },
      'pair:hasLocation': {
        'pair:label': 'Nantes'
      }
    });
    expect(updatedProject['pair:label']).toBeUndefined();
    expect(updatedProject['pair:hasLocation']['pair:description']).toBeUndefined();
  }, 20000);

  test('Delete resource', async () => {
    await broker.call('ldp.resource.delete', {
      resourceUri: project1['@id']
    });

    let error;
    try {
      await broker.call('ldp.resource.get', {
        resourceUri: project1['@id'],
        accept: MIME_TYPES.JSON
      });
    } catch (e) {
      error = e;
    } finally {
      expect(error && error.code).toBe(404);
    }
  }, 20000);
});
