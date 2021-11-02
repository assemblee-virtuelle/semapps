import jwtDecode from 'jwt-decode';

const getContainerFromUri = str => str.match(new RegExp(`(.*)/.*`))[1];

const fetchPodConfig = async config => {
  const podKey = Object.keys(config.dataServers).find(key => config.dataServers[key].pod === true);

  // If we have a POD in our server
  if (podKey) {
    const token = localStorage.getItem('token');

    // If the user is logged in
    if (token) {
      const { webId } = jwtDecode(token);

      // TODO find POD URI and SPARQL endpoint from user profile
      const podUri = getContainerFromUri(webId);

      // Fill the config provided to the data provider
      config.dataServers[podKey].name = 'My Pod';
      config.dataServers[podKey].baseUrl = podUri;
      config.dataServers[podKey].sparqlEndpoint = podUri + '/sparql';
    }
  }
};

export default fetchPodConfig;
