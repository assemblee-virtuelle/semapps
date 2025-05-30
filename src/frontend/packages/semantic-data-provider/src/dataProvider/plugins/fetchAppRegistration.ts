import jwtDecode from 'jwt-decode';
import LinkHeader from 'http-link-header';
import { Configuration, Plugin } from '../types';
import arrayOf from '../utils/arrayOf';
import getContainerFromDataRegistration from '../utils/getContainerFromDataRegistration';

type PluginConfiguration = {
  includeSelectedResources: boolean;
};

/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */
const fetchAppRegistration = (pluginConfig = {} as PluginConfiguration): Plugin => {
  const { includeSelectedResources = true } = pluginConfig;
  return {
    transformConfig: async (config: Configuration) => {
      const token = localStorage.getItem('token');

      // If the user is logged in
      if (token) {
        const payload: { [k: string]: string | number } = jwtDecode(token);
        const webId = (payload.webId as string) || (payload.webid as string); // Currently we must deal with both formats

        const { json: user } = await config.httpClient(webId);
        const authAgentUri = user['interop:hasAuthorizationAgent'];

        if (authAgentUri) {
          // Find if an application registration is linked to this user
          // See https://solid.github.io/data-interoperability-panel/specification/#agent-registration-discovery
          const { headers } = await config.httpClient(authAgentUri);
          if (headers.has('Link')) {
            const linkHeader = LinkHeader.parse(headers.get('Link')!);
            const registeredAgentLinkHeader = linkHeader.rel('http://www.w3.org/ns/solid/interop#registeredAgent');

            if (registeredAgentLinkHeader.length > 0) {
              const appRegistrationUri = registeredAgentLinkHeader[0].anchor;
              const { json: appRegistration } = await config.httpClient(appRegistrationUri);

              const newConfig = { ...config } as Configuration;

              // Load access grants concurrently to improve performances
              const results = await Promise.all(
                arrayOf(appRegistration['interop:hasAccessGrant']).map(async accessGrantUri => {
                  const { json: accessGrant } = await config.httpClient(accessGrantUri);
                  const container = await getContainerFromDataRegistration(
                    accessGrant['interop:hasDataRegistration'],
                    config
                  );
                  container.server = accessGrant['interop:dataOwner'];

                  if (accessGrant['interop:scopeOfGrant'] === 'interop:AllFromRegistry') {
                    return container;
                  } else if (accessGrant['interop:scopeOfGrant'] === 'interop:SelectedFromRegistry') {
                    if (!includeSelectedResources) return undefined;
                    container.selectedResources = arrayOf(accessGrant['interop:hasDataInstance']);
                    return container;
                  }
                })
              );

              // Put data shared by other users in other servers (storages)
              for (const container of results.flat().filter(i => i !== undefined)) {
                if (!newConfig.dataServers[container.server!]) {
                  newConfig.dataServers[container.server!] = {
                    pod: true,
                    baseUrl: `${container.server!}/data`,
                    containers: [container]
                  };
                } else {
                  newConfig.dataServers[container.server!].containers.push(container);
                }
              }

              return newConfig;
            }
          }
        }
      }

      return config;
    }
  };
};

export default fetchAppRegistration;
