import { MIME_TYPES } from '@semapps/mime-types';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

const alice = 'http://a/alice';
const bob = 'http://b/bob';
const app = 'http://app.example/app.json';
const otherApp = 'http://other-app.example/app.json';

// Applications registered by each user
const registrations: Record<string, string[]> = { [alice]: [app], [bob]: [] };

beforeAll(async () => {
  broker = await initialize('Memory');
  broker.createService({
    name: 'registrations',
    dependencies: ['permissions'],
    async started() {
      await this.broker.call('permissions.addClientAuthorizer', { actionName: 'registrations.authorize' });
    },
    actions: {
      authorize(ctx: any) {
        return registrations[ctx.params.webId]?.includes(ctx.params.clientId) ?? false;
      }
    }
  });
  await broker.waitForServices(['registrations']);
});

afterAll(async () => {
  await broker.stop();
});

describe('Rights of an application acting on behalf of a user', () => {
  let resourceUri: string;

  const get = (meta: any) => broker.call('ldp.resource.get', { resourceUri, accept: MIME_TYPES.JSON }, { meta });

  beforeAll(async () => {
    resourceUri = await broker.call(
      'ldp.container.post',
      {
        resource: {
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
          '@type': 'Project',
          label: 'Shared project'
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

  test('The application needs its own rights', async () => {
    await expect(get({ webId: alice })).resolves.toMatchObject({ 'pair:label': 'Shared project' });

    // Now in cache
    await expect(get({ webId: alice, clientId: app })).rejects.toMatchObject({ code: 403 });

    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: { user: { uri: app, read: true } },
      webId: 'system'
    });

    await expect(get({ webId: alice, clientId: app })).resolves.toMatchObject({ 'pair:label': 'Shared project' });
  });

  test('The rights of the application are limited to those of the user', async () => {
    await expect(get({ webId: bob, clientId: app })).rejects.toMatchObject({ code: 403 });
    await expect(get({ webId: 'anon', clientId: app })).rejects.toMatchObject({ code: 403 });
  });

  test('The rights of the user are limited to those of the application', async () => {
    const triple = {
      subject: { termType: 'NamedNode', value: resourceUri },
      predicate: { termType: 'NamedNode', value: 'http://virtual-assembly.org/ontologies/pair#description' },
      object: { termType: 'Literal', value: 'Modified' }
    };

    await expect(
      broker.call(
        'ldp.resource.patch',
        { resourceUri, triplesToAdd: [triple] },
        { meta: { webId: alice, clientId: app } }
      )
    ).rejects.toMatchObject({ code: 403 });
  });

  test('The application must be registered by the user', async () => {
    await broker.call('webacl.resource.addRights', {
      resourceUri,
      additionalRights: { user: { uri: otherApp, read: true } },
      webId: 'system'
    });

    await expect(get({ webId: alice, clientId: otherApp })).rejects.toMatchObject({ code: 403 });

    // Without client, the other app acts on its own name
    await expect(get({ webId: otherApp })).resolves.toMatchObject({ 'pair:label': 'Shared project' });
  });

  test('An explicit webId for another user ignores the client', async () => {
    await expect(
      broker.call(
        'permissions.has',
        { uri: resourceUri, mode: 'acl:Read', webId: alice },
        { meta: { webId: bob, clientId: app } }
      )
    ).resolves.toBe(true);

    await expect(
      broker.call(
        'permissions.has',
        { uri: resourceUri, mode: 'acl:Write', webId: alice },
        { meta: { webId: alice, clientId: app } }
      )
    ).resolves.toBe(false);
  });
});
