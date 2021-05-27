const doRequest = require('./utils');
const CONFIG = require('../config');

const adminAuth = CONFIG.JENA_USER + ':' + CONFIG.JENA_PASSWORD;

async function readResource(user, resource) {
  return doRequest({
    endpoint: 'query',
    auth: adminAuth,
    user,
    sparql: 'SELECT ?predicate ?object WHERE { ' + resource + ' ?predicate ?object }'
  });
}

async function insertResource(user, resource) {
  return doRequest({
    endpoint: 'update',
    auth: adminAuth,
    user,
    sparql: 'INSERT DATA { ' + resource + ' <http://test/ns/property1> "ok" }'
  });
}

async function deleteResource(user, resource, predicate, object) {
  return doRequest({
    endpoint: 'update',
    auth: adminAuth,
    user,
    sparql: 'DELETE DATA { ' + resource + ' ' + predicate + ' ' + object + ' }'
  });
}

describe('fuseki ACL public anonymous user, default container access', () => {
  /////// ***** READ

  test('Ensure READ fails when no Authorization exists for the container', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/manufabrick>'
    );
    expect(body.results.bindings.length).toBe(0);
  });

  // <http://test/acl/#acl28>
  test('Ensure READ fails when Authorization exists for this container, but for anyUser', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/collectif_des_associations_citoyennes>'
    );
    expect(body.results.bindings.length).toBe(0);
  });

  // <http://test/acl/#acl29>
  test('Ensure READ fails when Authorization exists for this resource, but for another user', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/sciences_citoyennes>'
    );
    expect(body.results.bindings.length).toBe(0);
  });

  // <http://test/acl/#acl30>
  test('Ensure READ fails when Authorization exists for this container and for this user, but for mode:Append instead of mode:Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/territoires_zero_chomeurs_longue_duree>'
    );
    expect(body.results.bindings.length).toBe(0);
  });

  // <http://test/acl/#acl27>
  test('Ensure READ succeeds when Authorization exists for this container and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/la_coalition>'
    );
    expect(body.results.bindings.length).toBe(10);
  });

  // <http://test/acl/#acl31>
  test('Ensure READ succeeds when Authorization exists for this container and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/poles_en_pomme>'
    );
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(10);
  });

  // <http://test/acl/#acl32>
  test('Ensure READ succeeds when Authorization exists and has several perms for this container and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/open_opale>'
    );
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(10);
  });

  // <http://test/acl/#acl33>
  test('Ensure READ succeeds when Authorization exists and has several perms for several containers and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/officience>'
    );
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(14);
  });

  // <http://test/acl/#acl33>
  test('Ensure READ succeeds when Authorization exists and has several perms for several containers and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/cheznous_mareuil>'
    );
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(11);
  });

  // <http://test/acl/#acl34>
  test('Ensure READ succeeds when Authorization exists and has several perms for several containers and for several users, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/cheznous_mareuil>'
    );
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(11);
  });
});
