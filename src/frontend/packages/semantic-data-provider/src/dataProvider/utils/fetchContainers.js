import jsonld from 'jsonld';
import isobject from 'isobject';
import arrayOf from './arrayOf';

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
          return arrayOf(json['ldp:contains']).map(resource => ({ '@context': json['@context'], ...resource }));
        }
        throw new Error(`${containerUri} is not a LDP container`);
      })
  );

  // Fetch simultaneously all containers
  const results = await Promise.all(fetchPromises);

  if (results.length === 0) {
    return { data: [], total: 0 };
  }

  let returnData = results.flatMap(item => {
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

    if (params.filter._predicates && Array.isArray(params.filter._predicates)) {
      returnData = returnData.map(resource => {
        return Object.keys(resource)
          .filter(key => params.filter._predicates.includes(key) || key === 'id')
          .reduce((filteredResource, key) => {
            filteredResource[key] = resource[key];
            return filteredResource;
          }, {});
      });
    }

    if (Object.keys(params.filter).length > 0) {
      returnData = returnData.filter(resource => {
        if (params.filter.q) {
          return Object.entries(resource).some(([kr, vr]) => {
            if (!isobject(vr)) {
              const arrayValues = Array.isArray(vr) ? vr : [vr];
              return arrayValues.some(va => {
                if (typeof va === 'string' || va instanceof String) {
                  return va.toLowerCase().normalize('NFD').includes(params.filter.q.toLowerCase().normalize('NFD'));
                }
              });
            }
            return false;
          });
        }

        const attributesFilters = Object.keys(params.filter).filter(f => !['_predicates', '_servers', 'q'].includes(f));

        return attributesFilters.every(k => {
          if (resource[k]) {
            return Array.isArray(resource[k])
              ? resource[k].some(va => va.includes(params.filter[k]))
              : resource[k].includes(params.filter[k]);
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

  const total = returnData.length;

  if (params.pagination) {
    returnData = returnData.slice(
      (params.pagination.page - 1) * params.pagination.perPage,
      params.pagination.page * params.pagination.perPage
    );
  }

  return { data: returnData, total };
};

export default fetchContainers;
