import { useCallback } from 'react';
import { useNotify } from "react-admin";

const useSync = () => {
  const notify = useNotify();

  return useCallback(async (resourceId, remoteRecordUri, localContainerUri) => {
    notify("Cette méthode n'est pas disponible pour le moment", { type: 'error' });
  }, [notify]);
};

export default useSync;
