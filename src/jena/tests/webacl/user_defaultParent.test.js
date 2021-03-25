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

describe('fuseki ACL user, default parent container access', () => {
  /////// ***** READ

  test('Ensure READ fails when no Authorization exists for the parent container', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/picasoft>'
    );
    expect(body.results.bindings.length).toBe(0);
  });

  // <http://test/acl/#acl38>
  test('Ensure READ succeeds when Authorization exists for the parent container and for this user, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/la_myne>'
    );
    expect(body.results.bindings.length).toBe(14);
  });

  // <http://test/acl/#acl39>
  test('Ensure READ succeeds when Authorization exists for the parent container, for anyUser', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/wemob>'
    );
    expect(body.results.bindings.length).toBe(10);
  });

  // <http://test/acl/#acl40>
  test('Ensure READ fails when Authorization exists for for the parent container, but for another user', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/mob-ion>'
    );
    expect(body.results.bindings.length).toBe(0);
  });

  // <http://test/acl/#acl41>
  test('Ensure READ succeeds when Authorization exists for the parent container and for this user in the group, with a mode.Read', async () => {
    const { body, statusCode } = await readResource(
      'https://data.virtual-assembly.org/users/sebastien.rosset',
      '<https://data.virtual-assembly.org/organizations/cheznous>'
    );
    expect(body.results.bindings.length).toBeGreaterThanOrEqual(10);
  });
});
