import jsonld from 'jsonld';
import isobject from 'isobject';

export const isType = (type, resource) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const fetchContainers = async (containers, resourceId, params, config) => {
  const { dataServers, httpClient, jsonContext } = config;

  // Transform in an containerUri:serverKey object
  const containersServers = Object.keys(containers).reduce(
    (acc, serverKey) => ({
      ...acc,
      ...Object.fromEntries(containers[serverKey].map(containerUri => [containerUri, serverKey]))
    }),
    {}
  );

  const fetchPromises = Object.keys(containersServers).map(containerUri =>
    httpClient(containerUri, {
      noToken: !containersServers[containerUri] || dataServers[containersServers[containerUri]].authServer !== true
    })
      .then(({ json }) => {
        // If container's context is different, compact it to have an uniform result
        // TODO deep compare if the context is an object
        if (json['@context'] !== jsonContext) {
          return jsonld.compact(json, jsonContext);
        } else {
          return json;
        }
      })
      .then(json => {
        if (isType('ldp:Container', json)) {
          return json['ldp:contains'];
        } else {
          throw new Error(containerUri + ' is not a LDP container');
        }
      })
  );

  // Fetch simultaneously all containers
  let results = await Promise.all(fetchPromises);

  if (results.length === 0) {
    return { data: [], total: 0 };
  } else {
    // Merge all results in one array
    results = [].concat.apply(...results);

    let returnData = results.map(item => {
      item.id = item.id || item['@id'];
      return item;
    });

    // Apply filter to results
    if (params.filter) {
      // For SPARQL queries, we use "a" to filter types, but in containers it must be "type"
      if (params.filter.a) {
        params.filter.type = params.filter.a;
        delete params.filter.a;
      }

      if (Object.keys(params.filter).length > 0) {
        returnData = returnData.filter(resource => {
          return Object.entries(params.filter).some(([k, v]) => {
            if (k == 'q') {
              // if fiter is q, all properties have to be checked
              return Object.entries(resource).some(([kr, vr]) => {
                if (!isobject(vr)) {
                  return Array.isArray(vr) ? vr.some(va=>va.includes(v)) : vr.includes(v)
                } else {
                  return false;
                }
              })
            } else {
              return Array.isArray(resource[k]) ? resource[k].includes(v) : resource[k].includes(v)
            }
          })
        });
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

    return { data: returnData, total: results.length };
  }
};

export default fetchContainers;
