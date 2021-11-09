import jwtDecode from 'jwt-decode';
import getServerKeyFromType from './getServerKeyFromType';

const getContainerFromUri = str => str.match(new RegExp(`(.*)/.*`))[1];

const fetchUserConfig = async config => {
  const { dataServers, httpClient } = config;
  const token = localStorage.getItem('token');
  const podKey = getServerKeyFromType('pod', dataServers);
  const authServerKey = getServerKeyFromType('authServer', dataServers);

  // If the user is logged in
  if (token) {
    const { webId } = jwtDecode(token);
    const { json: userData } = await httpClient(webId);

    // TODO find POD URI from user profile
    const podUri = getContainerFromUri(webId);

    // If we have a POD server
    if (podKey) {
      // Fill the config provided to the data provider
      // We must modify the config object directly
      config.dataServers[podKey].name = 'My Pod';
      config.dataServers[podKey].baseUrl = podUri;
      config.dataServers[podKey].sparqlEndpoint = userData.endpoints?.['void:sparqlEndpoint'] || podUri + '/sparql';
    }

    if (authServerKey) {
      // Fill the config provided to the data provider
      // We must modify the config object directly
      config.dataServers[authServerKey].proxyUrl = userData.endpoints?.proxyUrl || podUri + '/proxy';
    }
  } else {
    if (podKey) {
      // If the user is not logged in, ignore the POD server
      delete config.dataServers[podKey];
    }
  }
};

export default fetchUserConfig;