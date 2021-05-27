const doRequest = require('./utils');
const CONFIG = require('../config');

const adminAuth = CONFIG.JENA_USER + ':' + CONFIG.JENA_PASSWORD;

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

describe('fuseki ACL DELETE INSERT on a resource with perms only Append should fail and rollback', () => {
  // <http://test/acl/#acl15>
  test('Ensure INSERT succeeds when Authorization exists for this resource and for this user, with a mode.Append', async () => {
    const { body, statusCode } = await insertResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/coopaname_-cae>'
    );
    expect(statusCode).toBe(200);
  });

  // <http://test/acl/#acl15>
  test('Ensure DELETE fails when Authorization exists for this resource and for this user, but with a mode.Append', async () => {
    const { body, statusCode } = await deleteResource(
      'https://data.virtual-assembly.org/users/guillaume.rouyer',
      '<https://data.virtual-assembly.org/organizations/coopaname_-cae>',
      '<http://virtual-assembly.org/ontologies/pair#label>',
      '"Coopaname (CAE)"'
    );
    expect(statusCode).toBe(403);
  });

  test('Ensure DELETE INSERT fails when Authorization exists for this resource and for this user, but with a mode.Append', async () => {
    const { body, statusCode } = await doRequest({
      endpoint: 'update',
      auth: adminAuth,
      user: 'https://data.virtual-assembly.org/users/guillaume.rouyer',
      sparql:
        'DELETE { <https://data.virtual-assembly.org/organizations/coopaname_-cae> <http://virtual-assembly.org/ontologies/pair#label> "Coopaname (CAE)" }' +
        'INSERT { <https://data.virtual-assembly.org/organizations/coopaname_-cae> <http://test/anothername> "The wrong name" }' +
        'WHERE {}'
    });
    expect(statusCode).toBe(403);
  });
});
