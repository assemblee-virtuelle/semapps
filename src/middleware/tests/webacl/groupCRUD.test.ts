import urlJoin from 'url-join';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';

jest.setTimeout(20000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  await broker.stop();
});

describe('middleware CRUD group with perms', () => {
  test('Ensure a call as anonymous to webacl.group.create succeeds', async () => {
    try {
      const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup5' });

      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup5'));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as user to webacl.group.create succeeds', async () => {
    try {
      const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup10', webId: 'http://test/user3' });

      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup10'));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call to webacl.group.addMember succeeds. checks also getMembers', async () => {
    try {
      await broker.call('webacl.group.addMember', { groupSlug: 'mygroup5', memberUri: 'http://test/user1' });
      await broker.call('webacl.group.addMember', { groupSlug: 'mygroup5', memberUri: 'http://test/user2' });

      const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup5' });

      expect(members).toEqual(expect.arrayContaining(['http://test/user1', 'http://test/user2']));
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as anonymous to webacl.group.delete fails - access denied', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup10' });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  }, 20000);

  test('Ensure a call as another user than creator to webacl.group.delete fails - access denied', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup10', webId: 'http://test/user2' });
    } catch (e) {
      expect(e.code).toEqual(403);
    }
  }, 20000);

  test('Ensure a call as user to webacl.group.delete succeeds', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup10', webId: 'http://test/user3' });
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);

  test('Ensure a call as anonymous to webacl.group.delete succeeds for a group created anonymously', async () => {
    try {
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup5' });
    } catch (e) {
      console.log(e);
      expect(e).toEqual(null);
    }
  }, 20000);
});
