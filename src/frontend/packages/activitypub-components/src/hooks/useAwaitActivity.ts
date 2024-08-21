import { RefObject, useCallback } from 'react';
import { useDataProvider } from 'react-admin';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';
import { SolidNotification, AwaitActivityOptions, AwaitWebSocketConnectionOptions } from '../types';

/**
 * Hook used internally by useInbox and useOutbox. This is not exported.
 * @param awaitWebSocketConnection Promise returning the WebSocket which allow to listen to the inbox or outbox
 * @param existingActivities Partial list of activities already received in the inbox and outbox
 */
const useAwaitActivity = (
  awaitWebSocketConnection: (options?: AwaitWebSocketConnectionOptions) => Promise<RefObject<WebSocket>>,
  existingActivities?: Array<object | string>
) => {
  const dataProvider = useDataProvider<SemanticDataProvider>();

  // TODO Allow to pass an  object, and automatically dereference it if required, like on the @semapps/activitypub matchActivity util
  return useCallback(
    (matchActivity: (activity: object) => boolean, options: AwaitActivityOptions = {}) => {
      const { timeout = 30000, checkExistingActivities = false } = options;
      return new Promise((resolve, reject) => {
        awaitWebSocketConnection()
          .then(webSocketRef => {
            const onMessage = (event: MessageEvent<string>) => {
              const data: SolidNotification = JSON.parse(event.data);
              if (data.type === 'Add') {
                dataProvider.fetch(data.object).then(({ json }) => {
                  if (matchActivity(json)) {
                    removeListeners();
                    return resolve(json);
                  }
                });
              }
            };
            const onError = (e: Event) => {
              // TODO reconnect if connection closed
              removeListeners();
              reject(e);
            };
            const onClose = (e: CloseEvent) => {
              removeListeners();
              reject(new Error(`${e.reason} (Code: ${e.code})`));
            };

            const removeListeners = () => {
              webSocketRef.current?.removeEventListener('message', onMessage);
              webSocketRef.current?.removeEventListener('error', onError);
              webSocketRef.current?.removeEventListener('close', onClose);
            };

            webSocketRef.current?.addEventListener('message', onMessage);
            webSocketRef.current?.addEventListener('error', onError);
            webSocketRef.current?.addEventListener('close', onClose);

            // If a list of activities is already loaded, verify if there is a match
            if (existingActivities && checkExistingActivities) {
              for (const a of existingActivities) {
                if (typeof a !== 'string') {
                  if (matchActivity(a)) {
                    removeListeners();
                    return resolve(a);
                  }
                }
              }
            }

            setTimeout(() => {
              removeListeners();
              reject(new Error('Timeout'));
            }, timeout);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    [awaitWebSocketConnection, existingActivities, dataProvider]
  );
};

export default useAwaitActivity;
