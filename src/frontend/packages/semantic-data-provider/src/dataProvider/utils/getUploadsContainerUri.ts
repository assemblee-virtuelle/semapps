import { Configuration } from '../types';

const getUploadsContainerUri = (config: Configuration, serverKey?: string) => {
  // If no server key is defined or if the server has no uploads container, find any server with a uploads container
  if (
    !serverKey ||
    !config.dataServers[serverKey].containers ||
    !config.dataServers[serverKey].containers?.find(c => c.binaryResources)
  ) {
    serverKey = Object.keys(config.dataServers).find(
      key => config.dataServers[key].containers?.find(c => c.binaryResources)
    );
  }

  if (serverKey) {
    return config.dataServers[serverKey].containers?.find(c => c.binaryResources)?.uri;
  } else {
    // No server has an uploads container
    return null;
  }
};

export default getUploadsContainerUri;
