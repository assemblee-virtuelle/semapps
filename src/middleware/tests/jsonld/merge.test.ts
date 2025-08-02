import initialize from '../ontologies/initialize.ts';

jest.setTimeout(10000);
let broker: any;

beforeAll(async () => {
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
  broker = await initialize(false, false);
});

afterAll(async () => {
  if (broker) await broker.stop();
});

const testCases = {
  'url/null': {
    a: 'https://www.w3.org/ns/ontology1',
    expected: 'https://www.w3.org/ns/ontology1'
  },
  'null/url': {
    b: 'https://www.w3.org/ns/ontology2',
    expected: 'https://www.w3.org/ns/ontology2'
  },
  'url/url': {
    a: 'https://www.w3.org/ns/ontology1',
    b: 'https://www.w3.org/ns/ontology2',
    expected: ['https://www.w3.org/ns/ontology1', 'https://www.w3.org/ns/ontology2']
  },
  'url/array': {
    a: 'https://www.w3.org/ns/ontology1',
    b: ['https://www.w3.org/ns/ontology2', 'https://www.w3.org/ns/ontology3'],
    expected: ['https://www.w3.org/ns/ontology1', 'https://www.w3.org/ns/ontology2', 'https://www.w3.org/ns/ontology3']
  },
  'array/array': {
    a: ['https://www.w3.org/ns/ontology1', 'https://www.w3.org/ns/ontology2'],
    b: ['https://www.w3.org/ns/ontology3', 'https://www.w3.org/ns/ontology4'],
    expected: [
      'https://www.w3.org/ns/ontology1',
      'https://www.w3.org/ns/ontology2',
      'https://www.w3.org/ns/ontology3',
      'https://www.w3.org/ns/ontology4'
    ]
  },
  'array/object': {
    a: ['https://www.w3.org/ns/ontology1', 'https://www.w3.org/ns/ontology2'],
    b: {
      ont3: 'https://www.w3.org/ns/ontology3#',
      friend: {
        '@id': 'ont3:friend',
        '@type': '@id'
      }
    },
    expected: [
      'https://www.w3.org/ns/ontology1',
      'https://www.w3.org/ns/ontology2',
      {
        ont3: 'https://www.w3.org/ns/ontology3#',
        friend: {
          '@id': 'ont3:friend',
          '@type': '@id'
        }
      }
    ]
  },
  'url/object': {
    a: 'https://www.w3.org/ns/ontology2',
    b: {
      ont3: 'https://www.w3.org/ns/ontology3#'
    },
    expected: [
      'https://www.w3.org/ns/ontology2',
      {
        ont3: 'https://www.w3.org/ns/ontology3#'
      }
    ]
  },
  'object/object': {
    a: { ont2: 'https://www.w3.org/ns/ontology2#' },
    b: {
      ont3: 'https://www.w3.org/ns/ontology3#',
      friend: {
        '@id': 'ont3:friend',
        '@type': '@id'
      }
    },
    expected: {
      ont2: 'https://www.w3.org/ns/ontology2#',
      ont3: 'https://www.w3.org/ns/ontology3#',
      friend: {
        '@id': 'ont3:friend',
        '@type': '@id'
      }
    }
  },
  'array-with-object/object': {
    a: [{ ont1: 'https://www.w3.org/ns/ontology1#' }, 'https://www.w3.org/ns/ontology2'],
    b: {
      ont3: 'https://www.w3.org/ns/ontology3#',
      friend: {
        '@id': 'ont3:friend',
        '@type': '@id'
      }
    },
    expected: [
      'https://www.w3.org/ns/ontology2',
      {
        ont1: 'https://www.w3.org/ns/ontology1#',
        ont3: 'https://www.w3.org/ns/ontology3#',
        friend: {
          '@id': 'ont3:friend',
          '@type': '@id'
        }
      }
    ]
  }
};

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test.each(Object.keys(testCases))('Merging %s JSON-LD contexts', async (key: any) => {
  const newContext = await broker.call('jsonld.context.merge', {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    a: testCases[key].a,
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    b: testCases[key].b
  });
  // @ts-expect-error TS(2304): Cannot find name 'expect'.
  expect(newContext).toEqual(testCases[key].expected);
});
