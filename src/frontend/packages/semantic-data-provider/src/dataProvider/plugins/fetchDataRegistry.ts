import jwtDecode from 'jwt-decode';
import { Configuration, Plugin } from '../types';
import fetchDataRegistryContainers from '../utils/fetchDataRegistryContainers';

/**
 * Plugin to add data registrations to the user containers, by fetching the registry set.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */
const fetchDataRegistry = (): Plugin => ({
  name: 'fetchDataRegistry',
  transformConfig: async config => {
    const token = localStorage.getItem('token');

    // If the user is logged in
    if (token) {
      const payload: { [k: string]: string | number } = jwtDecode(token);
      const webId = (payload.webId as string) || (payload.webid as string); // Currently we must deal with both formats

      if (!config.dataServers[webId])
        throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);

      const containers = await fetchDataRegistryContainers(webId, config.httpClient);

      if (containers.length > 0) {
        const { baseUrl } = config.dataServers[webId];
        const newConfig = { ...config };

        newConfig.dataServers[webId].containers?.push(
          ...containers.map(({ uri, ...container }) => ({ ...container, path: uri!.replace(baseUrl, '') }))
        );

        return newConfig;
      }
    }

    // Nothing to change
    return config;
  }
});

export default fetchDataRegistry;
