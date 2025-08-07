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

describe('pentest for the ACL groups API', () => {
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
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);

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
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await broker.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);
});
