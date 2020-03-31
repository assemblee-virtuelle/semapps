import jsonld from 'jsonld';

const getPrefixJSON = ontologies => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const computeSparqlSearch = ({ types, params: { pagination, sort, filter }, ontologies }) => {
  let searchRequest = '';
  if (filter.q && filter.q.length > 0) {
    searchRequest = `
      {
        SELECT ?s1
        WHERE {
          ?s1 ?p1 ?o1 .
          FILTER regex(str(?o1), "${filter.q}")
          FILTER NOT EXISTS {?s1 a ?o1}
        }
      }
      `;
  }
  return `
    ${getPrefixRdf(ontologies)}
    CONSTRUCT { 
      ?s1 ?p2 ?o2
    }
    WHERE {
      ${searchRequest}
      ?s1 a ?type .
      FILTER( ?type IN (${types.join(', ')}) ) .
      ?s1 ?p2 ?o2 .
    }
    # TODO try to make pagination work in SPARQL as this doesn't work.
    # LIMIT ${pagination.perPage}
    # OFFSET ${(pagination.page - 1) * pagination.perPage}
  `;
};

const dataProvider = (baseUrl, httpClient, resourcesConfig, ontologies) => ({
  getList: async (resource, params) => {
    if (!resourcesConfig[resource]) Error(`Resource ${resource} is not mapped in resourcesConfig`);

    if (resourcesConfig[resource].types) {
      /*
       * Types are defined, do a SPARQL search
       */
      const body = computeSparqlSearch({ types: resourcesConfig[resource].types, params, ontologies });

      const { json } = await httpClient(baseUrl, {
        method: 'POST',
        body
      });

      const compactJson = await jsonld.compact(json, getPrefixJSON(ontologies));

      if (!compactJson['@graph'] || compactJson['@graph'].length === 0) {
        return { data: [], total: 0 };
      }

      const returnData = compactJson['@graph']
        .map(item => {
          item.id = item['@id'];
          return item;
        })
        .slice(
          (params.pagination.page - 1) * params.pagination.perPage,
          params.pagination.page * params.pagination.perPage
        );

      return { data: returnData, total: compactJson['@graph'].length };
    } else {
      /*
       * Types are not defined, query the container
       */
      const url = params.id || params['@id'] || resourcesConfig[resource].containerUri;
      const { json } = await httpClient(url);

      const listProperties = ['ldp:contains', 'as:orderedItems', 'orderedItems', 'as:items', 'items'];
      const listProperty = listProperties.find(p => json[p]);
      if (!listProperty) throw new Error('Unknown list type');

      const returnData = json[listProperty]
        .map(item => {
          item.id = item['@id'];
          return item;
        })
        .slice(
          (params.pagination.page - 1) * params.pagination.perPage,
          params.pagination.page * params.pagination.perPage
        );

      return { data: returnData, total: returnData.length };
    }
  },
  getOne: async (resource, params) => {
    let { json } = await httpClient(params.id);
    json.id = json['@id'];
    return { data: json };
  },
  getMany: async (resource, params) => {
    let returnData = [];

    for (let id of params.ids) {
      id = typeof id === 'object' ? id['@id'] : id;

      let { json } = await httpClient(id);
      json.id = json['@id'];
      returnData.push(json);
    }

    return { data: returnData };
  },
  getManyReference: (resource, params) => {
    throw new Error('getManyReference is not implemented yet');
  },
  create: async (resource, params) => {
    if (!resourcesConfig[resource]) Error(`Resource ${resource} is not mapped in resourcesConfig`);

    const { headers } = await httpClient(baseUrl + resourcesConfig[resource].containerUri, {
      method: 'POST',
      body: JSON.stringify({
        '@context': { ...getPrefixJSON(ontologies) },
        '@type': resource,
        ...params.data
      })
    });

    // Retrieve newly-created resource
    const resourceUri = headers.get('Location');
    let { json } = await httpClient(resourceUri);
    json.id = json['@id'];
    return { data: json };
  },
  update: async (resource, params) => {
    await httpClient(params.id, {
      method: 'PATCH',
      body: JSON.stringify(params.data)
    });

    return { data: params.data };
  },
  updateMany: (resource, params) => {
    throw new Error('updateMany is not implemented yet');
  },
  delete: async (resource, params) => {
    await httpClient(params.id, {
      method: 'DELETE'
    });

    return { data: { id: params.id } };
  },
  deleteMany: (resource, params) => {
    throw new Error('deleteMany is not implemented yet');
  }
});

export default dataProvider;
