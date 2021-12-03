const fetchVoidEndpoints = async config => {
  const fetchPromises = Object.values(config.dataServers)
    .filter(server => server.pod !== true)
    .map(server =>
      config
        .httpClient(new URL('/.well-known/void', server.baseUrl))
        .then(result => ({ data: result.json }))
        .catch(e => {
          if (e.status === 404) {
            return { error: e };
          } else {
            throw e;
          }
        })
    );

  const results = await Promise.all(fetchPromises);

  for (let result of results) {
    // Ignore unfetchable endpoints
    if (result.data) {
      // TODO modify config.dataServers based on the VOID configs returned
    }
  }
};

export default fetchVoidEndpoints;
