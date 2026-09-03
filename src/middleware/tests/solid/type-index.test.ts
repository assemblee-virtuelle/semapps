import waitForExpect from 'wait-for-expect';
import { ServiceBroker } from 'moleculer';
import initialize from './initialize.ts';
import { createAccount } from '../utils.ts';

jest.setTimeout(80000);

describe.each([true])('TypeIndex tests with allowSlugs: %s', (allowSlugs: boolean) => {
  let broker: ServiceBroker;
  let alice: any;

  beforeAll(async () => {
    broker = await initialize(allowSlugs);
    await broker.start();
    alice = await createAccount(broker, 'alice');
  }, 80000);

  afterAll(async () => {
    await broker.stop();
  });

  test('Public TypeIndex has been created', async () => {
    expect(alice['solid:publicTypeIndex']).not.toBeNull();

    // TypeRegistrations take time to be populated
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const typeIndex = await alice.call('public-type-index.get');

      expect(typeIndex['@graph']).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            'solid:forClass': 'foaf:Agent',
            'solid:instance': alice.webId
          }),
          expect.objectContaining({
            'solid:forClass': expect.arrayContaining(['solid:TypeIndex', 'solid:ListedDocument']),
            'solid:instance': expect.anything()
          })
        ])
      );
    });
  });

  test('Private TypeIndex has been created', async () => {
    // expect(alice['solid:publicTypeIndex']).not.toBeNull();

    // TypeRegistrations take time to be populated
    // @ts-expect-error This expression is not callable
    await waitForExpect(async () => {
      const typeIndex = await alice.call('private-type-index.get');

      expect(typeIndex['@graph']).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            'solid:forClass': expect.arrayContaining(['solid:TypeIndex', 'solid:UnlistedDocument']),
            'solid:instance': expect.anything()
          })
        ])
      );
    });
  });
});
