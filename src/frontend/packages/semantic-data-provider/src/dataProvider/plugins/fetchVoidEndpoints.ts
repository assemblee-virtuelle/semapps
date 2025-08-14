import { Configuration, VoidResults, VoidDataset, ResponseError, Plugin } from '../types';
import arrayOf from '../utils/arrayOf';
import expandTypes from '../utils/expandTypes';

const fetchVoidEndpoints = (): Plugin => ({
  name: 'fetchVoidEndpoints',
  transformConfig: async config => {
    let results = [] as VoidResults[];

    try {
      results = await Promise.all(
        Object.entries(config.dataServers)
          .filter(([_, server]) => server.pod !== true && server.void !== false)
          .map(async ([key, server]) =>
            config
              .httpClient(new URL('/.well-known/void', server.baseUrl).toString())
              .then(result => ({
                key,
                context: result.json?.['@context'],
                datasets: result.json?.['@graph'] as VoidDataset[]
              }))
              .catch((e: ResponseError) => {
                if (e.status === 404 || e.status === 401 || e.status === 500) {
                  return { key, error: e.message };
                }
                throw e;
              })
          )
      );
    } catch (e) {
      // Do not throw error if no endpoint found
    }

    results = results.filter(result => result.datasets);

    if (results.length > 0) {
      const newConfig = { ...config };

      for (const result of results) {
        // Ignore unfetchable endpoints
        if (result.datasets) {
          for (const dataset of result.datasets) {
            newConfig.dataServers[result.key].name ??= dataset['dc:title'];
            newConfig.dataServers[result.key].description ??= dataset['dc:description'];
            newConfig.dataServers[result.key].sparqlEndpoint ??= dataset['void:sparqlEndpoint'];
            newConfig.dataServers[result.key].containers ??= [];

            for (const partition of arrayOf(dataset['void:classPartition'])) {
              for (const type of arrayOf(partition['void:class'])) {
                const path = partition['void:uriSpace'].replace(dataset['void:uriSpace'], '/');
                const expandedTypes = await expandTypes([type], result.context);

                const containerIndex = newConfig.dataServers[result.key].containers.findIndex(c => c.path === path);

                if (containerIndex !== -1) {
                  // If a container with this path already exist, merge types
                  const mergedTypes = [
                    ...newConfig.dataServers[result.key].containers[containerIndex].types!,
                    ...expandedTypes
                  ].filter((v, i, a) => a.indexOf(v) === i);
                  newConfig.dataServers[result.key].containers[containerIndex] = {
                    ...newConfig.dataServers[result.key].containers[containerIndex],
                    types: mergedTypes,
                    binaryResources: mergedTypes.includes('http://semapps.org/ns/core#File')
                  };
                } else {
                  newConfig.dataServers[result.key].containers.push({
                    path,
                    types: expandedTypes,
                    binaryResources: expandedTypes.includes('http://semapps.org/ns/core#File')
                  });
                }
              }
            }
          }
        }
      }

      return newConfig;
    } else {
      return config;
    }
  }
});

export default fetchVoidEndpoints;
