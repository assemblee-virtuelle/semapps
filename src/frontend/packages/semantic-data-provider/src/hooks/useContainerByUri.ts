import { useEffect, useState } from 'react';
import useDataServers from './useDataServers';
import { Container } from '../dataProvider/types';

const useContainerByUri = (containerUri: string) => {
  const dataServers = useDataServers();
  const [container, setContainer] = useState<Container>();

  useEffect(() => {
    if (dataServers && containerUri) {
      Object.keys(dataServers).forEach(serverKey => {
        dataServers[serverKey].containers?.forEach(c => {
          if (c.uri === containerUri) {
            setContainer(c);
          }
        });
      });
    }
  }, [dataServers, setContainer, containerUri]);

  return container;
};

export default useContainerByUri;
