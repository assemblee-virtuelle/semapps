import { useCallback } from 'react';
import { useDataProvider, useGetIdentity } from 'react-admin';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';
import useCollection from './useCollection';
import useAwaitActivity from './useAwaitActivity';
import type { UseCollectionOptions } from '../types';

/**
 * Hook to fetch and post to the outbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `post`: a function to post a new activity in the user's outbox
 * - `awaitActivity`: a function to wait for a certain activity to be posted
 * - `owner`: the WebID of the outbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useoutbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
const useOutbox = (options: UseCollectionOptions = {}) => {
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const { data: identity } = useGetIdentity();
  const { url, items, awaitWebSocketConnection, ...rest } = useCollection('outbox', options);
  const awaitActivity = useAwaitActivity(awaitWebSocketConnection, items);

  // Post an activity to the logged user's outbox and return its URI
  const post = useCallback(
    async (activity: object) => {
      if (!url) {
        throw new Error(
          'Cannot post to outbox before user identity is loaded. Please use the isLoading argument of useOutbox'
        );
      }
      const { headers } = await dataProvider.fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          '@context': 'https://www.w3.org/ns/activitystreams',
          ...activity
        })
      });
      return headers.get('Location');
    },
    [url, dataProvider]
  );

  return { url, items, awaitWebSocketConnection, post, awaitActivity, owner: identity?.id, ...rest };
};

export default useOutbox;
