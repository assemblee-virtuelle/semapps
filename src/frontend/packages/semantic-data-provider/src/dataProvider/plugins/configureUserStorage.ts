import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';
import { Configuration } from '../types';

const configureUserStorage = async (config: Configuration) => {
  const token = localStorage.getItem('token');

  // If the user is logged in
  if (token) {
    const payload = jwtDecode(token);
    const webId = payload.webId || payload.webid; // Currently we must deal with both formats
    const { json: user } = await config.httpClient(webId);

    if (user) {
      const newConfig = { ...config } as Configuration;

      newConfig.dataServers.user = {
        pod: true,
        default: true,
        baseUrl: user['pim:storage'] || urlJoin(webId, 'data'),
        sparqlEndpoint: user.endpoints?.['void:sparqlEndpoint'] || urlJoin(webId, 'sparql'),
        proxyUrl: user.endpoints?.proxyUrl,
        containers: []
      };

      newConfig.jsonContext = [
        'https://www.w3.org/ns/activitystreams',
        urlJoin(new URL(webId).origin, '/.well-known/context.jsonld')
      ];

      return newConfig;
    }
  }

  // Nothing to change
  return config;
};

export default configureUserStorage;
