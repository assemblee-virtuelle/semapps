import jsonld from 'jsonld';
import getEmbedFrame from './getEmbedFrame';
import buildSparqlQuery from './buildSparqlQuery';

const compare = (a, b) => {
  switch (typeof a) {
    case 'string':
      return a.localeCompare(b);
    case 'number':
      return a - b;
    default:
      return 0;
  }
};

const fetchSparqlEndpoints = async (containers, resourceId, params, config) => {
  const { dataServers, resources, httpClient, jsonContext, ontologies } = config;
  const dataModel = resources[resourceId];

  const serversToQuery = containers.reduce((acc, cur) => {
    if (!acc.includes(cur.server)) acc.push(cur.server);
    return acc;
  }, []);

  const sparqlQueryPromises = serversToQuery.map(
    serverKey =>
      new Promise((resolve, reject) => {
        const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;

        const sparqlQuery = buildSparqlQuery({
          containersUris: containers.filter(c => c.server === serverKey).map(c => c.uri),
          params,
          dataModel,
          ontologies
        });

        httpClient(dataServers[serverKey].sparqlEndpoint, {
          method: 'POST',
          body: sparqlQuery
        })
          .then(({ json }) => {
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
          .then(compactJson => {
            if (compactJson['@id']) {
              const { '@context': context, ...rest } = compactJson;
              compactJson = {
                '@context': context,
                '@graph': [rest]
              };
            }
            resolve(
              compactJson['@graph']?.map(resource => ({ '@context': compactJson['@context'], ...resource })) || []
            );
          })
          .catch(e => reject(e));
      })
  );

  // Run simultaneous SPARQL queries
  let results = await Promise.all(sparqlQueryPromises);

  if (results.length === 0) {
    return { data: [], total: 0 };
  }
  // Merge all results in one array
  results = [].concat(...results);

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
