import urlJoin from 'url-join';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';

export const defaultToArray = (value: any) => (!value ? undefined : Array.isArray(value) ? value : [value]);

// Transform the URI to the one used to find the ACL
// To be compatible with all servers, we should do a HEAD request to the resource URI
export const getAclUri = (resourceUri: string) => {
  const parsedUrl = new URL(resourceUri);
  return urlJoin(parsedUrl.origin, '_acl', parsedUrl.pathname);
};

export const getAclContext = (baseUri: string) => ({
  '@base': baseUri,
  acl: 'http://www.w3.org/ns/auth/acl#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  'acl:agent': { '@type': '@id' },
  'acl:agentGroup': { '@type': '@id' },
  'acl:agentClass': { '@type': '@id' },
  'acl:mode': { '@type': '@id' },
  'acl:accessTo': { '@type': '@id' }
});

export const getAuthServerUrl = async (dataProvider: SemanticDataProvider) => {
  const dataServers = await dataProvider.getDataServers();
  const authServer = Object.values(dataServers).find(server => server.authServer === true);
  if (!authServer) throw new Error('Could not find a server with authServer: true. Check your dataServers config.');
  // If the server is a Pod provider, return the root URL instead of https://domain.com/user/data
  return authServer.pod ? new URL(authServer.baseUrl).origin : authServer.baseUrl;
};

export const delay = async (t: number) =>
  new Promise(resolve => {
    setTimeout(resolve, t);
  });

// Check the value is a string starting with http and without any white space
export const isURL = (value: any) => typeof value === 'string' && value.startsWith('http') && !/\s/g.test(value);
