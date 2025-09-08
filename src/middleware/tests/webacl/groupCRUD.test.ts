import urlJoin from 'url-join';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';
import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(20000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('middleware CRUD group with perms', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call as anonymous to webacl.group.create succeeds', async () => {
    const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup5' });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup5'));
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call as user to webacl.group.create succeeds', async () => {
    const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup10', webId: 'http://test/user3' });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup10'));
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call to webacl.group.addMember succeeds. checks also getMembers', async () => {
    await broker.call('webacl.group.addMember', { groupSlug: 'mygroup5', memberUri: 'http://test/user1' });
    await broker.call('webacl.group.addMember', { groupSlug: 'mygroup5', memberUri: 'http://test/user2' });

    const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup5' });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(members).toEqual(expect.arrayContaining(['http://test/user1', 'http://test/user2']));
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call as anonymous to webacl.group.delete fails - access denied', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('webacl.group.delete', { groupSlug: 'mygroup10' })).rejects.toThrow();
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call as another user than creator to webacl.group.delete fails - access denied', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.group.delete', { groupSlug: 'mygroup10', webId: 'http://test/user2' })
    ).rejects.toThrow();
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call as user to webacl.group.delete succeeds', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(
      broker.call('webacl.group.delete', { groupSlug: 'mygroup10', webId: 'http://test/user3' })
    ).resolves.not.toThrow();
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure a call as anonymous to webacl.group.delete succeeds for a group created anonymously', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('webacl.group.delete', { groupSlug: 'mygroup5' })).resolves.not.toThrow();
  }, 20000);
});
