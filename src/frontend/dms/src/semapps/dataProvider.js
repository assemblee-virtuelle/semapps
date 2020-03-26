const pathToType = path => path.replace('-', ':');

const dataProvider = (baseUrl, httpClient) => ({
  getList: async (resource, params) => {
    const url = params.id || params['@id'] || baseUrl + pathToType(resource);
    const { json } = await httpClient(url);

    const listProperties = ['ldp:contains', 'as:orderedItems', 'orderedItems', 'as:items', 'items'];
    const listProperty = listProperties.find(p => json[p]);
    if (!listProperty) throw new Error('Unknown list type');

    const returnData = json[listProperty].map(item => {
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

    for (let id of params.ids) {
      id = typeof id === 'object' ? id['@id'] : id;

      let { json } = await httpClient(id);
      json.id = json['@id'];
      returnData.push(json);
    }

    return { data: returnData };
  },
  getManyReference: (resource, params) => {
    throw new Error('getManyReference is not implemented');
  },
  create: async (resource, params) => {
    const { headers } = await httpClient(baseUrl + pathToType(resource), {
      method: 'POST',
      body: JSON.stringify({
        '@context': { pair: 'http://virtual-assembly.org/ontologies/pair#' },
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
    throw new Error('updateMany is not implemented');
  },
  delete: async (resource, params) => {
    await httpClient(params.id, {
      method: 'DELETE'
    });

    return { data: { id: params.id } };
  },
  deleteMany: (resource, params) => {
    throw new Error('deleteMany is not implemented');
  }
});

export default dataProvider;
