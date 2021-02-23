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


describe('fuseki ACL group agentGroup, direct accessTo resource', () => {

  /////// ***** READ


  // <http://test/acl/#acl1>
  test('Ensure READ succeeds when Authorization exists for this resource for anyUser', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/assemblee_virtuelle>');
    expect(body.results.bindings.length).toBe(
      37);
  });

  // <http://test/acl/#acl12>
  test('Ensure READ fails when Authorization exists for this resource, but for another user in the group', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/startin-blox1>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl13>
  test('Ensure READ fails when Authorization exists for this resource and for this user in the group, but for mode:Append instead of mode:Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/solucracy1>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl19>
  test('Ensure READ succeeds when Authorization exists for this resource and for this user in the group, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/la_coop_des_territoires>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      15);
  });

  // <http://test/acl/#acl20>
  test('Ensure READ succeeds when Authorization exists for this resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/coliving_el_capitan>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      14);
  });

  // <http://test/acl/#acl21>
  test('Ensure READ succeeds when Authorization exists and has several perms for this resource and for this user in the group, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/neurotechx_paris>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });

  // <http://test/acl/#acl22>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resource and for this user in the group, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/ecorhizo>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });

  // <http://test/acl/#acl23>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resources and for several users in the group, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/franck.calis',
      '<https://data.virtual-assembly.org/organizations/data_players>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      17);
  });

  // <http://test/acl/#acl24>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resources and for several users in several groups, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/jeremy.dufraisse',
      '<https://data.virtual-assembly.org/organizations/addes>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      13);
  });

  test('Ensure READ fails when Authorization exists and for another user in another group not, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/margaux.schulz',
      '<https://data.virtual-assembly.org/organizations/recma>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      0);
  });


  ////// **** INSERT

  // <http://test/acl/#acl26>
  test('Ensure INSERT fails when Authorization exists for this resource, but for another user (agent) in same group', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/margaux.schulz',
      '<https://data.virtual-assembly.org/organizations/marsnet>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl25>
  test('Ensure INSERT fails when Authorization exists for this resource, but for another user in different group', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/mes>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl19>
  test('Ensure INSERT fails when Authorization exists for this resource and for this user in the group, but for mode:Read instead of mode:Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/la_coop_des_territoires>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl20>
  test('Ensure INSERT succeeds when Authorization exists for this resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/coliving_el_capitan>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl13>
  test('Ensure INSERT succeeds when Authorization exists for this resource and for this user in the group, with a mode.Append', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/solucracy1>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl21>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for this resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/neurotechx_paris>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl22>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/ecorhizo>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl23>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resources and for several users in the group, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/franck.calis',
      '<https://data.virtual-assembly.org/organizations/recma>');
      expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl24>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resources and for several users in several groups, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/jeremy.dufraisse',
      '<https://data.virtual-assembly.org/organizations/haut_conseil_a_la_vie_associative>');
      expect(statusCode).toBe(200);
  });


  ////// **** DELETE

  // <http://test/acl/#acl19>
  test('Ensure DELETE fails when Authorization exists for this resource and for this user in the group, but with a mode.Read', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/la_coop_des_territoires>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"La Coop des Territoires"'
      );
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl25>
  test('Ensure DELETE fails when Authorization exists for this resource, but for another user in another group', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/mes>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"MES"');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl20>
  test('Ensure DELETE succeeds when Authorization exists for this resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/coliving_el_capitan>',
      "<http://test/ns/property1>",
      '"ok"'
      );
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl15>
  test('Ensure DELETE fails when Authorization exists for this resource and for this user in the group, but with a mode.Append', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/solucracy1>',
      "<http://test/ns/property1>",
      '"ok"'
      );
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl21>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for this resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/neurotechx_paris>',
      "<http://test/ns/property1>",
      '"ok"');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl22>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resource and for this user in the group, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/ecorhizo>',
      "<http://test/ns/property1>",
      '"ok"');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl23>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resources and for several users in the group, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/franck.calis',
      '<https://data.virtual-assembly.org/organizations/recma>',
      "<http://test/ns/property1>",
      '"ok"');
      expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl24>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resources and for several users in several groups, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/jeremy.dufraisse',
      '<https://data.virtual-assembly.org/organizations/haut_conseil_a_la_vie_associative>',
      "<http://test/ns/property1>",
      '"ok"');
      expect(statusCode).toBe(200);
  });
 });

 