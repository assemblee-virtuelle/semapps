import initialize from './initialize.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(10000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize();
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
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

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Get container path', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test.each(Object.keys(successCases))('Success with resourceType %s', async (resourceType: any) => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.container.getPath', { resourceType })).resolves.toBe(successCases[resourceType]);
  });
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test.each(Object.keys(errorCases))('Error With resourceType %s', async (resourceType: any) => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    await expect(broker.call('ldp.container.getPath', { resourceType })).rejects.toThrow(errorCases[resourceType]);
  });
});
