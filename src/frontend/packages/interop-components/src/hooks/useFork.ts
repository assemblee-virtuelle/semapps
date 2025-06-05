import { useCallback } from 'react';
import { useDataProvider, useRedirect, useNotify } from 'react-admin';

const useFork = (resourceId: any) => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const notify = useNotify();

  return useCallback(
    async (remoteRecordUri: any, stripProperties = []) => {
      const { data: remoteData } = await dataProvider.getOne(resourceId, { id: remoteRecordUri });

      const strippedData = { ...remoteData };
      strippedData['http://www.w3.org/ns/prov#wasDerivedFrom'] = strippedData.id;
      delete strippedData.id;
      delete strippedData['@context'];
      stripProperties.forEach(prop => {
        delete strippedData[prop];
      });

      const { data: localData } = await dataProvider.create(resourceId, { data: strippedData });

      redirect(`/${resourceId}/${encodeURIComponent(localData.id)}/show`);
      notify('La ressource a bien été copiée', { type: 'success' });
    },
    [resourceId, dataProvider, redirect, notify]
  );
};

export default useFork;
