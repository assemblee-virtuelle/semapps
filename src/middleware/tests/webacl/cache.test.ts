import { MIME_TYPES } from '@semapps/mime-types';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

const alice = 'http://a/alice';
const bob = 'http://b/bob';

beforeAll(async () => {
  broker = await initialize('Memory');
});

afterAll(async () => {
  await broker.stop();
});

describe('Permissions are checked before the cache', () => {
  let resourceUri: string;

  beforeAll(async () => {
    resourceUri = await broker.call(
      'ldp.container.post',
      {
        resource: {
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
          '@type': 'Project',
          label: 'Private project'
        },
        contentType: MIME_TYPES.JSON,
        containerUri: `${CONFIG.HOME_URL}resources`
      },
      { meta: { webId: alice } }
    );

    await broker.call('webacl.resource.deleteAllRights', { resourceUri }, { meta: { webId: 'system' } });
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      newRights: { user: { uri: alice, read: true, write: true } },
      webId: 'system'
    });
  });

  test('A cached resource cannot be read without permission', async () => {
    await expect(
      broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON }, { meta: { webId: alice } })
    ).resolves.toMatchObject({ 'pair:label': 'Private project' });

    // Now in cache
    await expect(
      broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON }, { meta: { webId: bob } })
    ).rejects.toMatchObject({ code: 403 });

    await expect(
      broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON }, { meta: { webId: 'anon' } })
    ).rejects.toMatchObject({ code: 403 });
  });

  test('A resource cannot be modified without permission', async () => {
    const triple = {
      subject: { termType: 'NamedNode', value: resourceUri },
      predicate: { termType: 'NamedNode', value: 'http://virtual-assembly.org/ontologies/pair#description' },
      object: { termType: 'Literal', value: 'Modified' }
    };

    await expect(
      broker.call('ldp.resource.patch', { resourceUri, triplesToAdd: [triple] }, { meta: { webId: bob } })
    ).rejects.toMatchObject({ code: 403 });

    await expect(
      broker.call('ldp.resource.patch', { resourceUri, triplesToAdd: [triple] }, { meta: { webId: alice } })
    ).resolves.not.toThrow();
  });
});
