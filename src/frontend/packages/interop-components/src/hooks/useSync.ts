import { useCallback } from 'react';
import { useNotify, useDataProvider, useRedirect } from 'react-admin';

const useSync = (resourceId: any) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();

  return useCallback(
    async (remoteRecordUri: any) => {
      // @ts-expect-error TS(2345): Argument of type '{ id: any; }' is not assignable ... Remove this comment to see the full error message
      await dataProvider.create(resourceId, { id: remoteRecordUri });

      redirect(`/${resourceId}/${encodeURIComponent(remoteRecordUri)}/show`);
      notify('La ressource a bien été importée', { type: 'success' });
    },
    [dataProvider, redirect, notify]
  );
};

export default useSync;
