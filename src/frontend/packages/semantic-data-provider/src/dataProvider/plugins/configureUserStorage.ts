import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';
import { Configuration, Plugin } from '../types';

const configureUserStorage = (): Plugin => ({
  transformConfig: async (config: Configuration) => {
    const token = localStorage.getItem('token');

    // If the user is logged in
    if (token) {
      const payload: { [k: string]: string | number } = jwtDecode(token);
      const webId = (payload.webId as string) || (payload.webid as string); // Currently we must deal with both formats
      const { json: user } = await config.httpClient(webId);

      if (user) {
        const newConfig = { ...config } as Configuration;

        newConfig.dataServers.user = {
          pod: true,
          default: true,
          authServer: true,
          baseUrl: user['pim:storage'] || urlJoin(webId, 'data'),
          sparqlEndpoint: user.endpoints?.['void:sparqlEndpoint'] || urlJoin(webId, 'sparql'),
          proxyUrl: user.endpoints?.proxyUrl,
          containers: []
        };

        if (!newConfig.jsonContext) {
          newConfig.jsonContext = [
            'https://www.w3.org/ns/activitystreams',
            urlJoin(new URL(webId).origin, '/.well-known/context.jsonld')
          ];
        }

        return newConfig;
      }
    }

    // Nothing to change
    return config;
  }
});

export default configureUserStorage;
