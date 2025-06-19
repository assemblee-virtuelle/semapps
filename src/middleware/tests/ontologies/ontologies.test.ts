// @ts-expect-error TS(7016): Could not find a declaration file for module 'node... Remove this comment to see the full error message
import fetch from 'node-fetch';
import urlJoin from 'url-join';
import initialize from './initialize.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import ont1 from './ontologies/ont1.json' with { type: 'json' };
import ont2 from './ontologies/ont2.json' with { type: 'json' };
import ont3 from './ontologies/ont3.json' with { type: 'json' };
import ont4 from './ontologies/ont4.json' with { type: 'json' };

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(10000);
const localContextUri = urlJoin(CONFIG.HOME_URL, '.well-known/context.jsonld');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe.each([false, true])('Register ontologies with cacher %s', (cacher: any) => {
  let broker: any;

  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
  beforeAll(async () => {
    broker = await initialize(cacher);
  });
  // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
  afterAll(async () => {
    if (broker) await broker.stop();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Register a new ontology', async () => {
    await broker.call('ontologies.register', { ...ont1 });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { prefix: ont1.prefix })).resolves.toMatchObject(ont1);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { namespace: ont1.namespace })).resolves.toMatchObject(ont1);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { uri: `${ont1.namespace}MyClass` })).resolves.toMatchObject(ont1);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.list')).resolves.toEqual(
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect.arrayContaining([expect.objectContaining(ont1)])
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Register the same ontology', async () => {
    await broker.call('ontologies.register', {
      ...ont1,
      owl: 'https://www.w3.org/ns/ontology1.ttl'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { prefix: 'ont1' })).resolves.toMatchObject({
      ...ont1,
      owl: 'https://www.w3.org/ns/ontology1.ttl'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.list')).resolves.toEqual(
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect.arrayContaining([
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
          ...ont1,
          owl: 'https://www.w3.org/ns/ontology1.ttl'
        })
      ])
    );

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Register a 2nd ontology', async () => {
    await broker.call('ontologies.register', { ...ont2 });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { prefix: 'ont2' })).resolves.toMatchObject(ont2);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.list')).resolves.toEqual(
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect.arrayContaining([expect.objectContaining(ont1), expect.objectContaining(ont2)])
    );

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext, localContextUri]);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetch(localContextUri).then((res: any) => res.json())).resolves.toEqual({
      '@context': {
        ont2: 'https://www.w3.org/ns/ontology2#'
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Register a 3nd ontology', async () => {
    await broker.call('ontologies.register', { ...ont3 });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { prefix: 'ont3' })).resolves.toMatchObject(ont3);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.list')).resolves.toEqual(
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect.arrayContaining([
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining(ont1),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining(ont2),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining(ont3)
      ])
    );

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('jsonld.context.get')).resolves.toEqual([ont1.jsonldContext, localContextUri]);

    // Only the ontologies 2 and 3 should be included
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(fetch(localContextUri).then((res: any) => res.json())).resolves.toEqual({
      '@context': {
        ont2: 'https://www.w3.org/ns/ontology2#',
        ont3: 'https://www.w3.org/ns/ontology3#',
        friend: {
          '@id': 'ont3:friend',
          '@type': '@id',
          '@protected': true
        }
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Register a 4th ontology with persist option', async () => {
    await broker.call('ontologies.register', { ...ont4, persist: true });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.get', { prefix: 'ont4' })).resolves.toMatchObject(ont4);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Find prefixes with prefix.cc', async () => {
    let result = await broker.call('ontologies.findPrefix', { uri: 'http://xmlns.com/foaf/0.1/name' });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result).toBe('foaf');

    result = await broker.call('ontologies.findPrefix', { uri: 'http://xmlns.com/foaf/0.1/' });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result).toBe('foaf');

    result = await broker.call('ontologies.findPrefix', { uri: 'http://xmlns.com/foaf' });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result).toBeNull();

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ontologies.findPrefix', { uri: 'foaf:name' })).rejects.toThrow();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get RDF prefixes', async () => {
    const rdfPrefixes = await broker.call('ontologies.getRdfPrefixes');

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(rdfPrefixes).toBe(
      'PREFIX ont1: <https://www.w3.org/ns/ontology1#>\nPREFIX ont2: <https://www.w3.org/ns/ontology2#>\nPREFIX ont3: <https://www.w3.org/ns/ontology3#>\nPREFIX ont4: <https://www.w3.org/ns/ontology4#>'
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get prefixes', async () => {
    const prefixes = await broker.call('ontologies.getPrefixes');

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(prefixes).toEqual({
      ont1: 'https://www.w3.org/ns/ontology1#',
      ont2: 'https://www.w3.org/ns/ontology2#',
      ont3: 'https://www.w3.org/ns/ontology3#',
      ont4: 'https://www.w3.org/ns/ontology4#'
    });
  });
});
