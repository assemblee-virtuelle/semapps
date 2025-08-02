import urlJoin from 'url-join';
import initialize from './initialize.ts';
import * as CONFIG from '../config.ts';

jest.setTimeout(50000);
let broker: any;

beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});

afterAll(async () => {
  if (broker) await broker.stop();
});

describe('Collections', () => {
  const items: any = [];
  let collectionUri: any;
  let orderedCollectionUri: any;
  let cursorBasedCollectionUri: any;

  beforeAll(async () => {
    // Create test items
    for (let i = 0; i < 10; i++) {
      items.push(
        await broker.call('ldp.container.post', {
          containerUri: urlJoin(CONFIG.HOME_URL, 'as/object'),
          resource: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            '@type': 'Note',
            name: `Note #${i}`,
            content: `Contenu de ma note #${i}`,
            published: `2021-01-0${i + 1}T00:00:00.000Z`
          }
        })
      );
    }

    // Create collection for basic tests
    collectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My non-ordered collection'
      },
      webId: 'system'
    });

    // Create ordered collection
    orderedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: ['Collection', 'OrderedCollection'],
        summary: 'My ordered collection',
        'semapps:dereferenceItems': false
      },
      webId: 'system'
    });

    // Create collection for cursor tests
    cursorBasedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'Cursor test collection',
        'semapps:itemsPerPage': 2
      },
      webId: 'system'
    });

    // Add items to cursor based collection
    await broker.call('activitypub.collection.add', {
      collectionUri: cursorBasedCollectionUri,
      item: items[0]
    });
    await broker.call('activitypub.collection.add', {
      collectionUri: cursorBasedCollectionUri,
      item: items[1]
    });
  });

  test('Collection exists', async () => {
    const collectionExist = await broker.call('activitypub.collection.exist', {
      resourceUri: collectionUri
    });
    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', { resourceUri: collectionUri });
    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      'semapps:dereferenceItems': false
    });
  });

  test('Get collection with custom jsonContext', async () => {
    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri,
      jsonContext: { as: 'https://www.w3.org/ns/activitystreams#' }
    });

    expect(collection).toMatchObject({
      '@id': collectionUri,
      '@type': 'as:Collection',
      'as:summary': 'My non-ordered collection',
      'http://semapps.org/ns/core#dereferenceItems': false
    });
  });

  test('Ordered collection exists', async () => {
    const collectionExist = await broker.call('activitypub.collection.exist', {
      resourceUri: orderedCollectionUri
    });
    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: orderedCollectionUri
    });
    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      type: 'OrderedCollection',
      summary: 'My ordered collection',
      'semapps:dereferenceItems': false,
      'semapps:sortPredicate': 'as:published',
      'semapps:sortOrder': 'semapps:DescOrder'
    });
  });

  test('Add and remove item from collection', async () => {
    await broker.call('activitypub.collection.add', {
      collectionUri,
      item: items[0]
    });

    let collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      items: items[0]
    });

    await broker.call('activitypub.collection.remove', {
      collectionUri,
      item: items[0]
    });

    collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri
    });

    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection'
    });

    expect(collection.items).toBeUndefinedOrEmptyArray();
  });

  test('Get collection with dereference items', async () => {
    const collectionWithDereferenceUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My non-ordered collection with dereferenceItems: true',
        'semapps:dereferenceItems': true
      },
      webId: 'system'
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: collectionWithDereferenceUri,
      item: items[0]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionWithDereferenceUri
    });

    expect(collection).toMatchObject({
      id: collectionWithDereferenceUri,
      type: 'Collection',
      summary: 'My non-ordered collection with dereferenceItems: true',
      items: {
        id: items[0],
        type: 'Note',
        content: 'Contenu de ma note #0',
        name: 'Note #0'
      }
    });
  });

  test('Items are sorted in descending order (default)', async () => {
    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[4]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[0]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[2]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: orderedCollectionUri,
      item: items[6]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: orderedCollectionUri
    });

    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      orderedItems: [items[6], items[4], items[2], items[0]]
    });
  });

  test('Items are sorted in ascending order', async () => {
    const ascOrderedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: ['Collection', 'OrderedCollection'],
        summary: 'My asc-ordered collection',
        'semapps:sortPredicate': 'as:published',
        'semapps:sortOrder': 'semapps:AscOrder'
      },
      webId: 'system'
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[4]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[0]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[2]
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: ascOrderedCollectionUri,
      item: items[6]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: ascOrderedCollectionUri
    });

    expect(collection).toMatchObject({
      id: ascOrderedCollectionUri,
      orderedItems: [items[0], items[2], items[4], items[6]]
    });
  });

  describe('Pagination', () => {
    let paginatedCollectionUri: any;

    beforeAll(async () => {
      // Create collection for pagination tests
      paginatedCollectionUri = await broker.call('activitypub.collection.post', {
        resource: {
          type: 'Collection',
          summary: 'My paginated collection',
          'semapps:itemsPerPage': 4
        },
        webId: 'system'
      });

      // Add all items to test pagination
      for (let i = 0; i < 10; i++) {
        await broker.call('activitypub.collection.add', {
          collectionUri: paginatedCollectionUri,
          item: items[i]
        });
      }
    });

    test('Should return first and last page links for unpaginated request', async () => {
      const collection = await broker.call('activitypub.collection.get', {
        resourceUri: paginatedCollectionUri
      });

      expect(collection).toMatchObject({
        id: paginatedCollectionUri,
        first: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`,
        last: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[items.length - 1])}`
      });
    });

    test('Should navigate forward with afterEq cursor', async () => {
      const collection = await broker.call('activitypub.collection.get', {
        resourceUri: paginatedCollectionUri,
        afterEq: items[0]
      });

      expect(collection).toMatchObject({
        id: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        next: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[4])}`
      });
      expect(collection.items).toHaveLength(4);
      expect(collection.items).toEqual([items[0], items[1], items[2], items[3]]);
    });

    test('Should navigate backward with beforeEq cursor', async () => {
      const collection = await broker.call('activitypub.collection.get', {
        resourceUri: paginatedCollectionUri,
        beforeEq: items[5]
      });

      expect(collection).toMatchObject({
        id: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[5])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        prev: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[1])}`
      });
      expect(collection.items).toHaveLength(4);
      expect(collection.items).toEqual([items[2], items[3], items[4], items[5]]);
    });

    describe('Edge Cases', () => {
      test('Should handle empty collection', async () => {
        const emptyCollectionUri = await broker.call('activitypub.collection.post', {
          resource: {
            type: 'Collection',
            summary: 'Empty collection',
            'semapps:itemsPerPage': 4
          },
          webId: 'system'
        });

        const collection = await broker.call('activitypub.collection.get', {
          resourceUri: emptyCollectionUri
        });

        expect(collection).toMatchObject({
          id: emptyCollectionUri,
          type: 'Collection'
        });
        expect(collection.first).toBeUndefined();
        expect(collection.last).toBeUndefined();
        expect(collection.items).toBeUndefinedOrEmptyArray();
      });

      test('Should handle collection with exactly itemsPerPage items', async () => {
        const exactCollectionUri = await broker.call('activitypub.collection.post', {
          resource: {
            type: 'Collection',
            summary: 'Exact size collection',
            'semapps:itemsPerPage': 4
          },
          webId: 'system'
        });

        // Add exactly 4 items
        for (let i = 0; i < 4; i++) {
          await broker.call('activitypub.collection.add', {
            collectionUri: exactCollectionUri,
            item: items[i]
          });
        }

        const collection = await broker.call('activitypub.collection.get', {
          resourceUri: exactCollectionUri,
          afterEq: items[0]
        });

        expect(collection).toMatchObject({
          type: 'CollectionPage',
          partOf: exactCollectionUri
        });
        expect(collection.next).toBeUndefined();
        expect(collection.items).toHaveLength(4);
      });

      test('Should handle last page with remaining items', async () => {
        // Get last page of main paginated collection (should have 2 items)
        const collection = await broker.call('activitypub.collection.get', {
          resourceUri: paginatedCollectionUri,
          afterEq: items[8]
        });

        expect(collection.items).toHaveLength(2);
        expect(collection.next).toBeUndefined();
      });
    });

    describe('Data Consistency', () => {
      test('Should maintain consistent page size across navigation', async () => {
        // Navigate through all pages and verify each has correct size (except last)
        let cursor = items[0];
        let pageCount = 0;
        let seenItems = new Set();

        while (cursor) {
          const page = await broker.call('activitypub.collection.get', {
            resourceUri: paginatedCollectionUri,
            afterEq: cursor
          });

          if (page.next) {
            expect(page.items).toHaveLength(4);
          }

          // Check for duplicates
          page.items.forEach((item: any) => {
            expect(seenItems.has(item)).toBeFalsy();
            seenItems.add(item);
          });

          cursor = page.next ? new URL(page.next).searchParams.get('afterEq') : null;
          pageCount++;
        }

        // With 10 items and page size 4, we should have 3 pages
        expect(pageCount).toBe(3);
        // Should have seen all items exactly once
        expect(seenItems.size).toBe(10);
      });

      test('Should handle navigation between pages consistently', async () => {
        // Forward navigation
        const firstPage = await broker.call('activitypub.collection.get', {
          resourceUri: paginatedCollectionUri,
          afterEq: items[0]
        });

        // Get the next page
        const nextPage = await broker.call('activitypub.collection.get', {
          resourceUri: paginatedCollectionUri,
          afterEq: items[4]
        });

        // Navigate back
        const prevPage = await broker.call('activitypub.collection.get', {
          resourceUri: paginatedCollectionUri,
          beforeEq: new URL(nextPage.prev).searchParams.get('beforeEq')
        });

        // Verify we get back to the same items
        expect(firstPage.items).toEqual(prevPage.items);
      });
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 when collection does not exist', async () => {
      const nonExistentUri = urlJoin(CONFIG.HOME_URL, 'as/collection/non-existent');
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: nonExistentUri
        })
      ).rejects.toThrow('not found');
    });

    test('Should return 404 when cursor not found in collection', async () => {
      const invalidCursorUri = urlJoin(CONFIG.HOME_URL, 'as/object/non-existent');
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: cursorBasedCollectionUri,
          afterEq: invalidCursorUri
        })
      ).rejects.toThrow('Cursor not found');
    });

    test('Should reject when both beforeEq and afterEq are provided', async () => {
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: cursorBasedCollectionUri,
          beforeEq: items[0],
          afterEq: items[1]
        })
      ).rejects.toThrow('Cannot get a collection with both beforeEq and afterEq');
    });

    test('Should handle malformed collection URI', async () => {
      const malformedUri = 'not-a-valid-uri';
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: malformedUri
        })
      ).rejects.toThrow();
    });
  });
});
