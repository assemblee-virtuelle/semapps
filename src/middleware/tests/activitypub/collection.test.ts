import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
import initialize from './initialize.ts';
// @ts-expect-error TS(1192): Module '"/home/laurin/projects/virtual-assembly/se... Remove this comment to see the full error message
import CONFIG from '../config.ts';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.setTimeout(50000);
let broker: any;

// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(async () => {
  broker = await initialize(3000, 'testData', 'settings');
});

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  if (broker) await broker.stop();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Collections', () => {
  const items: any = [];
  let collectionUri: any;
  let orderedCollectionUri: any;
  let cursorBasedCollectionUri: any;

  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
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
            published: `2021-01-0${i}T00:00:00.000Z`
          },
          contentType: MIME_TYPES.JSON
        })
      );
    }

    // Create collection for basic tests
    collectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My non-ordered collection'
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    // Create ordered collection
    orderedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: ['Collection', 'OrderedCollection'],
        summary: 'My ordered collection',
        'semapps:dereferenceItems': false
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    // Create collection for cursor tests
    cursorBasedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'Cursor test collection',
        'semapps:itemsPerPage': 2
      },
      contentType: MIME_TYPES.JSON,
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

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Collection exists', async () => {
    const collectionExist = await broker.call('activitypub.collection.exist', {
      resourceUri: collectionUri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', { resourceUri: collectionUri });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection',
      'semapps:dereferenceItems': false
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get collection with custom jsonContext', async () => {
    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri,
      jsonContext: { as: 'https://www.w3.org/ns/activitystreams#' }
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      '@id': collectionUri,
      '@type': 'as:Collection',
      'as:summary': 'My non-ordered collection',
      'http://semapps.org/ns/core#dereferenceItems': false
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Ordered collection exists', async () => {
    const collectionExist = await broker.call('activitypub.collection.exist', {
      resourceUri: orderedCollectionUri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collectionExist).toBeTruthy();

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: orderedCollectionUri
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      type: 'OrderedCollection',
      summary: 'My ordered collection',
      'semapps:dereferenceItems': false,
      'semapps:sortPredicate': 'as:published',
      'semapps:sortOrder': 'semapps:DescOrder'
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Add and remove item from collection', async () => {
    await broker.call('activitypub.collection.add', {
      collectionUri,
      item: items[0]
    });

    let collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionUri
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      id: collectionUri,
      type: 'Collection',
      summary: 'My non-ordered collection'
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection.items).toBeUndefinedOrEmptyArray();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Get collection with dereference items', async () => {
    const collectionWithDereferenceUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: 'Collection',
        summary: 'My non-ordered collection with dereferenceItems: true',
        'semapps:dereferenceItems': true
      },
      contentType: MIME_TYPES.JSON,
      webId: 'system'
    });

    await broker.call('activitypub.collection.add', {
      collectionUri: collectionWithDereferenceUri,
      item: items[0]
    });

    const collection = await broker.call('activitypub.collection.get', {
      resourceUri: collectionWithDereferenceUri
    });

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      id: collectionWithDereferenceUri,
      type: 'Collection',
      summary: 'My non-ordered collection with dereferenceItems: true',
      items: {
        id: items[0],
        type: 'Note',
        content: 'Contenu de ma note #0',
        name: 'Note #0' as const
      }
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      id: orderedCollectionUri,
      orderedItems: [items[6], items[4], items[2], items[0]]
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('Items are sorted in ascending order', async () => {
    const ascOrderedCollectionUri = await broker.call('activitypub.collection.post', {
      resource: {
        type: ['Collection', 'OrderedCollection'],
        summary: 'My asc-ordered collection',
        'semapps:sortPredicate': 'as:published',
        'semapps:sortOrder': 'semapps:AscOrder'
      },
      contentType: MIME_TYPES.JSON,
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(collection).toMatchObject({
      id: ascOrderedCollectionUri,
      orderedItems: [items[0], items[2], items[4], items[6]]
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Pagination', () => {
    let paginatedCollectionUri: any;

    // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
    beforeAll(async () => {
      // Create collection for pagination tests
      paginatedCollectionUri = await broker.call('activitypub.collection.post', {
        resource: {
          type: 'Collection',
          summary: 'My paginated collection',
          'semapps:itemsPerPage': 4
        },
        contentType: MIME_TYPES.JSON,
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

    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should return first and last page links for unpaginated request', async () => {
      const collection = await broker.call('activitypub.collection.get', {
        resourceUri: paginatedCollectionUri
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection).toMatchObject({
        id: paginatedCollectionUri,
        first: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`,
        last: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[items.length - 1])}`
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should navigate forward with afterEq cursor', async () => {
      const collection = await broker.call('activitypub.collection.get', {
        resourceUri: paginatedCollectionUri,
        afterEq: items[0]
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection).toMatchObject({
        id: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[0])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        next: `${paginatedCollectionUri}?afterEq=${encodeURIComponent(items[4])}`
      });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection.items).toHaveLength(4);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection.items).toEqual([items[0], items[1], items[2], items[3]]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should navigate backward with beforeEq cursor', async () => {
      const collection = await broker.call('activitypub.collection.get', {
        resourceUri: paginatedCollectionUri,
        beforeEq: items[5]
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection).toMatchObject({
        id: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[5])}`,
        type: 'CollectionPage',
        partOf: paginatedCollectionUri,
        prev: `${paginatedCollectionUri}?beforeEq=${encodeURIComponent(items[1])}`
      });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection.items).toHaveLength(4);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(collection.items).toEqual([items[2], items[3], items[4], items[5]]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Edge Cases', () => {
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('Should handle empty collection', async () => {
        const emptyCollectionUri = await broker.call('activitypub.collection.post', {
          resource: {
            type: 'Collection',
            summary: 'Empty collection',
            'semapps:itemsPerPage': 4
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });

        const collection = await broker.call('activitypub.collection.get', {
          resourceUri: emptyCollectionUri
        });

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection).toMatchObject({
          id: emptyCollectionUri,
          type: 'Collection'
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.first).toBeUndefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.last).toBeUndefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.items).toBeUndefinedOrEmptyArray();
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('Should handle collection with exactly itemsPerPage items', async () => {
        const exactCollectionUri = await broker.call('activitypub.collection.post', {
          resource: {
            type: 'Collection',
            summary: 'Exact size collection',
            'semapps:itemsPerPage': 4
          },
          contentType: MIME_TYPES.JSON,
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

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection).toMatchObject({
          type: 'CollectionPage',
          partOf: exactCollectionUri
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.next).toBeUndefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.items).toHaveLength(4);
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test('Should handle last page with remaining items', async () => {
        // Get last page of main paginated collection (should have 2 items)
        const collection = await broker.call('activitypub.collection.get', {
          resourceUri: paginatedCollectionUri,
          afterEq: items[8]
        });

        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.items).toHaveLength(2);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(collection.next).toBeUndefined();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Data Consistency', () => {
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(page.items).toHaveLength(4);
          }

          // Check for duplicates
          page.items.forEach((item: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(seenItems.has(item)).toBeFalsy();
            seenItems.add(item);
          });

          cursor = page.next ? new URL(page.next).searchParams.get('afterEq') : null;
          pageCount++;
        }

        // With 10 items and page size 4, we should have 3 pages
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(pageCount).toBe(3);
        // Should have seen all items exactly once
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(seenItems.size).toBe(10);
      });

      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(firstPage.items).toEqual(prevPage.items);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Error Handling', () => {
    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should return 404 when collection does not exist', async () => {
      const nonExistentUri = urlJoin(CONFIG.HOME_URL, 'as/collection/non-existent');
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: nonExistentUri
        })
      ).rejects.toThrow('Not found');
    });

    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should return 404 when cursor not found in collection', async () => {
      const invalidCursorUri = urlJoin(CONFIG.HOME_URL, 'as/object/non-existent');
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: cursorBasedCollectionUri,
          afterEq: invalidCursorUri
        })
      ).rejects.toThrow('Cursor not found');
    });

    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should reject when both beforeEq and afterEq are provided', async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: cursorBasedCollectionUri,
          beforeEq: items[0],
          afterEq: items[1]
        })
      ).rejects.toThrow('Cannot get a collection with both beforeEq and afterEq');
    });

    // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('Should handle malformed collection URI', async () => {
      const malformedUri = 'not-a-valid-uri';
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(
        broker.call('activitypub.collection.get', {
          resourceUri: malformedUri
        })
      ).rejects.toThrow();
    });
  });
});
