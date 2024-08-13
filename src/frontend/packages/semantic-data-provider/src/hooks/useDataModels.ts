import { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { DataModel, SemanticDataProvider } from '../dataProvider/types';

const useDataModels = () => {
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const [dataModels, setDataModels] = useState<Record<string, DataModel>>();

  useEffect(() => {
    dataProvider.getDataModels().then(results => {
      setDataModels(results);
    });
  }, [dataProvider, setDataModels]);

  return dataModels;
};

export default useDataModels;
