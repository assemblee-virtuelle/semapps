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
describe('pentest for the ACL groups API', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure an injection with > in addMember fails', async () => {
    try {
      const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup1' });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup1'));

      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri: 'http://localhost:3000/users/info1'
      });
      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri:
          'http://localhost:3000/users/info2> } };CLEAR ALL;INSERT DATA{  GRAPH <http://semapps.org/webacl> { <http://test/injection> <http://you/have/been/hackedby> <http://anon'
      });

      try {
        const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      } catch (e) {
        console.log('YOU HAVE BEEN HACKED');
        console.log(e);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(e.code).toEqual(null);
      }
    } catch (e) {
      console.log(e);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(e.type).toEqual('SPARQL_INJECTION');

      const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ensure an injection with \\x3C in addMember fails', async () => {
    try {
      const res = await broker.call('webacl.group.create', { groupSlug: 'mygroup1' });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup1'));

      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri: 'http://localhost:3000/users/info1'
      });
      await broker.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri:
          'http://localhost:3000/users/info2\\x3C } };CLEAR ALL;INSERT DATA{  GRAPH <http://semapps.org/webacl> { <http://test/injection> <http://you/have/been/hackedby> <http://anon'
      });

      try {
        const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      } catch (e) {
        console.log('YOU HAVE BEEN HACKED');
        console.log(e);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(e.code).toEqual(null);
      }
    } catch (e) {
      console.log(e);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(e.type).toEqual('SPARQL_INJECTION');

      const members = await broker.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);
});
