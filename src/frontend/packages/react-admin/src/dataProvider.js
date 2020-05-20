import jsonld from 'jsonld';

const getJsonContext = (ontologies, mainOntology) => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  if (mainOntology) {
    delete pattern[mainOntology];
    return [ontologies.find(ontology => ontology.prefix === mainOntology).context, pattern];
  } else {
    return pattern;
  }
};

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
};

const computeSparqlQuery = ({ types, params: { query, pagination, sort, filter }, ontologies }) => {
  let whereQuery = '';

  if (filter.q && filter.q.length > 0) {
    whereQuery += `
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
  if( query ) {
    Object.keys(query).forEach(predicate => {
      const value = query[predicate].startsWith('http') ? `<${query[predicate]}>` : query[predicate];
      whereQuery += `?s1 ${predicate} ${value} .`
    });
  }
  return `
    ${getPrefixRdf(ontologies)}
    CONSTRUCT {
      ?s1 ?p2 ?o2
    }
    WHERE {
      ${whereQuery}
      ?s1 a ?type .
      FILTER( ?type IN (${types.join(', ')}) ) .
      FILTER( (isIRI(?s1)) ) .
      ?s1 ?p2 ?o2 .
    }
    # TODO try to make pagination work in SPARQL as this doesn't work.
    # LIMIT ${pagination.perPage}
    # OFFSET ${(pagination.page - 1) * pagination.perPage}
  `;
};

const dataProvider = ({ sparqlEndpoint, httpClient, resources, ontologies, mainOntology }) => ({
  getList: async (resourceId, params) => {
    if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

    if (params.id || params['@id'] || !resources[resourceId].types) {
      /*
       * Query the container
       */
      const url = params.id || params['@id'] || resources[resourceId].containerUri;
      const { json } = await httpClient(url);

      const listProperties = ['ldp:contains', 'as:orderedItems', 'orderedItems', 'as:items', 'items'];
      const listProperty = listProperties.find(p => json[p]);
      if (!listProperty) throw new Error('Unknown list type');

      let returnData = json[listProperty].map(item => {
        item.id = item.id || item['@id'];
        return item;
      });

      if (params.pagination) {
        returnData = returnData.slice(
          (params.pagination.page - 1) * params.pagination.perPage,
          params.pagination.page * params.pagination.perPage
        );
      }

      return { data: returnData, total: json[listProperty].length };
    } else {
      /*
       * Do a SPARQL search
       */
      const sparqlQuery = computeSparqlQuery({ types: resources[resourceId].types, params: { ...params, query: resources[resourceId].query }, ontologies });

      const { json } = await httpClient(sparqlEndpoint, {
        method: 'POST',
        body: sparqlQuery
      });

      const compactJson = await jsonld.compact(json, getJsonContext(ontologies, mainOntology));

      if (Object.keys(compactJson).length === 1) {
        // If we have only the context, it means there is no match
        return { data: [], total: 0 };
      } else if (!compactJson['@graph']) {
        // If we have several fields but no @graph, there is a single match
        compactJson.id=compactJson['@id'];
        return { data: [compactJson], total: 1 };
      } else {
        const returnData = compactJson['@graph']
          .map(item => {
            item.id = item.id || item['@id'];
            return item;
          })
          .slice(
            (params.pagination.page - 1) * params.pagination.perPage,
            params.pagination.page * params.pagination.perPage
          );

        return { data: returnData, total: compactJson['@graph'].length };
      }
    }
  },
  getOne: async (resourceId, params) => {
    let { json } = await httpClient(params.id);
    json.id = json.id || json['@id'];
    return { data: json };
  },
  getMany: async (resourceId, params) => {
    let returnData = [];

    for (let id of params.ids) {
      id = typeof id === 'object' ? id['@id'] : id;

      let { json } = await httpClient(id);
      json.id = json.id || json['@id'];
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
        '@context': getJsonContext(ontologies, mainOntology),
        '@type': resources[resourceId].types,
        ...params.data
      })
    });

    // Retrieve newly-created resource
    const resourceUri = headers.get('Location');
    let { json } = await httpClient(resourceUri);
    json.id = json.id || json['@id'];
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
