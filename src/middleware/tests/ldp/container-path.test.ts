import initialize from './initialize.ts';

jest.setTimeout(10000);
let broker: any;

beforeAll(async () => {
  broker = await initialize();
});

afterAll(async () => {
  if (broker) await broker.stop();
});

const successCases = {
  'ldp:Container': '/ldp/container',
  'http://www.w3.org/ns/ldp#Container': '/ldp/container',
  'pair:ProjectType': '/pair/project-type',
  'http://virtual-assembly.org/ontologies/pair#ProjectType': '/pair/project-type'
};

const errorCases = {
  randomString: 'The resourceType must an URI or prefixed type. Provided: randomString',
  'test:': 'The resourceType must an URI or prefixed type. Provided: test:',
  ':test': 'The resourceType must an URI or prefixed type. Provided: :test',
  'unknown:Event': 'No registered ontology found for resourceType unknown:Event',
  'http://www.w3.org/ns/unknown#Event':
    'No registered ontology found for resourceType http://www.w3.org/ns/unknown#Event'
};

describe('Get container path', () => {
  test.each(Object.keys(successCases))('Success with resourceType %s', async (resourceType: any) => {
    // @ts-expect-error
    await expect(broker.call('ldp.container.getPath', { resourceType })).resolves.toBe(successCases[resourceType]);
  });

  test.each(Object.keys(errorCases))('Error With resourceType %s', async (resourceType: any) => {
    // @ts-expect-error
    await expect(broker.call('ldp.container.getPath', { resourceType })).rejects.toThrow(errorCases[resourceType]);
  });
});
