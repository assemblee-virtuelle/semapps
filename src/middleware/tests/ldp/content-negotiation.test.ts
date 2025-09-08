import urlJoin from 'url-join';
import fetch from 'node-fetch';
import { MIME_TYPES } from '@semapps/mime-types';
import { fetchServer } from '../utils.ts';
import * as CONFIG from '../config.ts';
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
describe('Content negotiation', () => {
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const containerUri = urlJoin(CONFIG.HOME_URL, 'resources');
  let projectUri: any;
  let project2Uri: any;
  let project3Uri: any;
  let project4Uri: any;

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(projectUri).not.toBeNull();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource in Turtle format', async () => {
    const { body } = await fetchServer(projectUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${projectUri}> a pair:Project`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`pair:description.*"myProject"`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`pair:label.*"myLabel"`));
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource in N-Triples format', async () => {
    const { body } = await fetchServer(projectUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TRIPLE
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(
      new RegExp(
        `<${projectUri}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(
      new RegExp(`<${projectUri}>.*<http://virtual-assembly.org/ontologies/pair#description> "myProject"`)
    );
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${projectUri}>.*<http://virtual-assembly.org/ontologies/pair#label> "myLabel"`));
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container in Turtle format', async () => {
    const { body } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${containerUri}> a ldp:BasicContainer, ldp:Container`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`ldp:contains <${projectUri}>`));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${projectUri}> a pair:Project`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`pair:description.*"myProject"`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`pair:label.*"myLabel"`));
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get container in N-Triples format', async () => {
    const { body } = await fetchServer(containerUri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TRIPLE
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(
      new RegExp(
        `<${containerUri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/ldp#BasicContainer>`
      )
    );
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(
      new RegExp(
        `<${containerUri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/ldp#Container>`
      )
    );
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${projectUri}>`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(
      new RegExp(
        `<${projectUri}>.*<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://virtual-assembly.org/ontologies/pair#Project>`
      )
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(status).toBe(201);

    project2Uri = headers.get('Location');

    const project2 = await broker.call('ldp.resource.get', {
      resourceUri: project2Uri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project2).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project2Uri,
      '@type': 'pair:Project',
      'pair:label': 'myProject 2'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(status).toBe(201);

    project3Uri = headers.get('Location');

    const project2 = await broker.call('ldp.resource.get', {
      resourceUri: project3Uri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project2).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project3Uri,
      '@type': 'pair:Project',
      'pair:label': 'myProject 3'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(status).toBe(204);

    const project2 = await broker.call('ldp.resource.get', {
      resourceUri: project2Uri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project2).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project2Uri,
      '@type': 'pair:Project',
      'pair:label': 'myProject 2 - updated',
      'pair:description': 'A description'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(status).toBe(204);

    const project3 = await broker.call('ldp.resource.get', {
      resourceUri: project3Uri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project3).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      '@id': project3Uri,
      '@type': 'pair:Project',
      'pair:label': 'myProject 3 - updated',
      'pair:description': 'A description'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(status).toBe(201);

    project4Uri = headers.get('Location');

    const project4 = await broker.call('ldp.resource.get', {
      resourceUri: project4Uri
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(project4).toMatchObject({
      '@context': 'http://localhost:3000/.well-known/context.jsonld',
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      '@graph': expect.arrayContaining([
        {
          '@id': project4Uri,
          '@type': 'pair:Project',
          'pair:hasPart': `${project4Uri}#task1`,
          'pair:label': 'myProject 4'
        },
        {
          '@id': `${project4Uri}#task1`,
          '@type': 'pair:Task',
          'pair:label': 'myTask 1'
        }
      ])
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get resource with sub-resources in Turtle format', async () => {
    const { body } = await fetchServer(project4Uri, {
      headers: new fetch.Headers({
        Accept: MIME_TYPES.TURTLE
      })
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${project4Uri}> a pair:Project`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`pair:label "myProject 4"`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`<${project4Uri}#task1> a pair:Task`));
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(body).toMatch(new RegExp(`pair:label "myTask 1"`));
  });
});
