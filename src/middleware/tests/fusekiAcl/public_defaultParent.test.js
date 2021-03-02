const doRequest = require('./utils');
const CONFIG = require('../config');

const adminAuth = CONFIG.JENA_USER+':'+CONFIG.JENA_PASSWORD;

async function readResource(user, resource) {
  return doRequest({
    endpoint: 'query',
    auth: adminAuth,
    user,
    sparql: 'SELECT ?predicate ?object WHERE { '+resource+' ?predicate ?object }',
  });
}

async function insertResource(user, resource) {
  return doRequest({
    endpoint: 'update',
    auth: adminAuth,
    user,
    sparql: 'INSERT DATA { '+resource+' <http://test/ns/property1> "ok" }',
  });
}

async function deleteResource(user, resource, predicate, object) {
  return doRequest({
    endpoint: 'update',
    auth: adminAuth,
    user,
    sparql: 'DELETE DATA { '+resource+' '+predicate+' '+object+' }'
  });
}

describe('fuseki ACL public anonymous user, default parent container access', () => {

  /////// ***** READ

  test('Ensure READ fails when no Authorization exists for the parent container', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/tero>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl35>
  test('Ensure READ succeeds when Authorization exists for the parent container and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/territoires_en_liens>');
    expect(body.results.bindings.length).toBe(
      10);
  });

  // <http://test/acl/#acl36>
  test('Ensure READ fails when Authorization exists for the parent container, but for anyUser', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/la_fabrique_des_mobilites>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl37>
  test('Ensure READ fails when Authorization exists for the parent container, but for another user', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/ademe>');
    expect(body.results.bindings.length).toBe(
      0);
  });

});