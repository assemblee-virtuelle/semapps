import jwtDecode from 'jwt-decode';
import getServerKeyFromType from './getServerKeyFromType';
import urlJoin from 'url-join';

const fetchUserConfig = async config => {
  const { dataServers, httpClient } = config;
  const token = localStorage.getItem('token');
  const podKey = getServerKeyFromType('pod', dataServers);
  const authServerKey = getServerKeyFromType('authServer', dataServers);

  // If the user is logged in
  if (token) {
    const { webId } = jwtDecode(token);
    let userData;

    try {
      const { json } = await httpClient(webId);
      userData = json;
    } catch(e) {
      console.error(e);
      // If the webId cannot be fetched, assume an invalid token and disconnect the user
      localStorage.removeItem('token');
      window.location.reload();
      return;
    }

    // If we have a POD server
    if (podKey) {
      // Fill the config provided to the data provider
      // We must modify the config object directly
      config.dataServers[podKey].name = 'My Pod';
      config.dataServers[podKey].baseUrl = urlJoin(webId, 'data'); // TODO find POD URI from user profile
      config.dataServers[podKey].sparqlEndpoint =
        userData.endpoints?.['void:sparqlEndpoint'] || urlJoin(webId, 'sparql');
    }

    if (authServerKey) {
      // Fill the config provided to the data provider
      // We must modify the config object directly
      config.dataServers[authServerKey].proxyUrl = userData.endpoints?.proxyUrl;
    }
  } else {
    if (podKey) {
      // If the user is not logged in, ignore the POD server
      delete config.dataServers[podKey];
    }
  }
};

export default fetchUserConfig;
