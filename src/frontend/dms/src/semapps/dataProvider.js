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

const dataProvider = ({ sparqlEndpoint, httpClient, resources, ontologies }) => ({
  getList: async (resourceId, params) => {
    if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

    if (resources[resourceId].types) {
      /*
       * Types are defined, do a SPARQL search
       */
      const body = computeSparqlSearch({ types: resources[resourceId].types, params, ontologies });

      const { json } = await httpClient(sparqlEndpoint, {
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
      const url = params.id || params['@id'] || resources[resourceId].containerUri;
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
  getOne: async (resourceId, params) => {
    let { json } = await httpClient(params.id);
    json.id = json['@id'];
    return { data: json };
  },
  getMany: async (resourceId, params) => {
    let returnData = [];

    for (let id of params.ids) {
      id = typeof id === 'object' ? id['@id'] : id;

      let { json } = await httpClient(id);
      json.id = json['@id'];
      returnData.push(json);
    }

    return { data: returnData };
  },
  getManyReference: (resourceId, params) => {
    throw new Error('getManyReference is not implemented yet');
  },
  create: async (resourceId, params) => {
    if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

    const { headers } = await httpClient(resources[resourceId].containerUri, {
      method: 'POST',
      body: JSON.stringify({
        '@context': { ...getPrefixJSON(ontologies) },
        '@type': resources[resourceId].types,
        ...params.data
      })
    });

    // Retrieve newly-created resource
    const resourceUri = headers.get('Location');
    let { json } = await httpClient(resourceUri);
    json.id = json['@id'];
    return { data: json };
  },
  update: async (resourceId, params) => {
    await httpClient(params.id, {
      method: 'PATCH',
      body: JSON.stringify(params.data)
    });

    return { data: params.data };
  },
  updateMany: (resourceId, params) => {
    throw new Error('updateMany is not implemented yet');
  },
  delete: async (resourceId, params) => {
    await httpClient(params.id, {
      method: 'DELETE'
    });

    return { data: { id: params.id } };
  },
  deleteMany: (resourceId, params) => {
    throw new Error('deleteMany is not implemented yet');
  }
});

export default dataProvider;
