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

describe('fuseki ACL public anonymous user, direct accessTo resource', () => {

  /////// ***** READ

  // <http://test/acl/#acl5>
  test('Ensure READ fails when Authorization exists for this resource and for this user, with a mode.Read, but tuple saved in defaultGraph', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/babalex>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  test('Ensure READ fails when no Authorization exists for the resource', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/transiscope>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl1>
  test('Ensure READ fails when Authorization exists for this resource, but for anyUser', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/assemblee_virtuelle>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl2>
  test('Ensure READ fails when Authorization exists for this resource, but for another user', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/el_capitan>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl3>
  test('Ensure READ fails when Authorization exists for this resource and for this user, but for mode:Append instead of mode:Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/la_bascule>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl4>
  test('Ensure READ succeeds when Authorization exists for this resource and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/villes_et_territoires_en_transition>');
    expect(body.results.bindings.length).toBe(
      10);
  });

  // <http://test/acl/#acl6>
  test('Ensure READ succeeds when Authorization exists for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/reconnexion>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      12);
  });

  // <http://test/acl/#acl7>
  test('Ensure READ succeeds when Authorization exists and has several perms for this resource and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/atd_quart-monde>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });

  // <http://test/acl/#acl8>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resource and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/faire_ecole_ensemble>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      13);
  });

  // <http://test/acl/#acl9>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resources and for several users, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/open_atlas>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });


  ////// **** INSERT

  test('Ensure INSERT fails when no Authorization exists for the resource', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/transiscope>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl10>
  test('Ensure INSERT fails when Authorization exists for this resource, but for anyUser', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/nature-en-occitanie>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl11>
  test('Ensure INSERT fails when Authorization exists for this resource, but for another user', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/mes-occitanie>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl4>
  test('Ensure INSERT fails when Authorization exists for this resource and for this user, but for mode:Read instead of mode:Write', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/villes_et_territoires_en_transition>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl6>
  test('Ensure INSERT succeeds when Authorization exists for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/reconnexion>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl14>
  test('Ensure INSERT succeeds when Authorization exists for this resource and for this user, with a mode.Append', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/semwebpro>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl7>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/atd_quart-monde>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl8>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/faire_ecole_ensemble>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl9>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resources and for several users, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/open_atlas>');
      expect(statusCode).toBe(200);
  });


  ////// **** DELETE

  test('Ensure DELETE fails when no Authorization exists for the resource', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/transiscope>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"Transiscope"');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl4>
  test('Ensure DELETE fails when Authorization exists for this resource, but for anyUser', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/villes_et_territoires_en_transition>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"Villes et territoires en transition"'
      );
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl1>
  test('Ensure DELETE fails when Authorization exists for this resource and for this user, but with a mode.Read', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/assemblee_virtuelle>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"Assemblée Virtuelle"'
      );
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl11>
  test('Ensure DELETE fails when Authorization exists for this resource, but for another user', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/mes-occitanie>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"MES Occitanie"');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl6>
  test('Ensure DELETE succeeds when Authorization exists for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/reconnexion>',
      "<http://test/ns/property1>",
      '"ok"'
      );
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl14>
  test('Ensure DELETE fails when Authorization exists for this resource and for this user, but with a mode.Append', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/semwebpro>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"SemWebPro"'
      );
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl7>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/atd_quart-monde>',
      "<http://test/ns/property1>",
      '"ok"');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl8>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/faire_ecole_ensemble>',
      "<http://test/ns/property1>",
      '"ok"');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl9>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resources and for several users, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'anon',
      '<https://data.virtual-assembly.org/organizations/open_atlas>',
      "<http://test/ns/property1>",
      '"ok"');
      expect(statusCode).toBe(200);
  });
});