import { DataServersConfig, Container } from '../types';

const findContainersWithURIs = (containersUris: string[], dataServers: DataServersConfig) => {
  const matchingContainers: Container[] = [];

  Object.keys(dataServers).forEach(serverKey => {
    dataServers[serverKey].containers?.forEach(container => {
      if (container.uri && containersUris.includes(container.uri)) {
        matchingContainers.push(container);
      }
    });
  });

  return matchingContainers;
};

export default findContainersWithURIs;
