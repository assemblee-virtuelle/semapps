const initialize = require('./initialize');
// const initialize = require('./initialize-old');

jest.setTimeout(30000);

describe.each([
  'fuseki',
  'ng',
])('Triplestore service tests with %s', triplestore => {
  let broker;
  const testDataset = 'test_dataset';

  beforeAll(async () => {
    broker = await initialize(triplestore);
    // Ensure the test dataset exists
    await broker.call('triplestore.dataset.create', { dataset: testDataset });
  });

  afterAll(async () => {
    // Clean up test dataset
    try {
      await broker.call('triplestore.dataset.delete', {
        dataset: testDataset,
        iKnowWhatImDoing: true
      });
    } catch (error) {
      // Dataset might not exist, ignore error
    }
    if (broker) await broker.stop();
  });

  beforeEach(async () => {
    // Clear the test dataset before each test
    await broker.call('triplestore.dropAll', { dataset: testDataset });
  });

  describe('Dataset subservice', () => {
    const testDatasetForSubServiceTests = 'test_dataset_for_sub_service_tests';

    test('Create a new dataset', async () => {
      // Delete if exists
      try {
        await broker.call('triplestore.dataset.delete', {
          dataset: testDatasetForSubServiceTests,
          iKnowWhatImDoing: true
        });
      } catch (error) {
        // Intentionally ignore errors if dataset does not exist
      }
      await broker.call('triplestore.dataset.create', { dataset: testDatasetForSubServiceTests });
      await expect(broker.call('triplestore.dataset.exist', { dataset: testDatasetForSubServiceTests })).resolves.toBeTruthy();
    });

    test('Check dataset existence', async () => {
      // Test non-existent dataset
      await expect(broker.call('triplestore.dataset.exist', { dataset: 'non_existent_dataset' })).resolves.toBeFalsy();
      // Create and test existing dataset
      await broker.call('triplestore.dataset.create', { dataset: testDataset });
      await expect(broker.call('triplestore.dataset.exist', { dataset: testDataset })).resolves.toBeTruthy();
    });

    test('List datasets', async () => {
      const datasets = await broker.call('triplestore.dataset.list');
      expect(Array.isArray(datasets)).toBeTruthy();
      expect(datasets).toContain(testDataset);
    });

    test('Delete dataset', async () => {
      await broker.call('triplestore.dataset.create', { dataset: testDatasetForSubServiceTests });
      await expect(broker.call('triplestore.dataset.exist', { dataset: testDatasetForSubServiceTests })).resolves.toBeTruthy();
      await broker.call('triplestore.dataset.delete', {
        dataset: testDatasetForSubServiceTests,
        iKnowWhatImDoing: true
      });
      await expect(broker.call('triplestore.dataset.exist', { dataset: testDatasetForSubServiceTests })).resolves.toBeFalsy();
    });

    test('Delete dataset without confirmation should fail', async () => {
      await broker.call('triplestore.dataset.create', { dataset: testDatasetForSubServiceTests });
      await expect(broker.call('triplestore.dataset.delete', {
        dataset: testDatasetForSubServiceTests,
        iKnowWhatImDoing: false
      })).rejects.toThrow('Please confirm that you know what you are doing');
    });
  });

  describe('Insert action', () => {
    test('Insert JSON-LD data', async () => {
      const jsonLdData = {
        "@context": {
          "ex": "http://example.org/",
          "predicate": "ex:predicate"
        },
        "@id": "http://example.org/subject",
        "predicate": "object"
      };
      await broker.call('triplestore.insert', {
        resource: jsonLdData,
        dataset: testDataset
      });
      const result = await broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s ?p ?o }',
        dataset: testDataset
      });
      expect(result).toHaveLength(1);
      expect(result[0].s.value).toBe('http://example.org/subject');
      expect(result[0].p.value).toBe('http://example.org/predicate');
      expect(result[0].o.value).toBe('object');
    });

    test('Insert JSON-LD data with type', async () => {
      const jsonLdData = {
        "@context": {
          "ex": "http://example.org/",
          "name": "ex:name",
          "type": "@type"
        },
        "@id": "http://example.org/person1",
        "type": "http://example.org/Person",
        "name": "John Doe"
      };
      await broker.call('triplestore.insert', {
        resource: jsonLdData,
        dataset: testDataset
      });
      const result = await broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s a <http://example.org/Person> }',
        dataset: testDataset
      });
      expect(result).toHaveLength(1);
    });

    if (triplestore === 'fuseki') {
      test('Insert data with graph name', async () => {
        const jsonLdData = {
          "@context": {
            "ex": "http://example.org/",
            "predicate": "ex:predicate"
          },
          "@id": "http://example.org/subject",
          "predicate": "object"
        };
        const graphName = 'http://example.org/graph';
        await broker.call('triplestore.insert', {
          resource: jsonLdData,
          graphName,
          dataset: testDataset
        });
        const result = await broker.call('triplestore.query', {
          query: `SELECT * FROM <${graphName}> WHERE { ?s ?p ?o }`,
          dataset: testDataset
        });
        expect(result).toHaveLength(1);
      });
    }

    test('Insert data with wildcard dataset inserts into all datasets', async () => {
      const secondDataset = 'test_dataset2';
      // Create the second dataset
      await broker.call('triplestore.dataset.create', { dataset: secondDataset });

      const jsonLdData = {
        "@context": {
          "ex": "http://example.org/",
          "predicate": "ex:predicate"
        },
        "@id": "http://example.org/subject",
        "predicate": "object"
      };
      await broker.call('triplestore.insert', {
        resource: jsonLdData,
        dataset: '*'
      });

      // Assert in first dataset
      let result = await broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s ?p ?o }',
        dataset: testDataset
      });
      expect(result).toHaveLength(1);

      // Assert in second dataset
      result = await broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s ?p ?o }',
        dataset: secondDataset
      });
      expect(result).toHaveLength(1);

      // Clean up
      await broker.call('triplestore.dataset.delete', {
        dataset: secondDataset,
        iKnowWhatImDoing: true
      });
    });

    test('Insert should fail with non-existent dataset', async () => {
      const jsonLdData = {
        "@context": {
          "ex": "http://example.org/",
          "predicate": "ex:predicate"
        },
        "@id": "http://example.org/subject",
        "predicate": "object"
      };
      await expect(broker.call('triplestore.insert', {
        resource: jsonLdData,
        dataset: 'non_existent_dataset'
      })).rejects.toThrow("The dataset non_existent_dataset doesn't exist");
    });
  });

  describe('Query action', () => {
    beforeEach(async () => {
      // Insert test data
      const jsonLdData = [
        {
          "@context": {
            "ex": "http://example.org/",
            "name": "ex:name",
            "type": "@type"
          },
          "@id": "http://example.org/person1",
          "type": "http://example.org/Person",
          "name": "John Doe"
        },
        {
          "@context": {
            "ex": "http://example.org/",
            "name": "ex:name",
            "type": "@type"
          },
          "@id": "http://example.org/person2",
          "type": "http://example.org/Person",
          "name": "Jane Smith"
        }
      ];
      for (const data of jsonLdData) {
      await broker.call('triplestore.insert', {
          resource: data,
          dataset: testDataset
        });
      }
    });

    test('SELECT query with JSON result', async () => {
      const result = await broker.call('triplestore.query', {
        query: 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 5',
        // accept: 'application/json',
        dataset: testDataset
      });
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(4);
    });

    test('SELECT query with SPARQL JSON result', async () => {
      const result = await broker.call('triplestore.query', {
        query: 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 5',
        // accept: 'application/sparql-results+json',
        dataset: testDataset
      });
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(4);
    });

    test('ASK query', async () => {
      const result = await broker.call('triplestore.query', {
        query: 'ASK WHERE { ?s a <http://example.org/Person> }',
        // accept: 'application/json',
        dataset: testDataset
      });
      expect(typeof result).toBe('boolean');
      expect(result).toBeTruthy();
    });


    test('CONSTRUCT query with JSON result', async () => {
      const result = await broker.call('triplestore.query', {
        query: 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o } LIMIT 5',
        // accept: 'application/json',
        dataset: testDataset
      });
      expect(typeof result).toBe('object');
    });

    test('Query with SPARQL.js object', async () => {
      const sparqlObject = {
        type: 'query',
        queryType: 'SELECT',
        variables: [
          { termType: 'Variable', value: 's' },
          { termType: 'Variable', value: 'p' },
          { termType: 'Variable', value: 'o' }
        ],
        where: [{
          type: 'bgp',
          triples: [
            {
              subject: { termType: 'Variable', value: 's' },
              predicate: { termType: 'Variable', value: 'p' },
              object: { termType: 'Variable', value: 'o' }
            }
          ]
        }],
        limit: 5
      };
      const result = await broker.call('triplestore.query', {
        query: sparqlObject,
        dataset: testDataset
      });
      expect(Array.isArray(result)).toBeTruthy();
    });

    test('Query should fail with non-existent dataset', async () => {
      await expect(broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s ?p ?o }',
        dataset: 'non_existent_dataset'
      })).rejects.toThrow("The dataset non_existent_dataset doesn't exist");
    });

  });

  describe('Update action', () => {
    beforeEach(async () => {
      // Insert test data
      const jsonLdData = {
        "@context": {
          "ex": "http://example.org/",
          "name": "ex:name",
          "type": "@type"
        },
        "@id": "http://example.org/person1",
        "type": "http://example.org/Person",
        "name": "John Doe"
      };
      await broker.call('triplestore.insert', {
        resource: jsonLdData,
        dataset: testDataset
      });
    });

    test('UPDATE query with string', async () => {
      const updateQuery = `
        DELETE { <http://example.org/person1> <http://example.org/name> ?name }
        INSERT { <http://example.org/person1> <http://example.org/name> "John Updated" }
        WHERE { <http://example.org/person1> <http://example.org/name> ?name }
      `;
      await broker.call('triplestore.update', {
        query: updateQuery,
        dataset: testDataset
      });
      const result = await broker.call('triplestore.query', {
        query: 'SELECT ?name WHERE { <http://example.org/person1> <http://example.org/name> ?name }',
        dataset: testDataset
      });
      expect(result).toHaveLength(1);
      expect(result[0].name.value).toBe('John Updated');
    });

    test('UPDATE query with SPARQL.js object', async () => {
      const updateObject = {
        type: 'update',
        updates: [{
          type: 'insertdelete',
          delete: [{
            type: 'bgp',
            triples: [{
              subject: { termType: 'NamedNode', value: 'http://example.org/person1' },
              predicate: { termType: 'NamedNode', value: 'http://example.org/name' },
              object: { termType: 'Variable', value: 'name' }
            }]
          }],
          insert: [{
            type: 'bgp',
            triples: [{
              subject: { termType: 'NamedNode', value: 'http://example.org/person1' },
              predicate: { termType: 'NamedNode', value: 'http://example.org/name' },
              object: { termType: 'Literal', value: 'John Updated' }
            }]
          }],
          where: [{
            type: 'bgp',
            triples: [{
              subject: { termType: 'NamedNode', value: 'http://example.org/person1' },
              predicate: { termType: 'NamedNode', value: 'http://example.org/name' },
              object: { termType: 'Variable', value: 'name' }
            }]
          }]
        }]
      };
      await broker.call('triplestore.update', {
        query: updateObject,
        dataset: testDataset
      });
      const result = await broker.call('triplestore.query', {
        query: 'SELECT ?name WHERE { <http://example.org/person1> <http://example.org/name> ?name }',
        dataset: testDataset
      });
      expect(result).toHaveLength(1);
      expect(result[0].name.value).toBe('John Updated');
    });

    test('UPDATE with wildcard dataset updates all datasets', async () => {
      const secondDataset = 'test_dataset2';
      // Create the second dataset
      await broker.call('triplestore.dataset.create', { dataset: secondDataset });

      // Insert the same data into both datasets
      const initialData = {
        "@context": {
          "ex": "http://example.org/",
          "age": "ex:age"
        },
        "@id": "http://example.org/person1",
        "age": "29"
      };
      await broker.call('triplestore.insert', {
        resource: initialData,
        dataset: testDataset
      });
      await broker.call('triplestore.insert', {
        resource: initialData,
        dataset: secondDataset
      });

      // Perform the update with wildcard
      const updateQuery = `
        DELETE { <http://example.org/person1> <http://example.org/age> ?age }
        INSERT { <http://example.org/person1> <http://example.org/age> "30" }
        WHERE { <http://example.org/person1> <http://example.org/age> ?age }
      `;
      await broker.call('triplestore.update', {
        query: updateQuery,
        dataset: '*'
      });

      // Assert in first dataset
      let result = await broker.call('triplestore.query', {
        query: 'SELECT ?age WHERE { <http://example.org/person1> <http://example.org/age> ?age }',
        dataset: testDataset
      });
      expect(result).toHaveLength(1);
      expect(result[0].age.value).toBe('30');

      // Assert in second dataset
      result = await broker.call('triplestore.query', {
        query: 'SELECT ?age WHERE { <http://example.org/person1> <http://example.org/age> ?age }',
        dataset: secondDataset
      });
      expect(result).toHaveLength(1);
      expect(result[0].age.value).toBe('30');

      // Clean up
      await broker.call('triplestore.dataset.delete', {
        dataset: secondDataset,
        iKnowWhatImDoing: true
      });
    });

    test('UPDATE should fail with non-existent dataset', async () => {
      const updateQuery = `
        INSERT { <http://example.org/person1> <http://example.org/age> "30" }
        WHERE { }
      `;
      await expect(broker.call('triplestore.update', {
        query: updateQuery,
        dataset: 'non_existent_dataset'
      })).rejects.toThrow("The dataset non_existent_dataset doesn't exist");
    });
  });

  describe('DropAll action', () => {
    beforeEach(async () => {
      // Insert test data
      const jsonLdData = {
        "@context": {
          "ex": "http://example.org/",
          "name": "ex:name",
          "type": "@type"
        },
        "@id": "http://example.org/person1",
        "type": "http://example.org/Person",
        "name": "John Doe"
      };
      await broker.call('triplestore.insert', {
        resource: jsonLdData,
        dataset: testDataset
      });
    });

    test('Drop all data from dataset', async () => {
      // Verify data exists
      let result = await broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s ?p ?o }',
        dataset: testDataset
      });
      expect(result.length).toBeGreaterThan(0);
      // Drop all data
      await broker.call('triplestore.dropAll', {
        dataset: testDataset
      });
      // Verify data is gone
      result = await broker.call('triplestore.query', {
        query: 'SELECT * WHERE { ?s ?p ?o }',
        dataset: testDataset
      });
      expect(result).toHaveLength(0);
    });

    test('DropAll should fail with non-existent dataset', async () => {
      await expect(broker.call('triplestore.dropAll', {
        dataset: 'non_existent_dataset'
      })).rejects.toThrow("The dataset non_existent_dataset doesn't exist");
    });
  });

  describe('Error handling', () => {
    // TODO: Add error handling tests
  });
});
