import { useCallback } from 'react';
import { useDataProvider, useGetIdentity } from 'react-admin';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';
import useCollection from './useCollection';
import useAwaitActivity from './useAwaitActivity';
import type { UseCollectionOptions } from '../types';

const useOutbox = (options: UseCollectionOptions = {}) => {
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const { data: identity } = useGetIdentity();
  const { url, hasLiveUpdates, items, ...rest } = useCollection('outbox', options);
  const awaitActivity = useAwaitActivity(hasLiveUpdates.webSocket, items);

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

  return { url, hasLiveUpdates, items, post, awaitActivity, owner: identity?.id, ...rest };
};

export default useOutbox;
