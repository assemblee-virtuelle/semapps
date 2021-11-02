import buildSparqlQuery from '../utils/buildSparqlQuery';
import getEmbedFrame from '../utils/getEmbedFrame';
import jsonld from 'jsonld';

export const isType = (type, resource) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const getListMethod = config => async (resourceId, params) => {
  let { sparqlEndpoint, httpClient, resources, ontologies, jsonContext } = config;

  if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

  if (params.id || params['@id'] || resources[resourceId].fetchContainer) {
    const url = params.id || params['@id'] || resources[resourceId].containerUri;
    let { json } = await httpClient(url);

    if (isType('ldp:Container', json)) {
      /*
       * LDP Container
       */
      let returnData = json['ldp:contains'].map(item => {
        item.id = item.id || item['@id'];
        return item;
      });

      // Apply filter to results
      if (params.filter) {
        // Remove search params from filter
        if (params.filter.q) {
          delete params.filter.q;
        }
        if (Object.keys(params.filter).length > 0) {
          returnData = returnData.filter(resource =>
            Object.entries(params.filter).some(([k, v]) =>
              Array.isArray(resource[k]) ? resource[k].includes(v) : resource[k] === v
            )
          );
        }
      }

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

      return { data: returnData, total: json['ldp:contains'].length };
    } else {
      /*
       * ActivityPub collection
       */

      // If the collection is split amongst several pages, get the first page
      if (json.first) {
        const result = await httpClient(json.first);
        json = result.json;
      }

      const listProperty = ['as:orderedItems', 'orderedItems', 'as:items', 'items'].find(p => json[p]);
      if (!listProperty) return { data: [], total: 0 };

      // TODO fetch several pages depending on params.pagination

      let returnData = json[listProperty].map(item => {
        item.id = item.id || item['@id'];
        return item;
      });

      return { data: returnData, total: json.totalItems };
    }
  } else {
    const sparqlQuery = buildSparqlQuery({
      types: resources[resourceId].types,
      params: { ...params, filter: { ...resources[resourceId].filter, ...params.filter } },
      dereference: resources[resourceId].dereference,
      ontologies
    });

    const { json } = await httpClient(sparqlEndpoint, {
      method: 'POST',
      body: sparqlQuery
    });

    const frame = {
      '@context': jsonContext,
      '@type': resources[resourceId].types,
      // Embed only what we explicitly asked to dereference
      // Otherwise we may have same-type resources embedded in other resources
      '@embed': '@never',
      ...getEmbedFrame(resources[resourceId].dereference)
    };

    // omitGraph option force results to be in a @graph, even if we have a single result
    const compactJson = await jsonld.frame(json, frame, { omitGraph: false });

    if (Object.keys(compactJson).length === 1) {
      // If we have only the context, it means there is no match
      return { data: [], total: 0 };
    } else {
      // Add id in addition to @id, as this is what React-Admin expects
      let returnData = compactJson['@graph'].map(item => {
        item.id = item.id || item['@id'];
        return item;
      });

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

      return { data: returnData, total: compactJson['@graph'].length };
    }

    // OTHER METHOD: FETCH ONLY RESOURCES URIs AND FETCH THEM INDEPENDENTLY
    // TODO compare the performance of the two methods, and eventually allow both of them
    //
    // const sparqlQuery = buildSparqlUriQuery({
    //   types: resources[resourceId].types,
    //   params: { ...params, filter: { ...resources[resourceId].filter, ...params.filter } },
    //   ontologies
    // });
    //
    // let { json } = await httpClient(sparqlEndpoint, {
    //   method: 'POST',
    //   body: sparqlQuery
    // });
    //
    // const total = json.length;
    //
    // if (params.pagination) {
    //   json = json.slice(
    //     (params.pagination.page - 1) * params.pagination.perPage,
    //     params.pagination.page * params.pagination.perPage
    //   );
    // }
    //
    // let data = await Promise.allSettled(
    //   json.map(result => httpClient(result.resource.value).then(result => result.json))
    // );
    //
    // // Ignore resources we were not able to fetch
    // data = data.filter(r => r.status === 'fulfilled').map(r => r.value);
    //
    // return { data, total };
  }
};

export default getListMethod;
