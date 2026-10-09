import { MIME_TYPES } from '@semapps/mime-types';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  if (broker) await broker.stop();
});

// Resource with blank nodes on 3 levels
const projectWithBlankNodes = (label: string) => ({
  '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
  '@type': 'Project',
  label,
  hasLocation: {
    '@type': 'Place',
    label: 'Place',
    hasPostalAddress: { '@type': 'PostalAddress', addressLocality: 'Paris', hasGeo: { latitude: 48.85 } }
  }
});

const countBlankNodes = async () => {
  const [result] = await broker.call('triplestore.query', {
    query: 'SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o . FILTER(isBLANK(?s)) }',
    accept: MIME_TYPES.JSON,
    webId: 'system'
  });
  return parseInt(result.count.value, 10);
};

describe('Deletion of blank nodes', () => {
  test('Deleting a resource deletes its blank nodes', async () => {
    const before = await countBlankNodes();

    const resourceUri = await broker.call('ldp.container.post', {
      containerUri: `${CONFIG.HOME_URL}resources`,
      contentType: MIME_TYPES.JSON,
      resource: projectWithBlankNodes('Local project')
    });
    // Place (3 triples), address (3 triples), geo (1 triple)
    expect(await countBlankNodes()).toBe(before + 7);

    await broker.call('ldp.resource.delete', { resourceUri, webId: 'system' });
    expect(await countBlankNodes()).toBe(before);
  });

  test('Storing again or deleting a remote resource deletes its blank nodes', async () => {
    const before = await countBlankNodes();
    const resourceUri = 'https://remote.example/projects/with-blank-nodes';
    const store = (label: string) =>
      broker.call('ldp.remote.store', {
        resource: { '@id': resourceUri, ...projectWithBlankNodes(label) },
        webId: 'system'
      });

    await store('Version 1');
    expect(await countBlankNodes()).toBe(before + 7);

    // The blank nodes of the previous version are deleted
    await store('Version 2');
    expect(await countBlankNodes()).toBe(before + 7);

    await broker.call('ldp.remote.delete', { resourceUri, webId: 'system' });
    expect(await countBlankNodes()).toBe(before);
  });
});
