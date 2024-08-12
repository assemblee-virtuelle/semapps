import { useGetIdentity } from 'react-admin';
import useCollection from './useCollection';
import useAwaitActivity from './useAwaitActivity';
import type { UseCollectionOptions } from '../types';

const useInbox = (options: UseCollectionOptions = {}) => {
  const { data: identity } = useGetIdentity();
  const { items, url, hasLiveUpdates, ...rest } = useCollection('inbox', options);
  const awaitActivity = useAwaitActivity(hasLiveUpdates.webSocket);
  return { items, url, hasLiveUpdates, awaitActivity, owner: identity?.id, ...rest };
};

export default useInbox;
