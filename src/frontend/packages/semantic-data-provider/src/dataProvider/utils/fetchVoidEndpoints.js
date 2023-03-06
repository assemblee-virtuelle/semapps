const defaultToArray = value => (!value ? undefined : Array.isArray(value) ? value : [value]);

const fetchVoidEndpoints = async config => {
  const fetchPromises = Object.entries(config.dataServers)
    .filter(([key, server]) => server.pod !== true)
    .map(([key, server]) =>
      config
        .httpClient(new URL('/.well-known/void', server.baseUrl).toString())
        .then(result => ({ key, datasets: result.json['@graph'] }))
        .catch(e => {
          if (e.status === 404 || e.status === 401 || e.status === 500) {
            return { key, error: e };
          } else {
            throw e;
          }
        })
    );

  let results = [];

  try {
    results = await Promise.all(fetchPromises);
  } catch (e) {
    // Do not throw error if no endpoint found
  }

  for (let result of results) {
    config.dataServers[result.key].containers = config.dataServers[result.key].containers || {};
    config.dataServers[result.key].blankNodes = config.dataServers[result.key].blankNodes || {};

    // Ignore unfetchable endpoints
    if (result.datasets) {
      for (let dataset of result.datasets) {
        const datasetServerKey = Object.keys(config.dataServers).find(
          key => dataset['void:uriSpace'] === config.dataServers[key].baseUrl
        );

        // If the dataset is not part of a server mapped in the dataServers, ignore it
        if (datasetServerKey) {
          // If this is the local dataset, add the base information
          if (datasetServerKey === result.key) {
            config.dataServers[result.key].name = config.dataServers[result.key].name || dataset['dc:title'];
            config.dataServers[result.key].description =
              config.dataServers[result.key].description || dataset['dc:description'];
            config.dataServers[result.key].sparqlEndpoint =
              config.dataServers[result.key].sparqlEndpoint || dataset['void:sparqlEndpoint'];
          }

          config.dataServers[result.key].containers[datasetServerKey] =
            config.dataServers[result.key].containers[datasetServerKey] || {};

          for (let partition of defaultToArray(dataset['void:classPartition'])) {
            for (let type of defaultToArray(partition['void:class'])) {
              // Set containers by type
              const path = partition['void:uriSpace'].replace(dataset['void:uriSpace'], '/');
              if (config.dataServers[result.key].containers[datasetServerKey][type]) {
                config.dataServers[result.key].containers[datasetServerKey][type].push(path);
              } else {
                config.dataServers[result.key].containers[datasetServerKey][type] = [path];
              }

              // Set blank nodes by containers
              const blankNodes = defaultToArray(partition['semapps:blankNodes']);
              if (blankNodes) {
                config.dataServers[result.key].blankNodes[partition['void:uriSpace']] = defaultToArray(
                  partition['semapps:blankNodes']
                );
              }
            }
          }
        }
      }
    }
  }
};

export default fetchVoidEndpoints;
