import { fetchUtils } from 'react-admin';

const httpClient = (url, options = {}) => {
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

  const token = localStorage.getItem('token');
  if (token) options.headers.set('Authorization', `Bearer ${token}`);

  return fetchUtils.fetchJson(url, options);
};

export default httpClient;
