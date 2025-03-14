import { DataServersConfig, Container } from '../types';
import parseServerKeys from './parseServerKeys';

/**
 * Return all containers matching the given types
 */
const findContainersWithTypes = (
  types: string[],
  serverKeys: string | string[] | undefined,
  dataServers: DataServersConfig
) => {
  const matchingContainers: Container[] = [];

  const parsedServerKeys = parseServerKeys(serverKeys || '@all', dataServers);

  Object.keys(dataServers).forEach(dataServerKey => {
    if (parsedServerKeys.includes(dataServerKey)) {
      dataServers[dataServerKey].containers?.forEach(container => {
        if (container.types?.some(t => types.includes(t))) {
          matchingContainers.push(container);
        }
      });
    }
  });

  return matchingContainers;
};

export default findContainersWithTypes;
