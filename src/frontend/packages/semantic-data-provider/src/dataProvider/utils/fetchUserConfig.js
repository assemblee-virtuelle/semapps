import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';
import getServerKeyFromType from './getServerKeyFromType';

const fetchUserConfig = async config => {
  const { dataServers, httpClient } = config;
  const token = localStorage.getItem('token');
  const podKey = getServerKeyFromType('pod', dataServers);
  const authServerKey = getServerKeyFromType('authServer', dataServers);

  // If the user is logged in
  if (token) {
    const payload = jwtDecode(token);
    const webId = payload.webId || payload.webid; // Currently we must deal with both formats
    let userData;

    try {
      const { json } = await httpClient(webId);
      userData = json;
    } catch (e) {
      console.error(e);
      // If the webId cannot be fetched, assume an invalid token and disconnect the user
      localStorage.clear();
      window.location.reload();
      return;
    }

    // If we have a POD server
    if (podKey) {
      // Fill the config provided to the data provider
      // We must modify the config object directly
      config.dataServers[podKey].name = 'My Pod';
      config.dataServers[podKey].baseUrl = userData['pim:storage'] || urlJoin(webId, 'data');
      config.dataServers[podKey].sparqlEndpoint =
        userData.endpoints?.['void:sparqlEndpoint'] || urlJoin(webId, 'sparql');
    }

    if (authServerKey) {
      // Fill the config provided to the data provider
      // We must modify the config object directly
      config.dataServers[authServerKey].proxyUrl = userData.endpoints?.proxyUrl;
    }
  } else if (podKey) {
    // If the user is not logged in, ignore the POD server
    delete config.dataServers[podKey];
  }
};

export default fetchUserConfig;
