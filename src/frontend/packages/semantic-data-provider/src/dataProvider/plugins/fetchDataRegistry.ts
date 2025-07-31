import jwtDecode from 'jwt-decode';
import { Configuration, Plugin } from '../types';
import getContainerFromDataRegistration from '../utils/getContainerFromDataRegistration';

/**
 * Plugin to add data registrations to the user containers, by fetching the registry set.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */
const fetchDataRegistry = (): Plugin => ({
  transformConfig: async (config: Configuration) => {
    const token = localStorage.getItem('token');

    // If the user is logged in
    if (token) {
      const payload: { [k: string]: string | number } = jwtDecode(token);
      const webId = (payload.webId as string) || (payload.webid as string); // Currently we must deal with both formats

      if (!config.dataServers[webId])
        throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);

      const { json: user } = await config.httpClient(webId);
      const { json: registrySet } = await config.httpClient(user['interop:hasRegistrySet']);
      const { json: dataRegistry } = await config.httpClient(registrySet['interop:hasDataRegistry']);

      if (dataRegistry['interop:hasDataRegistration']) {
        const results = await Promise.all(
          dataRegistry['interop:hasDataRegistration'].map((dataRegistrationUri: string) => {
            return getContainerFromDataRegistration(dataRegistrationUri, config);
          })
        );

        const newConfig = { ...config } as Configuration;

        newConfig.dataServers[webId].containers?.push(...results.flat());

        return newConfig;
      }
    }

    // Nothing to change
    return config;
  }
});

export default fetchDataRegistry;
