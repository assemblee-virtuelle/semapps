import jwtDecode from 'jwt-decode';
import LinkHeader from 'http-link-header';
import urlJoin from 'url-join';
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

            for (const accessGrantUri of arrayOf(appRegistration['hasAccessGrant:hasDataGrant'])) {
              const { json: accessGrant } = await config.httpClient(accessGrantUri);

              for (const dataGrantUri of arrayOf(accessGrant['interop:hasDataGrant'])) {
                const { json: dataGrant } = await config.httpClient(dataGrantUri);

                const container = await getContainerFromDataRegistration(
                  dataGrant['interop:hasDataRegistration'],
                  config
                );

                newConfig.dataServers.user.containers?.push(container);
              }
            }

            return newConfig;
          }
        }
      }
    }

    return config;
  }
});

export default fetchAppRegistration;
