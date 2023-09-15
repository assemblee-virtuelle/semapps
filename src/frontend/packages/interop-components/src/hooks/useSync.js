import { useCallback } from 'react';
import { useNotify, useDataProvider, useRedirect } from 'react-admin';

const useSync = resourceId => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();

  return useCallback(
    async remoteRecordUri => {
      await dataProvider.create(resourceId, { id: remoteRecordUri });

      redirect(`/${resourceId}/${encodeURIComponent(remoteRecordUri)}/show`);
      notify('La ressource a bien été importée', { type: 'success' });
    },
    [dataProvider, redirect, notify]
  );
};

export default useSync;
