import { fetchUtils } from 'react-admin';
import jwtDecode from 'jwt-decode';
import getServerKeyFromUri from './utils/getServerKeyFromUri';
import getServerKeyFromType from './utils/getServerKeyFromType';

/*
 * HTTP client used by all calls in data provider and auth provider
 * Do proxy calls if a proxy endpoint is available and the server is different from the auth server
 */
const httpClient =
  dataServers =>
  (url, options = {}) => {
    if (!url) throw new Error(`No URL provided on httpClient call`);

    const token = localStorage.getItem('token');
    let webId = localStorage.getItem('webId');

    if (!webId) {
      const payload = jwtDecode(token);
      webId = payload.webId || payload.webid; // Currently we must deal with both formats
      localStorage.setItem('webId', webId);
    }

    const authServerKey = getServerKeyFromType('authServer', dataServers);
    const serverKey = getServerKeyFromUri(url, dataServers);
    const useProxy =
      serverKey !== authServerKey && dataServers[webId]?.proxyUrl && dataServers[serverKey]?.noProxy !== true;

    if (!options.headers) options.headers = new Headers();

    switch (options.method) {
      case 'POST':
      case 'PATCH':
      case 'PUT':
        if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
        if (!options.headers.has('Content-Type')) options.headers.set('Content-Type', 'application/ld+json');
        break;

      case 'DELETE':
        break;

      case 'GET':
      default:
        if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
        break;
    }

    if (useProxy) {
      const formData = new FormData();

      formData.append('id', url);
      formData.append('method', options.method || 'GET');
      formData.append('headers', JSON.stringify(Object.fromEntries(options.headers.entries())));

      if (options.body) {
        if (options.body instanceof File) {
          formData.append('body', options.body, options.body.name);
        } else {
          formData.append('body', options.body);
        }
      }

      // Post to proxy endpoint with multipart/form-data format
      return fetchUtils.fetchJson(dataServers[webId].proxyUrl, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`
        }),
        body: formData
      });
    }

    // Add token if the server is the same as the auth server
    if (token && serverKey === authServerKey) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
  };

export default httpClient;
