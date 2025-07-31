import jsonld from 'jsonld';
import getEmbedFrame from './getEmbedFrame';
import buildSparqlQuery from './buildSparqlQuery';
import fetchSelectedResources from './fetchSelectedResources';

const compare = (a: any, b: any) => {
  switch (typeof a) {
    case 'string':
      return a.localeCompare(b);
    case 'number':
      return a - b;
    default:
      return 0;
  }
};

const fetchSparqlEndpoints = async (containers: any, resourceId: any, params: any, config: any) => {
  const { dataServers, httpClient, jsonContext, ontologies } = config;
  const dataModel = config.resources[resourceId];

  // Find servers to query with SPARQL
  // (Ignore containers with selected resources, they will be fetched below)
  const serversToQuery = containers
    .filter((c: any) => !c.selectedResources)
    .reduce((acc, cur) => {
      if (!acc.includes(cur.server)) acc.push(cur.server);
      return acc;
    }, []);

  // Run simultaneous SPARQL queries
  const results = await Promise.all(
    serversToQuery.map(
      (serverKey: any) =>
        new Promise((resolve, reject) => {
          const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;

          const sparqlQuery = buildSparqlQuery({
            containersUris: containers.filter((c: any) => c.server === serverKey).map((c: any) => c.uri),
            params,
            dataModel,
            ontologies
          });

          httpClient(dataServers[serverKey].sparqlEndpoint, {
            method: 'POST',
            body: sparqlQuery
          })
            .then(({ json }: any) => {
              // If we declared the blank nodes to dereference, embed only those blank nodes
              // This solve problems which can occur when same-type resources are embedded in other resources
              // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
              const frame =
                blankNodes && dataModel.list?.explicitEmbedOnFraming !== false
                  ? {
                      '@context': jsonContext,
                      '@type': dataModel.types,
                      '@embed': '@never',
                      ...getEmbedFrame(blankNodes)
                    }
                  : {
                      '@context': jsonContext,
                      '@type': dataModel.types
                    };

              // omitGraph option force results to be in a @graph, even if we have a single result
              return jsonld.frame(json, frame, { omitGraph: false });
            })
            .then((compactJson: any) => {
              if (compactJson['@id']) {
                const { '@context': context, ...rest } = compactJson;
                compactJson = {
                  '@context': context,
                  '@graph': [rest]
                };
              }
              resolve(
                compactJson['@graph']?.map((resource: any) => ({
                  '@context': compactJson['@context'],
                  ...resource
                })) || []
              );
            })
            .catch((e: any) => reject(e));
        })
    )
  );

  // Merge results from all SPARQL servers
  let resources = results.flat();

  // Append selected resources to SPARQL query results
  const selectedResources = await fetchSelectedResources(
    containers,
    resources.map(r => r.id),
    config
  );
  resources = resources.concat(selectedResources);

  if (resources.length === 0) {
    return { data: [], total: 0 };
  }

  // Add id in addition to @id, as this is what React-Admin expects
  let returnData = results.map(item => {
    item.id = item.id || item['@id'];
    return item;
  });

  // TODO sort and paginate the results in the SPARQL query to improve performances
  if (params.sort) {
    returnData = returnData.sort((a, b) => {
      if (a[params.sort.field] !== undefined && b[params.sort.field] !== undefined) {
        if (params.sort.order === 'ASC') {
          return compare(a[params.sort.field], b[params.sort.field]);
        }
        return compare(b[params.sort.field], a[params.sort.field]);
      }
      return 0;
    });
  }
  if (params.pagination) {
    returnData = returnData.slice(
      (params.pagination.page - 1) * params.pagination.perPage,
      params.pagination.page * params.pagination.perPage
    );
  }

  return { data: returnData, total: results.length };
};

export default fetchSparqlEndpoints;
