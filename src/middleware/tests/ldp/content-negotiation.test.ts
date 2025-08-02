import urlJoin from 'url-join';
import fetch from 'node-fetch';
import { MIME_TYPES } from '@semapps/mime-types';
import { fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('Content negotiation', () => {
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const containerUri = urlJoin(CONFIG.HOME_URL, 'resources');
  let projectUri: any;
  let project2Uri: any;
  let project3Uri: any;

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

    projectUri = headers.get('Location');

    expect(projectUri).not.toBeNull();
  });

  test('Get resource in Turtle format', async () => {
    const { body } = await fetchServer(projectUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    expect(body).toMatch(new RegExp(`<${projectUri}> a pair:Project`));
    expect(body).toMatch(new RegExp(`pair:description.*"myProject"`));
    expect(body).toMatch(new RegExp(`pair:label.*"myLabel"`));
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

    expect(body).toMatch(new RegExp(`<${containerUri}> a ldp:BasicContainer, ldp:Container`));
    expect(body).toMatch(new RegExp(`ldp:contains <${projectUri}>`));

    expect(body).toMatch(new RegExp(`<${projectUri}> a pair:Project`));
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

    const project2 = await broker.call('ldp.resource.get', {
      resourceUri: project2Uri
    });
    expect(project2).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project2Uri,
      '@type': 'pair:Project',
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

    const project2 = await broker.call('ldp.resource.get', {
      resourceUri: project3Uri
    });
    expect(project2).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project3Uri,
      '@type': 'pair:Project',
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

    const project2 = await broker.call('ldp.resource.get', {
      resourceUri: project2Uri
    });
    expect(project2).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project2Uri,
      '@type': 'pair:Project',
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

    const project3 = await broker.call('ldp.resource.get', {
      resourceUri: project3Uri
    });
    expect(project3).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project3Uri,
      '@type': 'pair:Project',
      'pair:label': 'myProject 3 - updated',
      'pair:description': 'A description'
    });
  });
});
