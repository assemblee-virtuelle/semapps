import jsonld from 'jsonld';
import isobject from 'isobject';

export const isType = (type, resource) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const fetchContainers = async (containers, resourceId, params, config) => {
  const { httpClient, jsonContext } = config;

  // Transform in an containerUri:serverKey object
  const containersServers = Object.keys(containers).reduce(
    (acc, serverKey) => ({
      ...acc,
      ...Object.fromEntries(containers[serverKey].map(containerUri => [containerUri, serverKey]))
    }),
    {}
  );

  const fetchPromises = Object.keys(containersServers).map(containerUri =>
    httpClient(containerUri)
      .then(({ json }) => {
        // If container's context is different, compact it to have an uniform result
        // TODO deep compare if the context is an object
        if (json['@context'] !== jsonContext) {
          return jsonld.compact(json, jsonContext);
        }
        return json;
      })
      .then(json => {
        if (isType('ldp:Container', json)) {
          return json['ldp:contains'];
        }
        throw new Error(`${containerUri} is not a LDP container`);
      })
  );

  // Fetch simultaneously all containers
  let results = await Promise.all(fetchPromises);

  if (results.length === 0) {
    return { data: [], total: 0 };
  }
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
        return Object.entries(params.filter).every(([k, v]) => {
          if (k == 'q') {
            return Object.entries(resource).some(([kr, vr]) => {
              if (!isobject(vr)) {
                const arrayValues = Array.isArray(vr) ? vr : [vr];
                return arrayValues.some(va => {
                  if (typeof va === 'string' || va instanceof String) {
                    return va.toLowerCase().normalize('NFD').includes(v.toLowerCase().normalize('NFD'));
                  }
                });
              }
              return false;
            });
          }
          if (resource[k]) {
            return Array.isArray(resource[k]) ? resource[k].some(va => va.includes(v)) : resource[k].includes(v);
          }
          return false;
        });
      });
    }
  }

  if (params.sort) {
    returnData = returnData.sort((a, b) => {
      if (a[params.sort.field] && b[params.sort.field]) {
        if (params.sort.order === 'ASC') {
          return a[params.sort.field].localeCompare(b[params.sort.field]);
        }
        return b[params.sort.field].localeCompare(a[params.sort.field]);
      }
      return true;
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

export default fetchContainers;
