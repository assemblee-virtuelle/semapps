import { ControlledResourceMixin } from '@semapps/ldp';
import initialize from './initialize.ts';
import { fetchServer } from '../utils.ts';

jest.setTimeout(50000);
let broker: any;

describe.each([false, true])('ControlledResourceMixin with allowSlugs: %s', (allowSlugs: boolean) => {
  beforeAll(async () => {
    broker = await initialize(allowSlugs);

    broker.createService({
      name: 'address-book',
      mixins: [ControlledResourceMixin],
      settings: {
        slug: 'address-book',
        initialValue: {
          '@type': 'vcard:AddressBook',
          'vcard:title': 'My address book'
        },
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
  });

  afterAll(async () => {
    if (broker) await broker.stop();
  });

  let controlledResourceUri: string;

  test('Get the controlled resource', async () => {
    await broker.call('address-book.waitForCreation');

    controlledResourceUri = await broker.call('address-book.getUri');
    expect(controlledResourceUri).not.toBeUndefined();

    await expect(broker.call('address-book.get')).resolves.toMatchObject({
      type: 'vcard:AddressBook',
      'vcard:title': 'My address book',
      'vcard:note': 'This is added by the service'
    });
  });

  test('Get the controlled resource through API', async () => {
    await expect(fetchServer(controlledResourceUri)).resolves.toMatchObject({
      status: 200,
      json: {
        type: 'vcard:AddressBook',
        'vcard:title': 'My address book',
        'vcard:note': 'This is added by the service'
      }
    });
  });
});
