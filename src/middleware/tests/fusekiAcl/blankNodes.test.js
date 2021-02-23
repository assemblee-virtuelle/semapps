const doRequest = require('./utils');
const CONFIG = require('../config');

const adminAuth = CONFIG.JENA_USER+':'+CONFIG.JENA_PASSWORD;


describe('fuseki ACL blank nodes tests', () => {

  test('Ensure orphan blank nodes are not reachable', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'anon',
      sparql: 'SELECT * { ?s <https://w3id.org/security#owner> <https://data.virtual-assembly.org/users/jeremy.dufraisse>. ?s <https://w3id.org/security#publicKeyPem> ?string }',
    });

    expect(body.results.bindings.length).toBe(
      0);
  });

  test('Ensure "pair:hasLocation" blank nodes inside organisations, are returned only when user has perms for org (anon)', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'anon',
      jsonld: true,
      sparql: 'PREFIX pair: <http://virtual-assembly.org/ontologies/pair#> CONSTRUCT { ?s pair:hasLocation ?place. ?place ?p ?o .} WHERE { ?s  pair:hasLocation ?place . ?place ?p ?o .}',
    });

    expect(body['@graph'].length).toBe(4);
    expect(typeof body['@graph'][0].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][1].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][2].hasLocation).toBe('string');
    expect(typeof body['@graph'][3].hasLocation).toBe('string');
  });

  test('Ensure "pair:hasLocation" blank nodes inside organisations, are returned only when user has perms for org (anyUser)', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'http://any/user',
      jsonld: true,
      sparql: 'PREFIX pair: <http://virtual-assembly.org/ontologies/pair#> CONSTRUCT { ?s pair:hasLocation ?place. ?place ?p ?o .} WHERE { ?s  pair:hasLocation ?place . ?place ?p ?o .}',
    });

    expect(body['@graph'].length).toBe(8);
    expect(typeof body['@graph'][0].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][1].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][2].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][3].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][4].hasLocation).toBe('string');
    expect(typeof body['@graph'][5].hasLocation).toBe('string');
    expect(typeof body['@graph'][6].hasLocation).toBe('string');
    expect(typeof body['@graph'][7].hasLocation).toBe('string');
  });

  test('Ensure retrieving all blank nodes by their type, are returned only when user has perms for their embedding resource (anon)', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'anon',
      jsonld: true,
      sparql: 'prefix pair: <http://virtual-assembly.org/ontologies/pair#> CONSTRUCT WHERE { ?s a pair:Place . ?s ?p ?o .}',
    });

    expect(body['@graph'].length).toBe(2);
    expect(typeof body['@graph'][0].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][1].hasPostalAddress).toBe('string');
  });

  test('Ensure "pair:hasLocation" blank nodes inside organisations, and sub blank nodes "pair:hasPostalAddress", are returned only when user has perms for org (anon)', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'anon',
      jsonld: true,
      sparql: 'prefix pair: <http://virtual-assembly.org/ontologies/pair#> CONSTRUCT WHERE { ?s  pair:hasLocation ?place . ?place ?p ?o .?place pair:hasPostalAddress ?address. ?address ?q ?r}',
    });

    expect(body['@graph'].length).toBe(6);
    expect(typeof body['@graph'][0].addressCountry).toBe('string');
    expect(typeof body['@graph'][1].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][2].hasPostalAddress).toBe('string');
    expect(typeof body['@graph'][3].addressCountry).toBe('string');
    expect(typeof body['@graph'][4].hasLocation).toBe('string');
    expect(typeof body['@graph'][5].hasLocation).toBe('string');

  });

});