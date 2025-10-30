import fetch from 'node-fetch';
import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import { MIME_TYPES } from '@semapps/mime-types';
import { fetchServer, createStorage } from '../utils.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize(false);
  await broker.start();
  alice = await createStorage(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('Content negotiation', () => {
  let containerUri: string;
  let projectUri: string | null;
  let project2Uri: string | null;
  let project3Uri: string | null;
  let project4Uri: string | null;

  test('Post resource in JSON-LD', async () => {
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      containerUri = await alice.call('ldp.registry.getUri', { type: 'pair:Project', isContainer: true });
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

    projectUri = headers.get('Location');

    expect(projectUri).not.toBeNull();
  });

  test('Get resource in Turtle format', async () => {
    const { body } = await fetchServer(projectUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    expect(body).toMatch(new RegExp(`pair:label "myLabel"`));
    expect(body).toMatch(new RegExp(`a pair:Project`));
    expect(body).toMatch(new RegExp(`pair:description "myProject"`));
  });

  test('Get resource in N-Triples format', async () => {
    const { body } = await fetchServer(projectUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TRIPLE
      })
    });

    expect(body).toMatch(
      new RegExp(
        `<${projectUri}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
    expect(body).toMatch(
      new RegExp(`<${projectUri}>.*<http://virtual-assembly.org/ontologies/pair#description> "myProject"`)
    );
    expect(body).toMatch(new RegExp(`<${projectUri}>.*<http://virtual-assembly.org/ontologies/pair#label> "myLabel"`));
  });

  test('Get container in Turtle format', async () => {
    const { body } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    expect(body).toMatch(new RegExp(`a ldp:Container, ldp:BasicContainer`));
    expect(body).toMatch(new RegExp(`ldp:contains <${projectUri}>`));

    expect(body).toMatch(new RegExp(`a pair:Project`));
    expect(body).toMatch(new RegExp(`pair:description "myProject"`));
    expect(body).toMatch(new RegExp(`pair:label "myLabel"`));
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
    expect(body).toMatch(new RegExp(`<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${projectUri}>`));
    expect(body).toMatch(
      new RegExp(
        `<${projectUri}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
  });

  test('Post resource in Turtle format', async () => {
    const { headers, status } = await fetchServer(containerUri, {
      method: 'POST',
      body: `
        @prefix pair: <http://virtual-assembly.org/ontologies/pair#>.
        <> a pair:Project;
          pair:label "myProject 2" .
      `,
      headers: new fetch.Headers({
        'Content-Type': MIME_TYPES.TURTLE
      })
    });

    expect(status).toBe(201);

    project2Uri = headers.get('Location');

    const project2 = await alice.call('ldp.resource.get', {
      resourceUri: project2Uri
    });
    expect(project2).toMatchObject({
      id: project2Uri,
      type: 'pair:Project',
      'pair:label': 'myProject 2'
    });
  });

  test('Post resource in N-Triples format', async () => {
    const { headers, status } = await fetchServer(containerUri, {
      method: 'POST',
      body: `
        <> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project> .
        <> <http://virtual-assembly.org/ontologies/pair#label> "myProject 3" .
      `,
      headers: new fetch.Headers({
        'Content-Type': MIME_TYPES.TRIPLE
      })
    });

    expect(status).toBe(201);

    project3Uri = headers.get('Location');

    const project2 = await alice.call('ldp.resource.get', {
      resourceUri: project3Uri
    });
    expect(project2).toMatchObject({
      id: project3Uri,
      type: 'pair:Project',
      'pair:label': 'myProject 3'
    });
  });

  test('Update resource in Turtle format', async () => {
    const { status } = await fetchServer(project2Uri, {
      method: 'PUT',
      body: `
        @prefix pair: <http://virtual-assembly.org/ontologies/pair#>.
        <${project2Uri}> a pair:Project;
          pair:label "myProject 2 - updated" ;
          pair:description "A description" .
      `,
      headers: new fetch.Headers({
        'Content-Type': MIME_TYPES.TURTLE
      })
    });

    expect(status).toBe(204);

    const project2 = await alice.call('ldp.resource.get', {
      resourceUri: project2Uri
    });
    expect(project2).toMatchObject({
      id: project2Uri,
      type: 'pair:Project',
      'pair:label': 'myProject 2 - updated',
      'pair:description': 'A description'
    });
  });

  test('Update resource in N-Triples format', async () => {
    const { status } = await fetchServer(project3Uri, {
      method: 'PUT',
      body: `
        <${project3Uri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project> .
        <${project3Uri}> <http://virtual-assembly.org/ontologies/pair#label> "myProject 3 - updated" .
        <${project3Uri}> <http://virtual-assembly.org/ontologies/pair#description> "A description" .
      `,
      headers: new fetch.Headers({
        'Content-Type': MIME_TYPES.TRIPLE
      })
    });

    expect(status).toBe(204);

    const project3 = await alice.call('ldp.resource.get', {
      resourceUri: project3Uri
    });
    expect(project3).toMatchObject({
      id: project3Uri,
      type: 'pair:Project',
      'pair:label': 'myProject 3 - updated',
      'pair:description': 'A description'
    });
  });

  test('Post resource with sub-resources in Turtle format', async () => {
    const { headers, status } = await fetchServer(containerUri, {
      method: 'POST',
      body: `
        @prefix pair: <http://virtual-assembly.org/ontologies/pair#>.
        <> a pair:Project ;
          pair:label "myProject 4" ;
          pair:hasPart <#task1> .

        <#task1> a pair:Task ;
          pair:label "myTask 1" .
      `,
      headers: new fetch.Headers({
        'Content-Type': MIME_TYPES.TURTLE
      })
    });

    expect(status).toBe(201);

    project4Uri = headers.get('Location');

    const project4 = await alice.call('ldp.resource.get', {
      resourceUri: project4Uri
    });

    // In JSON-LD, blank nodes are automatically embedded
    expect(project4).toMatchObject({
      id: project4Uri,
      type: 'pair:Project',
      'pair:hasPart': {
        id: `${project4Uri}#task1`,
        type: 'pair:Task',
        'pair:label': 'myTask 1'
      },
      'pair:label': 'myProject 4'
    });
  });

  test('Get resource with sub-resources in Turtle format', async () => {
    const { body } = await fetchServer(project4Uri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    expect(body).toMatch(new RegExp(`a pair:Project`));
    expect(body).toMatch(new RegExp(`pair:label "myProject 4"`));
    expect(body).toMatch(new RegExp(`a pair:Task`));
    expect(body).toMatch(new RegExp(`pair:label "myTask 1"`));
  });
});
