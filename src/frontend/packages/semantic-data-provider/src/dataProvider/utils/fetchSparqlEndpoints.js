import getEmbedFrame from './getEmbedFrame';
import buildSparqlQuery from './buildSparqlQuery';
import jsonld from 'jsonld';

const fetchSparqlEndpoints = async (containers, resourceId, params, config) => {
  const { dataServers, resources, httpClient, jsonContext, ontologies } = config;
  const dataModel = resources[resourceId];

  // By default, embed only what we explicitly asked to dereference
  // Otherwise we may have same-type resources embedded in other resources
  // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
  const frame = dataModel.list?.explicitEmbedOnFraming !== false
    ? {
        '@context': jsonContext,
        '@type': dataModel.types,
        '@embed': '@never',
        ...getEmbedFrame(params.filter?.dereference || dataModel.list?.dereference)
      }
    : {
        '@context': jsonContext,
        '@type': dataModel.types,
      };

  const sparqlQueryPromises = Object.keys(containers).map(
    serverKey =>
      new Promise((resolve, reject) => {
        const sparqlQuery = buildSparqlQuery({
          containers: containers[serverKey],
          params: { ...params, filter: { ...dataModel.list?.filter, ...params.filter } },
          dereference: params.filter?.dereference || dataModel.list?.dereference,
          ontologies
        });

        httpClient(dataServers[serverKey].sparqlEndpoint, {
          method: 'POST',
          body: sparqlQuery,
          noToken: dataServers[serverKey].authServer !== true
        })
          .then(({ json }) => {
            // omitGraph option force results to be in a @graph, even if we have a single result
            return jsonld.frame(json, frame, { omitGraph: false });
          })
          .then(compactJson => {
            resolve(compactJson['@graph'] || []);
          })
          .catch(e => reject(e));
      })
  );

  // Run simultaneous SPARQL queries
  let results = await Promise.all(sparqlQueryPromises);

  if (results.length === 0) {
    return { data: [], total: 0 };
  } else {
    // Merge all results in one array
    results = [].concat.apply(...results);

    // Add id in addition to @id, as this is what React-Admin expects
    let returnData = results.map(item => {
      item.id = item.id || item['@id'];
      return item;
    });

    // TODO sort and paginate the results in the SPARQL query to improve performances
    if (params.sort) {
      returnData = returnData.sort((a, b) => {
        if (a[params.sort.field] && b[params.sort.field]) {
          if (params.sort.order === 'ASC') {
            return a[params.sort.field].localeCompare(b[params.sort.field]);
          } else {
            return b[params.sort.field].localeCompare(a[params.sort.field]);
          }
        } else {
          return true;
        }
      });
    }
    if (params.pagination) {
      returnData = returnData.slice(
        (params.pagination.page - 1) * params.pagination.perPage,
        params.pagination.page * params.pagination.perPage
      );
    }

    return { data: returnData, total: results.length };
  }
};

export default fetchSparqlEndpoints;
