import { useGetIdentity } from 'react-admin';
import useCollection from './useCollection';
import useAwaitActivity from './useAwaitActivity';
import type { UseCollectionOptions } from '../types';

/**
 * Hook to fetch the inbox of the logged user.
 * Returns the same data as the useCollection hooks, plus:
 * - `awaitActivity`: a function to wait for a certain activity to be received
 * - `owner`: the WebID of the inbox's owner
 * See https://semapps.org/docs/frontend/activitypub-components#useinbox for usage
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
const useInbox = (options: UseCollectionOptions = {}) => {
  const { data: identity } = useGetIdentity();
  const { url, items, awaitWebSocketConnection, ...rest } = useCollection('inbox', options);
  const awaitActivity = useAwaitActivity(awaitWebSocketConnection, items);
  return { url, items, awaitWebSocketConnection, awaitActivity, owner: identity?.id, ...rest };
};

export default useInbox;
