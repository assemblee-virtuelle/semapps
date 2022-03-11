import { useCallback } from 'react';
import { useNotify } from "react-admin";
import { useCreateContainer } from "@semapps/semantic-data-provider";

const useSync = resourceId => {
  const notify = useNotify();
  const createContainerUri = useCreateContainer(resourceId);

  return useCallback(async (remoteRecordUri) => {
    notify("Cette méthode n'est pas disponible pour le moment", { type: 'error' });
  }, [notify, createContainerUri]);
};

export default useSync;
