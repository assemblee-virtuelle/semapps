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


describe('fuseki ACL logged-in user Agent, direct accessTo resource', () => {

  /////// ***** READ


  // <http://test/acl/#acl1>
  test('Ensure READ succeeds when Authorization exists for this resource for anyUser', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/assemblee_virtuelle>');
    expect(body.results.bindings.length).toBe(
      37);
  });

  // <http://test/acl/#acl2>
  test('Ensure READ fails when Authorization exists for this resource, but for another user', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/el_capitan>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl15>
  test('Ensure READ fails when Authorization exists for this resource and for any user, but for mode:Append instead of mode:Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/coopaname_-cae>');
    expect(body.results.bindings.length).toBe(
      0);
  });

  // <http://test/acl/#acl6>
  test('Ensure READ succeeds when Authorization exists for this resource and for anonymous user, with a mode.Write', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/reconnexion>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      12);
  });

  // <http://test/acl/#acl10>
  test('Ensure READ succeeds when Authorization exists for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/nature-en-occitanie>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      13);
  });

  // <http://test/acl/#acl16>
  test('Ensure READ succeeds when Authorization exists and has several perms for this resource and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/paquerette_-chatons>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });

  // <http://test/acl/#acl17>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resource and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/_dialogue-design>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });

  // <http://test/acl/#acl18>
  test('Ensure READ succeeds when Authorization exists and has several perms for several resources and for several users, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/odass>');
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(
      10);
  });


  ////// **** INSERT

  test('Ensure INSERT fails when no Authorization exists for the resource', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/transiscope>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl10>
  test('Ensure INSERT succeeds when Authorization exists for this resource, for anyUser', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/nature-en-occitanie>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl6>
  test('Ensure INSERT succeeds when Authorization exists for this resource, for anonymous user', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/reconnexion>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl11>
  test('Ensure INSERT fails when Authorization exists for this resource, but for another user', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/mes-occitanie>');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl1>
  test('Ensure INSERT fails when Authorization exists for this resource and for this user, but for mode:Read instead of mode:Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/assemblee_virtuelle>');
    expect(statusCode).toBe(403);
  });

  // // <http://test/acl/#acl10>
  // test('Ensure INSERT succeeds when Authorization exists for this resource and for this user, with a mode.Write', async () => {
  //   const { body, statusCode } = await insertResource(
  //     'https://data.virtual-assembly.org/users/guillaume.rouyer',
  //     '<https://data.virtual-assembly.org/organizations/nature-en-occitanie>');
  //   expect(statusCode).toBe(200);
  // });

  // <http://test/acl/#acl15>
  test('Ensure INSERT succeeds when Authorization exists for this resource and for this user, with a mode.Append', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/coopaname_-cae>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl16>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/paquerette_-chatons>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl17>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/_dialogue-design>');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl18>
  test('Ensure INSERT succeeds when Authorization exists and has several perms for several resources and for several users, with a mode.Write', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/odass>');
      expect(statusCode).toBe(200);
  });


//   ////// **** DELETE

  test('Ensure DELETE fails when no Authorization exists for the resource', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/transiscope>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"Transiscope"');
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl10>
  test('Ensure DELETE succeeds when Authorization exists for this resource, for anyUser', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/nature-en-occitanie>',
      "<http://test/ns/property1>",
      '"ok"'
      );
    expect(statusCode).toBe(200);
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
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/mes-occitanie>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"MES Occitanie"');
    expect(statusCode).toBe(403);
  });

  // // <http://test/acl/#acl10>
  // test('Ensure DELETE succeeds when Authorization exists for this resource and for this user, with a mode.Write', async () => {
  //   const { body, statusCode } = await deleteResource(
  //     'https://data.virtual-assembly.org/users/guillaume.rouyer',
  //     '<https://data.virtual-assembly.org/organizations/nature-en-occitanie>',
  //     "<http://test/ns/property1>",
  //     '"ok"'
  //     );
  //   expect(statusCode).toBe(200);
  // });

  // <http://test/acl/#acl15>
  test('Ensure DELETE fails when Authorization exists for this resource and for this user, but with a mode.Append', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/coopaname_-cae>',
      "<http://virtual-assembly.org/ontologies/pair#label>",
      '"Coopaname (CAE)"'
      );
    expect(statusCode).toBe(403);
  });

  // <http://test/acl/#acl16>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for this resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/paquerette_-chatons>',
      "<http://test/ns/property1>",
      '"ok"');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl17>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resource and for this user, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/_dialogue-design>',
      "<http://test/ns/property1>",
      '"ok"');
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl18>
  test('Ensure DELETE succeeds when Authorization exists and has several perms for several resources and for several users, with a mode.Write', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/odass>',
      "<http://test/ns/property1>",
      '"ok"');
      expect(statusCode).toBe(200);
  });
 });