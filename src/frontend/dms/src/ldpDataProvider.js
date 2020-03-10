const ldpDataProvider = (baseUrl, ontology, httpClient) => ({
  getList: async (resource, params) => {
    const { json } = await httpClient(baseUrl + ontology + ':' + resource);

    const returnData = json['ldp:contains'].map(item => {
      item.id = item['@id'];
      return item;
    });

    return { data: returnData, total: returnData.length };
  },
  getOne: async (resource, params) => {
    let { json } = await httpClient(params.id);
    json.id = json['@id'];
    return { data: json };
  },
  getMany: async (resource, params) => {
    let returnData = [];

    for( let id of params.ids ) {
      id = typeof id === 'object' ? id['@id'] : id;

      let { json } = await httpClient(id);
      json.id = json['@id'];
      returnData[json.id] = json;
    }

    return { data: returnData };
  },
  getManyReference: (resource, params) => (new Promise()),
  create: async (resource, params) => {
    const { headers } = await httpClient(baseUrl + ontology + ':' + resource, {
      method: 'POST',
      body: JSON.stringify({
        '@context': { 'pair': 'http://virtual-assembly.org/ontologies/pair#' },
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
  updateMany: (resource, params) => (new Promise()),
  delete: async (resource, params) => {
    await httpClient(params.id, {
      method: 'DELETE'
    });

    return { data: { id: params.id } };
  },
  deleteMany: (resource, params) => (new Promise()),
});

export default ldpDataProvider;