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
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: true }`
 */
const useInbox = (options: UseCollectionOptions = {}) => {
  const { data: identity } = useGetIdentity();
  const { items, url, hasLiveUpdates, ...rest } = useCollection('inbox', options);
  const awaitActivity = useAwaitActivity(hasLiveUpdates.webSocket);
  return { items, url, hasLiveUpdates, awaitActivity, owner: identity?.id, ...rest };
};

export default useInbox;
