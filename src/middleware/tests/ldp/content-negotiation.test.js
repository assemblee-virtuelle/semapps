const urlJoin = require('url-join');
const fetch = require('node-fetch');
const { MIME_TYPES } = require('@semapps/mime-types');
const { fetchServer } = require('../utils');
const CONFIG = require('../config');
const initialize = require('./initialize');

jest.setTimeout(20000);
let broker;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('Content negotiation', () => {
  const containerUri = urlJoin(CONFIG.HOME_URL, 'resources');
  let resourceUri;

  test('Post resource in JSON-LD', async () => {
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

  test('Get resource in Turtle format', async () => {
    const { body } = await fetchServer(resourceUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    expect(body).toMatch(new RegExp(`<${resourceUri}> a pair:Project`));
    expect(body).toMatch(new RegExp(`pair:description.*"myProject"`));
    expect(body).toMatch(new RegExp(`pair:label.*"myLabel"`));
  });

  test('Get resource in N-Triples format', async () => {
    const { body } = await fetchServer(resourceUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TRIPLE
      })
    });

    expect(body).toMatch(
      new RegExp(
        `<${resourceUri}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
    expect(body).toMatch(
      new RegExp(`<${resourceUri}>.*<http://virtual-assembly.org/ontologies/pair#description> "myProject"`)
    );
    expect(body).toMatch(new RegExp(`<${resourceUri}>.*<http://virtual-assembly.org/ontologies/pair#label> "myLabel"`));
  });

  test('Get container in Turtle format', async () => {
    const { body } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    expect(body).toMatch(new RegExp(`<${containerUri}> a ldp:BasicContainer, ldp:Container`));
    expect(body).toMatch(new RegExp(`ldp:contains <${resourceUri}>`));

    expect(body).toMatch(new RegExp(`<${resourceUri}> a pair:Project`));
    expect(body).toMatch(new RegExp(`pair:description.*"myProject"`));
    expect(body).toMatch(new RegExp(`pair:label.*"myLabel"`));
  });

  test('Get container in N-Triples format', async () => {
    const { body } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TRIPLE
      })
    });

    expect(body).toMatch(
      new RegExp(
        `<${containerUri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/ldp#BasicContainer>`
      )
    );
    expect(body).toMatch(
      new RegExp(
        `<${containerUri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/ldp#Container>`
      )
    );
    expect(body).toMatch(new RegExp(`<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`));
    expect(body).toMatch(
      new RegExp(
        `<${resourceUri}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
  });
});
