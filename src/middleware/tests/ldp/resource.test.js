const { ServiceBroker } = require('moleculer');
const EventsWatcher = require('../middleware/EventsWatcher');
const CONFIG = require('../config');
const { MIME_TYPES } = require('@semapps/mime-types');
const initialize = require('./initialize');

jest.setTimeout(20000);
const broker = new ServiceBroker({
  middlewares: [EventsWatcher]
  // logger: false
});

beforeAll(async () => {
  await initialize(broker);
});
afterAll(async () => {
  await broker.stop();
});

describe('CRUD Project', () => {
  let project1;

  test('Create project', async () => {
    const urlParamsPost = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': 'Project',
        description: 'myProject',
        label: 'myTitle'
      },
      contentType: MIME_TYPES.JSON,
      containerUri: CONFIG.HOME_URL + 'resources'
    };

    const resourceUri = await broker.call('ldp.resource.post', urlParamsPost);
    project1 = await broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON });
    expect(project1['pair:description']).toBe('myProject');
  }, 20000);

  test('Get One project', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.JSON,
      resourceUri: project1['@id']
    });
    expect(newProject['pair:description']).toBe('myProject');
  }, 20000);

  test('Update One Project', async () => {
    const urlParamsPatch = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdated'
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    };

    await broker.call('ldp.resource.patch', urlParamsPatch);
    const updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });
    expect(updatedProject['pair:description']).toBe('myProjectUpdated');
    expect(updatedProject['pair:label']).toBe('myTitle');
  }, 20000);

  test('Get One project turtle', async () => {
    const newProject = await broker.call('ldp.resource.get', {
      accept: MIME_TYPES.TURTLE,
      resourceUri: project1['@id']
    });
    expect(newProject).toMatch(new RegExp(`<${project1['@id']}>`));
    expect(newProject).toMatch(new RegExp(`a.*pair:Project`));
    expect(newProject).toMatch(new RegExp(`pair:description.*"myProjectUpdated"`));
    expect(newProject).toMatch(new RegExp(`pair:label.*"myTitle"`));
  }, 20000);

  test('Get One project triple', async () => {
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
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#description>.*"myProjectUpdated"`)
    );
    expect(newProject).toMatch(
      new RegExp(`<${project1['@id']}>.*<http://virtual-assembly.org/ontologies/pair#label>.*"myTitle"`)
    );
  }, 20000);

  test('Replace One Project', async () => {
    const urlParamsPut = {
      resource: {
        '@context': {
          '@vocab': 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@id': project1['@id'],
        description: 'myProjectUpdated'
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    };
    await broker.call('ldp.resource.put', urlParamsPut);
    const updatedProject = await broker.call('ldp.resource.get', {
      resourceUri: project1['@id'],
      accept: MIME_TYPES.JSON
    });
    expect(updatedProject['pair:description']).toBe('myProjectUpdated');
    expect(updatedProject['pair:label']).toBeUndefined();
  }, 20000);

  test('Delete project', async () => {
    const params = {
      resourceUri: project1['@id']
    };
    await broker.call('ldp.resource.delete', params);

    let error;
    try {
      await broker.call('ldp.resource.get', {
        accept: MIME_TYPES.JSON,
        ...params
      });
    } catch (e) {
      error = e;
    } finally {
      expect(error && error.code).toBe(404);
    }
  }, 20000);

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
});
