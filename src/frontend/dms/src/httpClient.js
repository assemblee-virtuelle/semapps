import { fetchUtils } from 'react-admin';

const httpClient = (url, options = {}) => {
  if (!options.headers) options.headers = new Headers();

  switch(options.method) {
    case 'POST':
    case 'PATCH':
      options.headers.set('Accept', 'application/ld+json');
      options.headers.set('Content-Type', 'application/ld+json');
      break;

    case 'DELETE':
      break;

    case 'GET':
    default:
      options.headers.set('Accept', 'application/ld+json');
      break;
  }

  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

export default httpClient;
