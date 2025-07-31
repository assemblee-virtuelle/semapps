import jwtDecode from 'jwt-decode';
import { capitalCase } from 'change-case';
import { Configuration, Plugin, TypeRegistration } from '../types';
import arrayOf from '../utils/arrayOf';
import expandTypes from '../utils/expandTypes';

/**
 * Plugin to add type indexes to the user containers, by fetching the them.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */
const fetchTypeIndexes = (): Plugin => ({
  transformConfig: async (config: Configuration) => {
    const token = localStorage.getItem('token');

    // If the user is logged in
    if (token) {
      const payload: { [k: string]: string | number } = jwtDecode(token);
      const webId = (payload.webId as string) || (payload.webid as string); // Currently we must deal with both formats

      if (!config.dataServers[webId])
        throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);

      const { json: user } = await config.httpClient(webId);

      const typeRegistrations: { public: TypeRegistration[]; private: TypeRegistration[] } = {
        public: [],
        private: []
      };

      if (user['solid:publicTypeIndex']) {
        const { json: publicTypeIndex } = await config.httpClient(user['solid:publicTypeIndex']);
        if (publicTypeIndex) {
          typeRegistrations.public = arrayOf(publicTypeIndex['solid:hasTypeRegistration']);
        }
      }

      if (user['pim:preferencesFile']) {
        const { json: preferencesFile } = await config.httpClient(user['pim:preferencesFile']);
        if (preferencesFile?.['solid:privateTypeIndex']) {
          const { json: privateTypeIndex } = await config.httpClient(preferencesFile['solid:privateTypeIndex']);
          typeRegistrations.private = arrayOf(privateTypeIndex['solid:hasTypeRegistration']);
        }
      }

      if (typeRegistrations.public.length > 0 || typeRegistrations.private.length > 0) {
        const newConfig = { ...config } as Configuration;

        for (const mode of Object.keys(typeRegistrations)) {
          for (const typeRegistration of typeRegistrations[mode as keyof typeof typeRegistrations]) {
            const types = arrayOf(typeRegistration['solid:forClass']);
            const container = {
              label: { en: capitalCase(types[0].split(':')[1], { separateNumbers: true }) },
              path: typeRegistration['solid:instanceContainer'].replace(newConfig.dataServers[webId].baseUrl, ''),
              types: await expandTypes(types, user['@context']),
              private: mode === 'private'
            };

            const containerIndex = newConfig.dataServers[webId].containers.findIndex(c => c.path === container.path);

            if (containerIndex !== -1) {
              // If a container with this URI already exist, add type registration information if they are not set
              newConfig.dataServers[webId].containers[containerIndex] = {
                ...container,
                ...newConfig.dataServers[webId].containers[containerIndex]
              };
            } else {
              newConfig.dataServers[webId].containers.push(container);
            }
          }
        }

        return newConfig;
      }
    }

    return config;
  }
});

export default fetchTypeIndexes;
