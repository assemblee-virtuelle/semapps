import { fetchUtils } from 'react-admin';
import getServerKeyFromUri from './utils/getServerKeyFromUri';
import getServerKeyFromType from './utils/getServerKeyFromType';
import { DataServersConfig } from './types';

/**
 *
 * @param dataServers Data servers configuration
 * @param fetchFn The fetch function to use for the actual fetch call, e.g. `fetchUtils.fetchJson` or `fetch`
 * @returns
 */
const fetchBase =
  <FetchFn extends (url: string, options: fetchUtils.Options) => ReturnType<FetchFn>>(
    dataServers: DataServersConfig,
    fetchFn: FetchFn
  ) =>
  (url: string, options: fetchUtils.Options = {}): ReturnType<FetchFn> => {
    if (!url) throw new Error(`No URL provided on httpClient call`);

    const authServerKey = getServerKeyFromType('authServer', dataServers);
    if (!authServerKey) throw new Error(`No auth server configured in data servers`);

    const serverKey = getServerKeyFromUri(url, dataServers);

    const headers = new Headers(options.headers);

    switch (options.method) {
      case 'POST':
      case 'PATCH':
      case 'PUT':
        if (!headers.has('Accept')) headers.set('Accept', 'application/ld+json');
        if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/ld+json');
        break;

      case 'DELETE':
        break;

      case 'GET':
      default:
        if (!headers.has('Accept')) headers.set('Accept', 'application/ld+json');
        break;
    }

    // Use proxy if...
    if (
      serverKey !== authServerKey && // The server is different from the auth server.
      dataServers[authServerKey]?.proxyUrl && // A proxy URL is configured on the auth server.
      dataServers[serverKey]?.noProxy !== true // The server does not explicitly disable the proxy.
    ) {
      // To the proxy endpoint, we post the URL, method, headers and body (if any) as multipart/form-data.
      const formData = new FormData();

      formData.append('id', url);
      formData.append('method', options.method || 'GET');
      formData.append('headers', JSON.stringify(Object.fromEntries(headers.entries())));

      if (options.body instanceof File) {
        formData.append('body', options.body, options.body.name);
      } else if (options.body instanceof Blob || typeof options.body === 'string') {
        formData.append('body', options.body);
      }

      // POST request to proxy endpoint.
      return fetchFn(dataServers[authServerKey].proxyUrl, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        body: formData
      });
    }

    // Add token if the server is the same as the auth server.
    if (serverKey === authServerKey) {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }
    options.headers = headers;
    return fetchFn(url, options);
  };

/**
 * Creates a fetch function that can be used to make calls to the data servers and which returns data formatted as JSON.
 * It will use the proxy endpoint if available and if the server is different from the auth server.
 * It will also set the Accept and Content-Type headers to `application/ld+json` for `POST`, `PATCH`, `PUT` and `GET` requests.
 * @param dataServers Data servers configuration
 * @returns A function with react-admin's fetchJson signature that can be used to make calls to the data servers.
 *
 */
const httpClient = (dataServers: DataServersConfig) => {
  const fetchBaseFn = fetchBase(dataServers, fetchUtils.fetchJson);

  return (url: string, options: fetchUtils.Options) => {
    return fetchBaseFn(url, options);
  };
};

/**
 * Creates an authenticated fetch function that can be used to make calls to the data servers.
 * It will use the proxy endpoint if available and if the server is different from the auth server.
 * @param dataServers Data servers configuration
 * @returns A function that can be used to make authenticated fetch calls.
 */
const authFetch = (dataServers: DataServersConfig) => {
  const fetchBaseFn = fetchBase(dataServers, fetch);

  return (url: string, options: fetchUtils.Options) => {
    return fetchBaseFn(url, options);
  };
};

export { httpClient, authFetch };
