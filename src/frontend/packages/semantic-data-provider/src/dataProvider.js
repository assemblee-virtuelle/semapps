import jsonld from 'jsonld';
import buildSparqlQuery from './buildSparqlQuery';
const createSlug = require('speakingurl');

const buildJsonContext = ontologies => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

const isFile = o => o && o.rawFile && o.rawFile instanceof File;

const getSlugWithExtension = fileName => {
  let fileExtension = '';
  let splitFileName = fileName.split('.');
  if (splitFileName.length > 1) {
    fileExtension = splitFileName.pop();
    fileName = splitFileName.join('.');
  }
  return createSlug(fileName, { lang: 'fr' }) + '.' + fileExtension;
};

const isType = (type, resource) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const dataProvider = ({ sparqlEndpoint, httpClient, resources, ontologies, jsonContext, uploadsContainerUri }) => {
  const uploadFile = async rawFile => {
    if (!uploadsContainerUri) throw new Error('No uploadsContainerUri defined for the data provider');

    const response = await httpClient(uploadsContainerUri, {
      method: 'POST',
      body: rawFile,
      headers: new Headers({
        // We must sluggify the file name, because we can't use non-ASCII characters in the header
        // However we keep the extension apart (if it exists) so that it is not replaced with a -
        // TODO let the middleware guess the extension based on the content type
        Slug: getSlugWithExtension(rawFile.name),
        'Content-Type': rawFile.type
      })
    });

    if (response.status === 201) {
      return response.headers.get('Location');
    }
  };

  /*
   * Look for raw files in the resource data.
   * If there are any, upload them and replace the file by its URL.
   */
  const uploadAllFiles = async resource => {
    for (let property in resource) {
      if (resource.hasOwnProperty(property)) {
        if (Array.isArray(resource[property])) {
          for (let i = 0; i < resource[property].length; i++) {
            if (isFile(resource[property][i])) {
              resource[property][i] = await uploadFile(resource[property][i].rawFile);
            }
          }
        } else {
          if (isFile(resource[property])) {
            resource[property] = await uploadFile(resource[property].rawFile);
          }
        }
      }
    }
    return resource;
  };

  return {
    getResources: async (resourceId, params) => {
      return {data:resources};
    },
    getList: async (resourceId, params) => {
      if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

      if (params.id || params['@id'] || !resources[resourceId].types) {
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
          if (!listProperty) throw new Error('Unknown list type');

          // TODO fetch several pages depending on params.pagination

          let returnData = json[listProperty].map(item => {
            item.id = item.id || item['@id'];
            return item;
          });

          return { data: returnData, total: json.totalItems };
        }
      } else {
        /*
         * Do a SPARQL search
         */
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

        const compactJson = await jsonld.frame(json, {
          '@context': jsonContext || buildJsonContext(ontologies),
          '@type': resources[resourceId].types
        });

        if (Object.keys(compactJson).length === 1) {
          // If we have only the context, it means there is no match
          return { data: [], total: 0 };
        } else if (!compactJson['@graph']) {
          // If we have several fields but no @graph, there is a single match
          compactJson.id = compactJson.id || compactJson['@id'];
          return { data: [compactJson], total: 1 };
        } else {
          const returnData = compactJson['@graph']
            .map(item => {
              item.id = item.id || item['@id'];
              return item;
            })
            .sort((a, b) => {
              if (params.sort && a[params.sort.field] && b[params.sort.field]) {
                if (params.sort.order === 'DESC') {
                  return a[params.sort.field].localeCompare(b[params.sort.field]);
                } else {
                  return b[params.sort.field].localeCompare(a[params.sort.field]);
                }
              } else {
                return true;
              }
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
      if (!resources[resourceId]) {
        Error(`Resource ${resourceId} is not mapped in resources file`);
      }
      const dataModel = resources[resourceId];

      let { json } = await httpClient(params.id);
      json.id = json.id || json['@id'];
      // TODO compact only if remote context is different from local context
      const compactJson = await jsonld.compact(json, jsonContext || buildJsonContext(ontologies));
      // transform single value into array concidering forceArray predicates
      if (dataModel.forceArray) {
        for (const forceArrayItem of dataModel.forceArray) {
          if (compactJson[forceArrayItem] && !Array.isArray(compactJson[forceArrayItem])) {
            compactJson[forceArrayItem] = [compactJson[forceArrayItem]];
          }
        }
      }
      return { data: compactJson };
    },
    getMany: async (resourceId, params) => {
      let returnData = [];

      for (let id of params.ids) {
        id = typeof id === 'object' ? id['@id'] : id;

        try {
          let { json } = await httpClient(id);
          json.id = json.id || json['@id'];
          returnData.push(json);
        } catch (e) {
          // Do nothing if one resource fails to load
          // Otherwise no references will be show if only one is missing
          // See https://github.com/marmelab/react-admin/issues/5190
        }
      }

      return { data: returnData };
    },
    getManyReference: (resourceId, params) => {
      throw new Error('getManyReference is not implemented yet');
    },
    create: async (resourceId, params) => {
      if (!resources[resourceId]) Error(`Resource ${resourceId} is not mapped in resources file`);

      const { slugField, containerUri, types } = resources[resourceId];
      const headers = new Headers();

      if (slugField) {
        headers.set(
          'Slug',
          Array.isArray(slugField) ? slugField.map(f => params.data[f]).join(' ') : params.data[slugField]
        );
      }

      // Upload files, if there are any
      params.data = await uploadAllFiles(params.data);

      const { headers: responseHeaders } = await httpClient(containerUri, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': jsonContext || buildJsonContext(ontologies),
          '@type': types,
          ...params.data
        })
      });

      // Retrieve newly-created resource
      const resourceUri = responseHeaders.get('Location');
      let { json } = await httpClient(resourceUri);
      json.id = json.id || json['@id'];
      return { data: json };
    },
    update: async (resourceId, params) => {
      // Upload files, if there are any
      params.data = await uploadAllFiles(params.data);
      await httpClient(params.id, {
        method: 'PUT',
        body: JSON.stringify({
          '@context': jsonContext || buildJsonContext(ontologies),
          ...params.data
        })
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
  };
};

export default dataProvider;
