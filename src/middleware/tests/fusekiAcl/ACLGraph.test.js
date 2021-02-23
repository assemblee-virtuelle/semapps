const doRequest = require('./utils');
const CONFIG = require('../config');

const adminAuth = CONFIG.JENA_USER+':'+CONFIG.JENA_PASSWORD;


describe('fuseki ACL graph tests', () => {

  test('Ensure that SPARQL http endpoint rejects requests without Authorization', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      sparql: 'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object }',
    });
    expect(statusCode).toBe(401);
  });

  test('Ensure that SPARQL http endpoint accepts request with Authorization set to admin:<password>', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      sparql: 'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object }',
    });
    expect(statusCode).toBe(200);
  });

  test('Ensure that SPARQL http endpoint returns a 403 when SemappsUser is set and ACL graph is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'test',
      sparql: 'SELECT ?subject ?predicate ?object WHERE { GRAPH <http://semapps.org/webacl> { ?subject ?predicate ?object } }',
    });
    expect(statusCode).toBe(403);
  });

  test('Ensure that SPARQL http endpoint accepts request when SemappsUser is set and default graph is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'test',
      sparql: 'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object }',
    });
    expect(statusCode).toBe(200);
  });

  test('Ensure that SPARQL http endpoint returns an invalid result when SemappsUser is set and union of default graph and all named graphs is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'test',
      sparql: 'SELECT * { { ?s ?p ?o } UNION { GRAPH ?g { ?s ?p ?o } } }',
    });
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.stringContaining('Request forbidden'));
  });

  test('Ensure that SPARQL http endpoint accepts request when SemappsUser is not set and default graph is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      sparql: 'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object }',
    });
    expect(statusCode).toBe(200);
  });

  test('Ensure that SPARQL http endpoint accepts request when SemappsUser is not set and ACL graph is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      sparql: 'SELECT ?subject ?predicate ?object WHERE { GRAPH <http://semapps.org/webacl> { ?subject ?predicate ?object } }',
    });
    expect(statusCode).toBe(200);
  });

  test('Ensure that SPARQL http endpoint accepts request when SemappsUser is set to system and default graph is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'system',
      sparql: 'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object }',
    });
    expect(statusCode).toBe(200);
  });

  test('Ensure that SPARQL http endpoint accepts request when SemappsUser is set to system and ACL graph is requested', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'query',
      auth: adminAuth,
      user: 'system',
      sparql: 'SELECT ?subject ?predicate ?object WHERE { GRAPH <http://semapps.org/webacl> { ?subject ?predicate ?object } }',
    });
    //console.log(body.results.bindings.length)
    expect(statusCode).toBe(200);
  });

});