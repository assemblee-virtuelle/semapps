import jwtDecode from 'jwt-decode';
import { Configuration, Plugin } from '../types';
import getContainerFromDataRegistration from '../utils/getContainerFromDataRegistration';

const fetchDataRegistry = (): Plugin => ({
  transformConfig: async (config: Configuration) => {
    const token = localStorage.getItem('token');

    // If the user is logged in
    if (token) {
      if (!config.dataServers.user)
        throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);

      const payload: { [k: string]: string | number } = jwtDecode(token);
      const webId = (payload.webId as string) || (payload.webid as string); // Currently we must deal with both formats
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

        newConfig.dataServers.user.containers?.push(...results.flat());

        return newConfig;
      }
    }

    // Nothing to change
    return config;
  }
});

export default fetchDataRegistry;
