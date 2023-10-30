import urlJoin from 'url-join';
import parseServerKeys from './parseServerKeys';

const findContainersWithTypes = (
  types: string[],
  serverKeys: string | string[] | undefined,
  dataServers: Record<string, any>
) => {
  const containers = {} as Record<string, string[]>;
  const existingContainers: string[] = [];

  const parsedServerKeys = parseServerKeys(serverKeys, dataServers);

  Object.keys(dataServers).forEach(key1 => {
    Object.keys(dataServers[key1].containers).forEach(key2 => {
      if (!parsedServerKeys || parsedServerKeys.includes(key2)) {
        Object.keys(dataServers[key1].containers[key2]).forEach(type => {
          if (types.includes(type)) {
            dataServers[key1].containers[key2][type].map(path => {
              const containerUri = urlJoin(dataServers[key2].baseUrl, path);

              // Avoid returning the same container several times
              if (!existingContainers.includes(containerUri)) {
                existingContainers.push(containerUri);

                if (!containers[key1]) containers[key1] = [];
                containers[key1].push(containerUri);
              }
            });
          }
        });
      }
    });
  });
  return containers;
};

export default findContainersWithTypes;
