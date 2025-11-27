import urlJoin from 'url-join';
import { ServiceBroker } from 'moleculer';
import * as CONFIG from '../config.ts';
import initialize from './initialize.ts';
import { createAccount } from '../utils.ts';

jest.setTimeout(20000);

let broker: ServiceBroker;
let alice: any;

beforeAll(async () => {
  broker = await initialize();
  await broker.start();
  alice = await createAccount(broker, 'alice');
});

afterAll(async () => {
  await broker.stop();
});

describe('pentest for the ACL groups API', () => {
  test('Ensure an injection with > in addMember fails', async () => {
    try {
      const res = await alice.call('webacl.group.create', { groupSlug: 'mygroup1' });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup1'));

      await alice.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri: 'http://localhost:3000/users/info1'
      });
      await alice.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri:
          'http://localhost:3000/users/info2> } };CLEAR ALL;INSERT DATA{  GRAPH <http://semapps.org/webacl> { <http://test/injection> <http://you/have/been/hackedby> <http://anon'
      });

      try {
        const members = await alice.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      } catch (e) {
        console.log('YOU HAVE BEEN HACKED');
        console.log(e);
        expect(e.code).toEqual(null);
      }
    } catch (e) {
      console.log(e);
      expect(e.type).toEqual('SPARQL_INJECTION');

      const members = await alice.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await alice.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);

  test('Ensure an injection with \\x3C in addMember fails', async () => {
    try {
      const res = await alice.call('webacl.group.create', { groupSlug: 'mygroup1' });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(res.groupUri).toBe(urlJoin(CONFIG.HOME_URL, '_groups', 'mygroup1'));

      await alice.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri: 'http://localhost:3000/users/info1'
      });
      await alice.call('webacl.group.addMember', {
        groupSlug: 'mygroup1',
        memberUri:
          'http://localhost:3000/users/info2\\x3C } };CLEAR ALL;INSERT DATA{  GRAPH <http://semapps.org/webacl> { <http://test/injection> <http://you/have/been/hackedby> <http://anon'
      });

      try {
        const members = await alice.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      } catch (e) {
        console.log('YOU HAVE BEEN HACKED');
        console.log(e);
        expect(e.code).toEqual(null);
      }
    } catch (e) {
      console.log(e);
      expect(e.type).toEqual('SPARQL_INJECTION');

      const members = await alice.call('webacl.group.getMembers', { groupSlug: 'mygroup1' });
      expect(members).toEqual(expect.arrayContaining(['http://localhost:3000/users/info1']));

      // clean up
      await alice.call('webacl.group.delete', { groupSlug: 'mygroup1' });
    }
  }, 20000);
});
