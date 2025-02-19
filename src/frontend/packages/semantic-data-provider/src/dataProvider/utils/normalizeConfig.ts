import urlJoin from 'url-join';
import { Configuration } from '../types';

const normalizeConfig = (config: Configuration) => {
  const newConfig: Configuration = { ...config };

  Object.keys(newConfig.dataServers).forEach(serverKey => {
    newConfig.dataServers[serverKey].containers = newConfig.dataServers[serverKey].containers?.map(container => ({
      ...container,
      server: serverKey,
      uri: urlJoin(config.dataServers[serverKey].baseUrl, container.path)
    }));
  });

  return newConfig;
};

export default normalizeConfig;
