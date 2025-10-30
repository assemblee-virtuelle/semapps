import { ControlledResourceMixin } from '@semapps/ldp';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { fetchServer, createAccount } from '../utils.ts';

jest.setTimeout(50000);
let broker: ServiceBroker;
let alice: any;

describe.each([false, true])('ControlledResourceMixin with allowSlugs: %s', (allowSlugs: boolean) => {
  beforeAll(async () => {
    broker = await initialize(allowSlugs);

    broker.createService({
      name: 'address-book',
      mixins: [ControlledResourceMixin],
      settings: {
        path: 'address-book',
        types: ['vcard:AddressBook'],
        permissions: {
          anon: {
            read: true
          }
        }
      },
      hooks: {
        after: {
          async get(ctx, res) {
            res['vcard:note'] = 'This is added by the service';
            return res;
          }
        }
      }
    });

    await broker.start();
    alice = await createAccount(broker, 'alice');
  });

  afterAll(async () => {
    if (broker) await broker.stop();
  });

  let controlledResourceUri: string;

  test('Get the controlled resource', async () => {
    await alice.call('address-book.waitForCreation');

    controlledResourceUri = await alice.call('address-book.getUri');
    expect(controlledResourceUri).not.toBeUndefined();

    await expect(alice.call('address-book.get')).resolves.toMatchObject({
      type: 'vcard:AddressBook',
      'vcard:note': 'This is added by the service'
    });
  });

  test('Get the controlled resource through API', async () => {
    await expect(fetchServer(controlledResourceUri)).resolves.toMatchObject({
      status: 200,
      json: {
        type: 'vcard:AddressBook',
        'vcard:note': 'This is added by the service'
      }
    });
  });
});
