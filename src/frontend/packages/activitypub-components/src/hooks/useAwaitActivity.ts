import { useCallback } from 'react';
import { useDataProvider } from 'react-admin';
import { DataProvider } from '@semapps/semantic-data-provider';
import { SolidNotification } from '../types';

const useAwaitActivity = (webSocket?: WebSocket) => {
  const dataProvider: DataProvider = useDataProvider();

  return useCallback(
    (matchActivity: (activity: object) => boolean, timeout: number = 30000) =>
      new Promise((resolve, reject) => {
        if (webSocket) {
          const onMessage = (event: MessageEvent<string>) => {
            const data: SolidNotification = JSON.parse(event.data);
            if (data.type === 'Add') {
              dataProvider.fetch(data.object).then(({ json }) => {
                if (matchActivity(json)) {
                  webSocket.removeEventListener('message', onMessage);
                  resolve(json);
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

          setTimeout(() => {
            webSocket.removeEventListener('message', onMessage);
            reject(new Error('Timeout'));
          }, timeout);
        } else {
          throw new Error('WebSocket is not initialized !');
        }
      }),
    [webSocket, dataProvider]
  );
};

export default useAwaitActivity;
