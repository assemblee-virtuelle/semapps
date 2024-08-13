import { useCallback } from 'react';
import { useDataProvider } from 'react-admin';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';
import { SolidNotification, AwaitActivityOptions } from '../types';

/**
 * Hook used internally by useInbox and useOutbox. This is not exported.
 * @param webSocket WebSocket which allow to listen to the inbox or outbox
 * @param existingActivities Partial list of activities already received in the inbox and outbox
 */
const useAwaitActivity = (webSocket?: WebSocket, existingActivities?: Array<object | string>) => {
  const dataProvider = useDataProvider<SemanticDataProvider>();

  // TODO Allow to pass an object, and automatically dereference it if required, like on the @semapps/activitypub matchActivity util
  return useCallback(
    (matchActivity: (activity: object) => boolean, options: AwaitActivityOptions = {}) => {
      const { timeout = 30000, checkExistingActivities = false } = options;
      return new Promise((resolve, reject) => {
        if (webSocket) {
          const onMessage = (event: MessageEvent<string>) => {
            const data: SolidNotification = JSON.parse(event.data);
            if (data.type === 'Add') {
              dataProvider.fetch(data.object).then(({ json }) => {
                if (matchActivity(json)) {
                  webSocket.removeEventListener('message', onMessage);
                  return resolve(json);
                }
              });
            }
          };

          webSocket.addEventListener('message', onMessage);

          // TODO reconnect if connection closed
          webSocket.addEventListener('error', e => {
            reject(e);
          });
          webSocket.addEventListener('close', e => {
            reject(new Error(`${e.reason} (Code: ${e.code})`));
          });

          // If a list of activities is already loaded, verify if there is a match
          if (existingActivities && checkExistingActivities) {
            for (const a of existingActivities) {
              if (typeof a !== 'string') {
                if (matchActivity(a)) {
                  webSocket.removeEventListener('message', onMessage);
                  return resolve(a);
                }
              }
            }
          }

          setTimeout(() => {
            webSocket.removeEventListener('message', onMessage);
            reject(new Error('Timeout'));
          }, timeout);
        } else {
          throw new Error('WebSocket is not initialized !');
        }
      });
    },
    [webSocket, existingActivities, dataProvider]
  );
};

export default useAwaitActivity;
