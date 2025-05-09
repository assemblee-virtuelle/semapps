import jwtDecode from 'jwt-decode';
import LinkHeader from 'http-link-header';
import { Configuration, Plugin } from '../types';
import arrayOf from '../utils/arrayOf';
import getContainerFromDataRegistration from '../utils/getContainerFromDataRegistration';

/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */
const fetchAppRegistration = (): Plugin => ({
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

            // Load data grants concurrently to improve performances
            const results = await Promise.all(
              arrayOf(appRegistration['interop:hasAccessGrant']).map(async accessGrantUri => {
                const { json: accessGrant } = await config.httpClient(accessGrantUri);
                return Promise.all(
                  arrayOf(accessGrant['interop:hasDataGrant']).map(async dataGrantUri => {
                    const { json: dataGrant } = await config.httpClient(dataGrantUri);
                    const container = await getContainerFromDataRegistration(
                      dataGrant['interop:hasDataRegistration'],
                      config
                    );
                    if (dataGrant['interop:scopeOfGrant'] === 'interop:SelectedFromRegistry') {
                      container.selectedResources = arrayOf(dataGrant['interop:hasDataInstance']);
                    }
                    return container;

                    // if (dataGrant['interop:scopeOfGrant'] === 'interop:AllFromRegistry') {
                    //   return getContainerFromDataRegistration(dataGrant['interop:hasDataRegistration'], config);
                    // } else {
                    //   return undefined;
                    // }
                  })
                );
              })
            );

            newConfig.dataServers.user.containers = results.flat().filter(i => i !== undefined);

            return newConfig;
          }
        }
      }
    }

    return config;
  }
});

export default fetchAppRegistration;
