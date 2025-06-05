import { fetchUtils } from 'react-admin';
import getServerKeyFromUri from './utils/getServerKeyFromUri';
import getServerKeyFromType from './utils/getServerKeyFromType';

/*
 * HTTP client used by all calls in data provider and auth provider
 * Do proxy calls if a proxy endpoint is available and the server is different from the auth server
 */
const httpClient =
  (dataServers: any) =>
  (url: any, options = {}) => {
    if (!url) throw new Error(`No URL provided on httpClient call`);

    const authServerKey = getServerKeyFromType('authServer', dataServers);
    const serverKey = getServerKeyFromUri(url, dataServers);
    const useProxy =
      serverKey !== authServerKey && dataServers[authServerKey]?.proxyUrl && dataServers[serverKey]?.noProxy !== true;

    // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
    if (!options.headers) options.headers = new Headers();

    // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
    switch (options.method) {
      case 'POST':
      case 'PATCH':
      case 'PUT':
        // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
        if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
        // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
        if (!options.headers.has('Content-Type')) options.headers.set('Content-Type', 'application/ld+json');
        break;

      case 'DELETE':
        break;

      case 'GET':
      default:
        // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
        if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
        break;
    }

    if (useProxy) {
      const formData = new FormData();

      formData.append('id', url);
      // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
      formData.append('method', options.method || 'GET');
      // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
      formData.append('headers', JSON.stringify(Object.fromEntries(options.headers.entries())));

      // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
      if (options.body) {
        // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
        if (options.body instanceof File) {
          // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
          formData.append('body', options.body, options.body.name);
        } else {
          // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
          formData.append('body', options.body);
        }
      }

      // Post to proxy endpoint with multipart/form-data format
      return fetchUtils.fetchJson(dataServers[authServerKey].proxyUrl, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        body: formData
      });
    }
    // Add token if the server is the same as the auth server
    if (serverKey === authServerKey) {
      const token = localStorage.getItem('token');
      // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
      if (token) options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
  };

export default httpClient;
