var $bkNnK$ldoconnected = require('@ldo/connected');
var $bkNnK$ldoconnectedsolid = require('@ldo/connected-solid');
var $bkNnK$speakingurl = require('speakingurl');
var $bkNnK$jsonld = require('jsonld');
var $bkNnK$rdfjsdatamodel = require('@rdfjs/data-model');
var $bkNnK$sparqljs = require('sparqljs');
var $bkNnK$cryptojsmd5 = require('crypto-js/md5');
var $bkNnK$reactadmin = require('react-admin');
var $bkNnK$urljoin = require('url-join');
var $bkNnK$jwtdecode = require('jwt-decode');
var $bkNnK$httplinkheader = require('http-link-header');
var $bkNnK$changecase = require('change-case');
var $bkNnK$react = require('react');
var $bkNnK$reactjsxruntime = require('react/jsx-runtime');
var $bkNnK$muistylesmakeStyles = require('@mui/styles/makeStyles');

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function (key) {
    if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, 'dataProvider', () => $5eeade28ff354aaa$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'buildSparqlQuery', () => $1d6ef12386121fca$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'buildBlankNodesQuery', () => $62e296927bdba02e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'getUriFromPrefix', () => $108795c3831be99f$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'getPrefixFromUri', () => $8c4c0f0b55649ce6$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'configureUserStorage', () => $89358cee13a17a31$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'fetchAppRegistration', () => $c512de108ef5d674$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'fetchDataRegistry', () => $cd772adda3024172$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'fetchTypeIndexes', () => $69d4da9beaa62ac6$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'fetchVoidEndpoints', () => $1395e306228d41f2$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useCompactPredicate', () => $9d33c8835e67bede$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useContainers', () => $3158e0dc13ffffaa$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useContainersByTypes', () => $21fb109d85e9c16c$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useContainerByUri', () => $d3746ce11bc56f3b$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useCreateContainerUri', () => $298b78bb7d4a3358$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useDataModel', () => $63a32f1a35c6f80e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useDataModels', () => $20621bc841a5205a$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useDataProviderConfig', () => $9def35f4441a9bb2$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useDataServers', () => $c9933a88e2acc4da$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useGetCreateContainerUri', () => $32d32215b4e4729f$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useGetExternalLink', () => $413b0e8af6982264$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useGetPrefixFromUri', () => $d602250066d4ff3e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'FilterHandler', () => $d7e56c289bd8ceb0$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'GroupedReferenceHandler', () => $62e4c61f126cac5e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ReificationArrayInput', () => $ef83a7754e7f8331$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'createWsChannel', () => $84ab912646919f8c$export$28772ab4c256e709);
$parcel$export(module.exports, 'getOrCreateWsChannel', () => $84ab912646919f8c$export$8d60734939c59ced);
$parcel$export(module.exports, 'createSolidNotificationChannel', () => $84ab912646919f8c$export$3edfe18db119b920);

const $6e277d32991a95da$var$fetchResource = async (resourceUri, config) => {
  const { httpClient: httpClient, jsonContext: jsonContext } = config;
  let { json: data } = await httpClient(resourceUri);
  if (!data) throw new Error(`Not a valid JSON: ${resourceUri}`);
  data.id = data.id || data['@id'];
  // We compact only if the context is different between the frontend and the middleware
  // TODO deep compare if the context is an object
  if (data['@context'] !== jsonContext)
    data = await (0, $parcel$interopDefault($bkNnK$jsonld)).compact(data, jsonContext);
  return data;
};
var $6e277d32991a95da$export$2e2bcd8739ae039 = $6e277d32991a95da$var$fetchResource;

const $aa09e6904cf4399f$var$getOneMethod = config => async (resourceId, params) => {
  const { resources: resources } = config;
  const dataModel = resources[resourceId];
  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
  const data = await (0, $6e277d32991a95da$export$2e2bcd8739ae039)(params.id, config);
  // Transform single value into array if forceArray is set
  if (dataModel.list?.forceArray) {
    for (const forceArrayItem of dataModel.list?.forceArray || [])
      if (data[forceArrayItem] && !Array.isArray(data[forceArrayItem])) data[forceArrayItem] = [data[forceArrayItem]];
  }
  // TODO activate defaultFetchPlan option
  // if (dataModel.list?.defaultFetchPlan) {
  //   for (const node of dataModel.list?.defaultFetchPlan) {
  //     if (
  //       data[node] &&
  //       typeof data[node] === 'string' &&
  //       data[node].startsWith('http')
  //     ) {
  //       try {
  //         const dataToEmbed = await fetchResource(data[node], config);
  //         delete dataToEmbed['@context'];
  //         data[node] = dataToEmbed;
  //       } catch (e) {
  //         // Ignore errors (this may happen if user does not have rights to see the resource)
  //       }
  //     }
  //   }
  // }
  return {
    data: data
  };
};
var $aa09e6904cf4399f$export$2e2bcd8739ae039 = $aa09e6904cf4399f$var$getOneMethod;

const $0edd1f2d07c8231f$var$getUploadsContainerUri = (config, serverKey) => {
  // If no server key is defined or if the server has no uploads container, find any server with a uploads container
  if (
    !serverKey ||
    !config.dataServers[serverKey].containers ||
    !config.dataServers[serverKey].containers?.find(c => c.binaryResources)
  )
    serverKey = Object.keys(config.dataServers).find(key =>
      config.dataServers[key].containers?.find(c => c.binaryResources)
    );
  if (serverKey)
    return config.dataServers[serverKey].containers?.find(c => c.binaryResources)?.uri; // No server has an uploads container
  else return null;
};
var $0edd1f2d07c8231f$export$2e2bcd8739ae039 = $0edd1f2d07c8231f$var$getUploadsContainerUri;

const $6fcb30f76390d142$var$isFile = o => o?.rawFile && o.rawFile instanceof File;
const $6fcb30f76390d142$export$a5575dbeeffdad98 = async (rawFile, config, serverKey) => {
  const uploadsContainerUri = (0, $0edd1f2d07c8231f$export$2e2bcd8739ae039)(config, serverKey);
  if (!uploadsContainerUri)
    throw new Error("You must define an container with binaryResources in one of the server's configuration");
  const response = await config.httpClient(uploadsContainerUri, {
    method: 'POST',
    body: rawFile,
    headers: new Headers({
      'Content-Type': rawFile.type
    })
  });
  if (response.status === 201) return response.headers.get('Location');
  return null;
};
/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */ const $6fcb30f76390d142$var$uploadAllFiles = async (record, config, serverKey) => {
  const updatedRecord = {
    ...record
  };
  for (const property of Object.keys(record)) {
    const value = record[property];
    if (Array.isArray(value))
      for (let i = 0; i < value.length; i++) {
        const itemValue = value[i];
        if ($6fcb30f76390d142$var$isFile(itemValue))
          updatedRecord[property][i] = await $6fcb30f76390d142$export$a5575dbeeffdad98(
            itemValue.rawFile,
            config,
            serverKey
          );
      }
    else if ($6fcb30f76390d142$var$isFile(value))
      updatedRecord[property] = await $6fcb30f76390d142$export$a5575dbeeffdad98(value.rawFile, config, serverKey);
  }
  return {
    updatedRecord: updatedRecord
  };
};
var $6fcb30f76390d142$export$2e2bcd8739ae039 = {
  upload: $6fcb30f76390d142$var$uploadAllFiles
};

const $0a5fcc1f7fc2050f$var$getServerKeyFromType = (type, dataServers) => {
  return (
    dataServers &&
    Object.keys(dataServers).find(key => {
      return dataServers[key][type];
    })
  );
};
var $0a5fcc1f7fc2050f$export$2e2bcd8739ae039 = $0a5fcc1f7fc2050f$var$getServerKeyFromType;

const $6531da3b9e8c524a$var$parseServerKey = (serverKey, dataServers) => {
  switch (serverKey) {
    case '@default':
      return (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('default', dataServers);
    case '@pod':
      return (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('pod', dataServers);
    case '@authServer':
      return (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('authServer', dataServers);
    default:
      return serverKey;
  }
};
// Return the list of servers keys in an array
// parsing keywords like @all, @default, @pod and @authServer
const $6531da3b9e8c524a$var$parseServerKeys = (serverKeys, dataServers) => {
  if (Array.isArray(serverKeys)) {
    if (serverKeys.includes('@all')) return Object.keys(dataServers);
    else return serverKeys.map(serverKey => $6531da3b9e8c524a$var$parseServerKey(serverKey, dataServers));
  } else if (typeof serverKeys === 'string') {
    if (serverKeys === '@all') return Object.keys(dataServers);
    else if (serverKeys === '@remote') {
      const defaultServerKey = (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('default', dataServers);
      return Object.keys(dataServers).filter(serverKey => serverKey !== defaultServerKey);
    } else return [$6531da3b9e8c524a$var$parseServerKey(serverKeys, dataServers)];
  } else throw new Error(`The parseServerKeys expect a list of server keys, or keywords`);
};
var $6531da3b9e8c524a$export$2e2bcd8739ae039 = $6531da3b9e8c524a$var$parseServerKeys;

/**
 * Return all containers matching the given types
 */ const $047a107b0d203793$var$findContainersWithTypes = (types, serverKeys, dataServers) => {
  const matchingContainers = [];
  const parsedServerKeys = (0, $6531da3b9e8c524a$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
  Object.keys(dataServers).forEach(dataServerKey => {
    if (parsedServerKeys.includes(dataServerKey))
      dataServers[dataServerKey].containers?.forEach(container => {
        if (container.types?.some(t => types.includes(t))) matchingContainers.push(container);
      });
  });
  return matchingContainers;
};
var $047a107b0d203793$export$2e2bcd8739ae039 = $047a107b0d203793$var$findContainersWithTypes;

const $37c161736d0d7276$var$findContainersWithURIs = (containersUris, dataServers) => {
  const matchingContainers = [];
  Object.keys(dataServers).forEach(serverKey => {
    dataServers[serverKey].containers?.forEach(container => {
      if (container.uri && containersUris.includes(container.uri)) matchingContainers.push(container);
    });
  });
  return matchingContainers;
};
var $37c161736d0d7276$export$2e2bcd8739ae039 = $37c161736d0d7276$var$findContainersWithURIs;

const $c1c6dddad031acf6$var$createMethod = config => async (resourceId, params) => {
  const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext } = config;
  const dataModel = resources[resourceId];
  if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);
  const headers = new Headers();
  let containerUri;
  let serverKey;
  if (dataModel.create?.container) {
    const [container] = (0, $37c161736d0d7276$export$2e2bcd8739ae039)([dataModel.create?.container], dataServers);
    serverKey = container.server;
    containerUri = container.uri;
  } else {
    serverKey = dataModel.create?.server || Object.keys(dataServers).find(key => dataServers[key].default === true);
    if (!serverKey) throw new Error('You must define a server for the creation, or a container, or a default server');
    const containers = (0, $047a107b0d203793$export$2e2bcd8739ae039)(dataModel.types, [serverKey], dataServers);
    if (!containers || containers.length === 0)
      throw new Error(`No container with types ${JSON.stringify(dataModel.types)} found on server ${serverKey}`);
    if (containers.length > 1)
      throw new Error(
        `More than one container detected with types ${JSON.stringify(dataModel.types)} on server ${serverKey}`
      );
    containerUri = containers[0].uri;
  }
  if (params.data) {
    if (dataModel.fieldsMapping?.title) {
      const slug = Array.isArray(dataModel.fieldsMapping.title)
        ? dataModel.fieldsMapping.title.map(f => params.data[f]).join(' ')
        : params.data[dataModel.fieldsMapping.title];
      // Generate slug here, otherwise we may get errors with special characters
      headers.set('Slug', (0, $parcel$interopDefault($bkNnK$speakingurl))(slug));
    }
    // Upload files, if there are any
    const { updatedRecord: updatedRecord } = await (0, $6fcb30f76390d142$export$2e2bcd8739ae039).upload(
      params.data,
      config,
      serverKey
    );
    params.data = updatedRecord;
    const { headers: responseHeaders } = await httpClient(containerUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        '@context': jsonContext,
        '@type': dataModel.types,
        ...params.data
      })
    });
    // Retrieve newly-created resource
    const resourceUri = responseHeaders.get('Location');
    return await (0, $aa09e6904cf4399f$export$2e2bcd8739ae039)(config)(resourceId, {
      id: resourceUri
    });
  }
  if (params.id) {
    headers.set('Content-Type', 'application/sparql-update');
    await httpClient(containerUri, {
      method: 'PATCH',
      headers: headers,
      body: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { <${containerUri}> ldp:contains <${params.id}>. };
      `
    });
    // Create must return the new data, so get them from the remote URI
    return await (0, $aa09e6904cf4399f$export$2e2bcd8739ae039)(config)(resourceId, {
      id: params.id
    });
  }
};
var $c1c6dddad031acf6$export$2e2bcd8739ae039 = $c1c6dddad031acf6$var$createMethod;

const $566b5adde94810fa$var$deleteMethod = config => async (resourceId, params) => {
  const { httpClient: httpClient } = config;
  await httpClient(`${params.id}`, {
    method: 'DELETE'
  });
  return {
    data: {
      id: params.id
    }
  };
};
var $566b5adde94810fa$export$2e2bcd8739ae039 = $566b5adde94810fa$var$deleteMethod;

const $3a3bc87603f934e3$var$deleteManyMethod = config => async (resourceId, params) => {
  const { httpClient: httpClient } = config;
  const ids = [];
  for (const id of params.ids)
    try {
      await httpClient(id, {
        method: 'DELETE'
      });
      ids.push(id);
    } catch (e) {
      // Do nothing if we fail to delete a resource
    }
  return {
    data: ids
  };
};
var $3a3bc87603f934e3$export$2e2bcd8739ae039 = $3a3bc87603f934e3$var$deleteManyMethod;

const $5a7f64ef6101d5f8$var$getDataServers = config => () => {
  return config.dataServers;
};
var $5a7f64ef6101d5f8$export$2e2bcd8739ae039 = $5a7f64ef6101d5f8$var$getDataServers;

const $2789979a990866f4$var$getDataModels = config => () => {
  return config.resources;
};
var $2789979a990866f4$export$2e2bcd8739ae039 = $2789979a990866f4$var$getDataModels;

const $e6fbab1f303bdb93$var$arrayOf = value => {
  // If the field is null-ish, we suppose there are no values.
  if (!value) return [];
  // Return as is.
  if (Array.isArray(value)) return value;
  // Single value is made an array.
  return [value];
};
var $e6fbab1f303bdb93$export$2e2bcd8739ae039 = $e6fbab1f303bdb93$var$arrayOf;

// Fetch the selected resources of the provided containers
// Filter out resources that are provided (can avoid loading a resource twice)
const $448b8598c73a447a$var$fetchSelectedResources = async (containers, excludedResourcesUris, config) => {
  let selectedResourcesUris = containers
    .filter(c => c.selectedResources)
    .map(c => c.selectedResources)
    .flat();
  // Filter out resources which are already included in the SPARQL query results
  selectedResourcesUris = selectedResourcesUris.filter(uri => !excludedResourcesUris.includes(uri));
  const selectedResources = await Promise.all(
    selectedResourcesUris.map(resourceUri => (0, $6e277d32991a95da$export$2e2bcd8739ae039)(resourceUri, config))
  );
  return selectedResources;
};
var $448b8598c73a447a$export$2e2bcd8739ae039 = $448b8598c73a447a$var$fetchSelectedResources;

const $8c999cc29c8d6a6c$var$isValidLDPContainer = container => {
  const resourceType = container.type || container['@type'];
  return Array.isArray(resourceType) ? resourceType.includes('ldp:Container') : resourceType === 'ldp:Container';
};
const $8c999cc29c8d6a6c$var$isObject = val => {
  return val != null && typeof val === 'object' && !Array.isArray(val);
};
const $8c999cc29c8d6a6c$var$fetchContainers = async (containers, params, config) => {
  const { httpClient: httpClient, jsonContext: jsonContext } = config;
  // Fetch simultaneously all containers
  const results = await Promise.all(
    containers
      .filter(c => !c.selectedResources)
      .map(async container => {
        let { json: json } = await httpClient(container.uri);
        // If container's context is different, compact it to have an uniform result
        // TODO deep compare if the context is an object
        if (json['@context'] !== jsonContext)
          json = await (0, $parcel$interopDefault($bkNnK$jsonld)).compact(json, jsonContext);
        if (!$8c999cc29c8d6a6c$var$isValidLDPContainer(json))
          throw new Error(`${container.uri} is not a LDP container`);
        return (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(json['ldp:contains']).map(resource => ({
          '@context': json['@context'],
          ...resource
        }));
      })
  );
  let resources = results.flat();
  // Append selected resources (if any)
  const selectedResources = await (0, $448b8598c73a447a$export$2e2bcd8739ae039)(
    containers,
    resources.map(r => r.id),
    config
  );
  resources = resources.concat(selectedResources);
  resources = resources.map(resource => {
    resource.id = resource.id || resource['@id'];
    return resource;
  });
  // Apply filter to results
  const filters = params.filter;
  // For SPARQL queries, we use "a" to filter types, but in containers it must be "type"
  if (filters.a) {
    filters.type = filters.a;
    delete filters.a;
  }
  // Filter resources attributes according to _predicates list
  if (filters._predicates && Array.isArray(filters._predicates)) {
    const predicates = filters._predicates;
    const mandatoryAttributes = ['id'];
    resources = resources.map(resource => {
      return Object.keys(resource)
        .filter(key => predicates.includes(key) || mandatoryAttributes.includes(key))
        .reduce(
          (filteredResource, key) => {
            filteredResource[key] = resource[key];
            return filteredResource;
          },
          {
            '@context': []
          }
        );
    });
  }
  if (Object.keys(filters).filter(f => !['_predicates', '_servers'].includes(f)).length > 0)
    resources = resources.filter(resource => {
      // Full text filtering
      if (filters.q)
        return Object.values(resource).some(attributeValue => {
          if (!$8c999cc29c8d6a6c$var$isObject(attributeValue)) {
            const arrayValues = Array.isArray(attributeValue) ? attributeValue : [attributeValue];
            return arrayValues.some(value => {
              if (typeof value === 'string')
                return value.toLowerCase().normalize('NFD').includes(filters.q.toLowerCase().normalize('NFD'));
              return false;
            });
          }
          return false;
        });
      // Attribute filtering
      const attributesFilters = Object.keys(filters).filter(f => !['_predicates', '_servers', 'q'].includes(f));
      return attributesFilters.every(attribute => {
        if (resource[attribute]) {
          const arrayValues = Array.isArray(resource[attribute]) ? resource[attribute] : [resource[attribute]];
          return arrayValues.some(value => typeof value === 'string' && value.includes(filters[attribute]));
        }
        return false;
      });
    });
  // Sorting
  if (params.sort)
    resources = resources.sort((a, b) => {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      if (params.sort.order === 'ASC')
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        return (a[params.sort.field] ?? '').localeCompare(b[params.sort.field] ?? '');
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      return (b[params.sort.field] ?? '').localeCompare(a[params.sort.field] ?? '');
    });
  // Pagination
  const total = resources.length;
  if (params.pagination)
    resources = resources.slice(
      (params.pagination.page - 1) * params.pagination.perPage,
      params.pagination.page * params.pagination.perPage
    );
  return {
    data: resources,
    total: total
  };
};
var $8c999cc29c8d6a6c$export$2e2bcd8739ae039 = $8c999cc29c8d6a6c$var$fetchContainers;

const $55c8b4103f19d79c$var$getEmbedFrame = blankNodes => {
  let embedFrame = {};
  let predicates;
  if (blankNodes) {
    for (const blankNode of blankNodes) {
      if (blankNode.includes('/')) predicates = blankNode.split('/').reverse();
      else predicates = [blankNode];
      embedFrame = {
        ...embedFrame,
        ...predicates.reduce(
          // @ts-expect-error TS(7006): Parameter 'accumulator' implicitly has an 'any' ty... Remove this comment to see the full error message
          (accumulator, predicate) => ({
            [predicate]: {
              '@embed': '@last',
              ...accumulator
            }
          }),
          {}
        )
      };
    }
    return embedFrame;
  }
};
var $55c8b4103f19d79c$export$2e2bcd8739ae039 = $55c8b4103f19d79c$var$getEmbedFrame;

const $108795c3831be99f$var$getUriFromPrefix = (item, ontologies) => {
  if (item.startsWith('http://') || item.startsWith('https://'))
    // Already resolved, return the URI
    return item;
  else if (item === 'a')
    // Special case
    return 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  else {
    const [prefix, value] = item.split(':');
    if (value) {
      if (ontologies[prefix]) return ontologies[prefix] + value;
      else throw new Error(`No ontology found with prefix ${prefix}`);
    } else throw new Error(`The value "${item}" is not correct. It must include a prefix or be a full URI.`);
  }
};
var $108795c3831be99f$export$2e2bcd8739ae039 = $108795c3831be99f$var$getUriFromPrefix;

const $d6253a347864dbab$var$defaultToArray = value => (!value ? [] : Array.isArray(value) ? value : [value]);
// We need to always include the type or React-Admin will not work properly
const $d6253a347864dbab$var$typeQuery = (0, $bkNnK$rdfjsdatamodel.triple)(
  (0, $bkNnK$rdfjsdatamodel.variable)('s1'),
  (0, $bkNnK$rdfjsdatamodel.namedNode)('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
  (0, $bkNnK$rdfjsdatamodel.variable)('type')
);
const $d6253a347864dbab$var$buildBaseQuery = (predicates, ontologies) => {
  let baseTriples;
  if (predicates) {
    baseTriples = $d6253a347864dbab$var$defaultToArray(predicates).map((predicate, i) =>
      (0, $bkNnK$rdfjsdatamodel.triple)(
        (0, $bkNnK$rdfjsdatamodel.variable)('s1'),
        (0, $bkNnK$rdfjsdatamodel.namedNode)((0, $108795c3831be99f$export$2e2bcd8739ae039)(predicate, ontologies)),
        (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`)
      )
    );
    return {
      construct: [$d6253a347864dbab$var$typeQuery, ...baseTriples],
      where: [
        $d6253a347864dbab$var$typeQuery,
        ...baseTriples.map(triple => ({
          type: 'optional',
          patterns: [triple]
        }))
      ]
    };
  }
  baseTriples = [
    (0, $bkNnK$rdfjsdatamodel.triple)(
      (0, $bkNnK$rdfjsdatamodel.variable)('s1'),
      (0, $bkNnK$rdfjsdatamodel.variable)('p1'),
      (0, $bkNnK$rdfjsdatamodel.variable)('o1')
    )
  ];
  return {
    construct: baseTriples,
    where: baseTriples
  };
};
var $d6253a347864dbab$export$2e2bcd8739ae039 = $d6253a347864dbab$var$buildBaseQuery;

// @ts-expect-error TS(7016): Could not find a declaration file for module 'cryp... Remove this comment to see the full error message

// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const $62e296927bdba02e$var$extractNodes = blankNodes => {
  const nodes = [];
  if (blankNodes) {
    for (const predicate of blankNodes)
      if (predicate.includes('/')) {
        const nodeNames = predicate.split('/');
        for (let i = 1; i <= nodeNames.length; i++) nodes.push(nodeNames.slice(0, i).join('/'));
      } else nodes.push(predicate);
  }
  return nodes;
};
const $62e296927bdba02e$var$generateSparqlVarName = node => (0, $parcel$interopDefault($bkNnK$cryptojsmd5))(node);
const $62e296927bdba02e$var$getParentNode = node => node.includes('/') && node.split('/')[0];
const $62e296927bdba02e$var$getPredicate = node => (node.includes('/') ? node.split('/')[1] : node);
const $62e296927bdba02e$var$buildUnionQuery = queries =>
  queries.map(q => {
    let triples = q.query;
    const firstTriple = queries.find(q2 => q.parentNode === q2.node);
    if (firstTriple !== undefined) triples = triples.concat(firstTriple.query[0]);
    return {
      type: 'bgp',
      triples: triples
    };
  });
const $62e296927bdba02e$var$buildBlankNodesQuery = (blankNodes, baseQuery, ontologies) => {
  const queries = [];
  const nodes = $62e296927bdba02e$var$extractNodes(blankNodes);
  if (nodes && ontologies && ontologies.length > 0) {
    for (const node of nodes) {
      const parentNode = $62e296927bdba02e$var$getParentNode(node);
      const predicate = $62e296927bdba02e$var$getPredicate(node);
      const varName = $62e296927bdba02e$var$generateSparqlVarName(node);
      const parentVarName = parentNode ? $62e296927bdba02e$var$generateSparqlVarName(parentNode) : '1';
      const query = [
        (0, $bkNnK$rdfjsdatamodel.triple)(
          (0, $bkNnK$rdfjsdatamodel.variable)(`s${parentVarName}`),
          (0, $bkNnK$rdfjsdatamodel.namedNode)((0, $108795c3831be99f$export$2e2bcd8739ae039)(predicate, ontologies)),
          (0, $bkNnK$rdfjsdatamodel.variable)(`s${varName}`)
        ),
        (0, $bkNnK$rdfjsdatamodel.triple)(
          (0, $bkNnK$rdfjsdatamodel.variable)(`s${varName}`),
          (0, $bkNnK$rdfjsdatamodel.variable)(`p${varName}`),
          (0, $bkNnK$rdfjsdatamodel.variable)(`o${varName}`)
        )
      ];
      queries.push({
        node: node,
        parentNode: parentNode,
        query: query,
        filter: '' // `FILTER(isBLANK(?s${varName})) .`
      });
    }
    return {
      construct: queries.length > 0 ? queries.map(q => q.query).reduce((pre, cur) => pre.concat(cur)) : null,
      where: {
        type: 'union',
        patterns: [baseQuery.where, ...$62e296927bdba02e$var$buildUnionQuery(queries)]
      }
    };
  }
  return {
    construct: '',
    where: ''
  };
};
var $62e296927bdba02e$export$2e2bcd8739ae039 = $62e296927bdba02e$var$buildBlankNodesQuery;

const $4eb51c383b9eb050$var$buildAutoDetectBlankNodesQuery = (depth, baseQuery) => {
  const construct = [...baseQuery.construct];
  let where = {};
  if (depth > 0) {
    const whereQueries = [];
    whereQueries.push([baseQuery.where]);
    for (let i = 1; i <= depth; i++) {
      construct.push(
        (0, $bkNnK$rdfjsdatamodel.triple)(
          (0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`),
          (0, $bkNnK$rdfjsdatamodel.variable)(`p${i + 1}`),
          (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`)
        )
      );
      whereQueries.push([
        ...whereQueries[whereQueries.length - 1],
        {
          type: 'filter',
          expression: {
            type: 'operation',
            operator: 'isblank',
            args: [(0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`)]
          }
        },
        (0, $bkNnK$rdfjsdatamodel.triple)(
          (0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`),
          (0, $bkNnK$rdfjsdatamodel.variable)(`p${i + 1}`),
          (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`)
        )
      ]);
    }
    where = {
      type: 'union',
      patterns: whereQueries
    };
  } else if (depth === 0) where = baseQuery.where;
  else throw new Error('The depth of buildAutoDetectBlankNodesQuery should be 0 or more');
  return {
    construct: construct,
    where: where
  };
};
var $4eb51c383b9eb050$export$2e2bcd8739ae039 = $4eb51c383b9eb050$var$buildAutoDetectBlankNodesQuery;

var $1d6ef12386121fca$require$SparqlGenerator = $bkNnK$sparqljs.Generator;
const {
  literal: $1d6ef12386121fca$var$literal,
  namedNode: $1d6ef12386121fca$var$namedNode,
  triple: $1d6ef12386121fca$var$triple,
  variable: $1d6ef12386121fca$var$variable
} = (0, $parcel$interopDefault($bkNnK$rdfjsdatamodel));
const $1d6ef12386121fca$var$generator = new $1d6ef12386121fca$require$SparqlGenerator({});
const $1d6ef12386121fca$var$reservedFilterKeys = [
  'q',
  'sparqlWhere',
  'blankNodes',
  'blankNodesDepth',
  '_servers',
  '_predicates'
];
const $1d6ef12386121fca$var$buildSparqlQuery = ({
  containersUris: containersUris,
  params: params,
  dataModel: dataModel,
  ontologies: ontologies
}) => {
  const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
  const predicates = params.filter?._predicates || dataModel.list?.predicates;
  const blankNodesDepth = params.filter?.blankNodesDepth ?? dataModel.list?.blankNodesDepth ?? 2;
  const filter = {
    ...dataModel.list?.filter,
    ...params.filter
  };
  const baseQuery = (0, $d6253a347864dbab$export$2e2bcd8739ae039)(predicates, ontologies);
  const sparqlJsParams = {
    queryType: 'CONSTRUCT',
    template: baseQuery.construct,
    where: [],
    type: 'query',
    prefixes: ontologies
  };
  const containerWhere = [
    {
      type: 'values',
      values: containersUris.map(containerUri => ({
        '?containerUri': $1d6ef12386121fca$var$namedNode(containerUri)
      }))
    },
    $1d6ef12386121fca$var$triple(
      $1d6ef12386121fca$var$variable('containerUri'),
      $1d6ef12386121fca$var$namedNode('http://www.w3.org/ns/ldp#contains'),
      $1d6ef12386121fca$var$variable('s1')
    ),
    {
      type: 'filter',
      expression: {
        type: 'operation',
        operator: 'isiri',
        args: [$1d6ef12386121fca$var$variable('s1')]
      }
    }
  ];
  let resourceWhere = [];
  if (filter && Object.keys(filter).length > 0) {
    /*
      Example of usage :
      {
        "sparqlWhere": {
          "type": "bgp",
          "triples": [{
            "subject": {"termType": "Variable", "value": "s1"},
            "predicate": {"termType": "NameNode", "value": "http://virtual-assembly.org/ontologies/pair#label"},
            "object": {"termType": "Literal", "value": "My Organization"}
          }]
        }
      }
    */ if (filter.sparqlWhere) {
      // When the SPARQL request comes from the browser's URL, it is a JSON string that must be parsed
      const sparqlWhere =
        filter.sparqlWhere && (typeof filter.sparqlWhere === 'string' || filter.sparqlWhere instanceof String)
          ? JSON.parse(decodeURIComponent(filter.sparqlWhere))
          : filter.sparqlWhere;
      if (Object.keys(sparqlWhere).length > 0)
        [].concat(sparqlWhere).forEach(sw => {
          resourceWhere.push(sw);
        });
    }
    if (filter.q && filter.q.length > 0)
      resourceWhere.push({
        type: 'group',
        patterns: [
          {
            queryType: 'SELECT',
            variables: [$1d6ef12386121fca$var$variable('s1')],
            where: [
              $1d6ef12386121fca$var$triple(
                $1d6ef12386121fca$var$variable('s1'),
                $1d6ef12386121fca$var$variable('p1'),
                $1d6ef12386121fca$var$variable('o1')
              ),
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: 'isliteral',
                  args: [$1d6ef12386121fca$var$variable('o1')]
                }
              },
              {
                type: 'filter',
                expression: {
                  type: 'operation',
                  operator: 'regex',
                  args: [
                    {
                      type: 'operation',
                      operator: 'lcase',
                      args: [
                        {
                          type: 'operation',
                          operator: 'str',
                          args: [$1d6ef12386121fca$var$variable('o1')]
                        }
                      ]
                    },
                    // @ts-expect-error TS(2554): Expected 1-2 arguments, but got 3.
                    $1d6ef12386121fca$var$literal(
                      filter.q.toLowerCase(),
                      '',
                      $1d6ef12386121fca$var$namedNode('http://www.w3.org/2001/XMLSchema#string')
                    )
                  ]
                }
              }
            ],
            type: 'query'
          }
        ]
      });
    // Other filters
    // SPARQL keyword a = filter based on the class of a resource (example => 'a': 'pair:OrganizationType')
    // Other filters are based on a value (example => 'petr:hasAudience': 'http://localhost:3000/audiences/tout-public')
    Object.entries(filter).forEach(([predicate, object]) => {
      if (!$1d6ef12386121fca$var$reservedFilterKeys.includes(predicate))
        resourceWhere.unshift(
          $1d6ef12386121fca$var$triple(
            $1d6ef12386121fca$var$variable('s1'),
            $1d6ef12386121fca$var$namedNode((0, $108795c3831be99f$export$2e2bcd8739ae039)(predicate, ontologies)), // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
            $1d6ef12386121fca$var$namedNode((0, $108795c3831be99f$export$2e2bcd8739ae039)(object, ontologies))
          )
        );
    });
  }
  // Blank nodes
  const blankNodesQuery = blankNodes
    ? (0, $62e296927bdba02e$export$2e2bcd8739ae039)(blankNodes, baseQuery, ontologies)
    : (0, $4eb51c383b9eb050$export$2e2bcd8739ae039)(blankNodesDepth, baseQuery);
  if (blankNodesQuery && blankNodesQuery.construct) {
    // @ts-expect-error TS(2769): No overload matches this call.
    resourceWhere = resourceWhere.concat(blankNodesQuery.where);
    // @ts-expect-error TS(2769): No overload matches this call.
    sparqlJsParams.template = sparqlJsParams.template.concat(blankNodesQuery.construct);
  } else resourceWhere.push(baseQuery.where);
  // @ts-expect-error TS(2345): Argument of type '(Quad | { type: string; values: ... Remove this comment to see the full error message
  sparqlJsParams.where.push(containerWhere, resourceWhere);
  return $1d6ef12386121fca$var$generator.stringify(sparqlJsParams);
};
var $1d6ef12386121fca$export$2e2bcd8739ae039 = $1d6ef12386121fca$var$buildSparqlQuery;

const $fdadbcf8133b8b4f$var$compare = (a, b) => {
  switch (typeof a) {
    case 'string':
      return a.localeCompare(b);
    case 'number':
      return a - b;
    default:
      return 0;
  }
};
const $fdadbcf8133b8b4f$var$fetchSparqlEndpoints = async (containers, resourceId, params, config) => {
  const { dataServers: dataServers, httpClient: httpClient, jsonContext: jsonContext, ontologies: ontologies } = config;
  const dataModel = config.resources[resourceId];
  // Find servers to query with SPARQL
  // (Ignore containers with selected resources, they will be fetched below)
  const serversToQuery = containers
    .filter(c => !c.selectedResources)
    .reduce((acc, cur) => {
      if (!acc.includes(cur.server)) acc.push(cur.server);
      return acc;
    }, []);
  // Run simultaneous SPARQL queries
  const results = await Promise.all(
    serversToQuery.map(
      serverKey =>
        new Promise((resolve, reject) => {
          const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
          const sparqlQuery = (0, $1d6ef12386121fca$export$2e2bcd8739ae039)({
            containersUris: containers.filter(c => c.server === serverKey).map(c => c.uri),
            params: params,
            dataModel: dataModel,
            ontologies: ontologies
          });
          httpClient(dataServers[serverKey].sparqlEndpoint, {
            method: 'POST',
            body: sparqlQuery
          })
            .then(({ json: json }) => {
              // If we declared the blank nodes to dereference, embed only those blank nodes
              // This solve problems which can occur when same-type resources are embedded in other resources
              // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
              const frame =
                blankNodes && dataModel.list?.explicitEmbedOnFraming !== false
                  ? {
                      '@context': jsonContext,
                      '@type': dataModel.types,
                      '@embed': '@never',
                      ...(0, $55c8b4103f19d79c$export$2e2bcd8739ae039)(blankNodes)
                    }
                  : {
                      '@context': jsonContext,
                      '@type': dataModel.types
                    };
              // omitGraph option force results to be in a @graph, even if we have a single result
              return (0, $parcel$interopDefault($bkNnK$jsonld)).frame(json, frame, {
                omitGraph: false
              });
            })
            .then(compactJson => {
              if (compactJson['@id']) {
                const { '@context': context, ...rest } = compactJson;
                compactJson = {
                  '@context': context,
                  '@graph': [rest]
                };
              }
              resolve(
                compactJson['@graph']?.map(resource => ({
                  '@context': compactJson['@context'],
                  ...resource
                })) || []
              );
            })
            .catch(e => reject(e));
        })
    )
  );
  // Merge results from all SPARQL servers
  let resources = results.flat();
  // Append selected resources to SPARQL query results
  const selectedResources = await (0, $448b8598c73a447a$export$2e2bcd8739ae039)(
    containers,
    resources.map(r => r.id),
    config
  );
  resources = resources.concat(selectedResources);
  if (resources.length === 0)
    return {
      data: [],
      total: 0
    };
  // Add id in addition to @id, as this is what React-Admin expects
  let returnData = results.map(item => {
    item.id = item.id || item['@id'];
    return item;
  });
  // TODO sort and paginate the results in the SPARQL query to improve performances
  if (params.sort)
    returnData = returnData.sort((a, b) => {
      if (a[params.sort.field] !== undefined && b[params.sort.field] !== undefined) {
        if (params.sort.order === 'ASC')
          return $fdadbcf8133b8b4f$var$compare(a[params.sort.field], b[params.sort.field]);
        return $fdadbcf8133b8b4f$var$compare(b[params.sort.field], a[params.sort.field]);
      }
      return 0;
    });
  if (params.pagination)
    returnData = returnData.slice(
      (params.pagination.page - 1) * params.pagination.perPage,
      params.pagination.page * params.pagination.perPage
    );
  return {
    data: returnData,
    total: results.length
  };
};
var $fdadbcf8133b8b4f$export$2e2bcd8739ae039 = $fdadbcf8133b8b4f$var$fetchSparqlEndpoints;

/**
 * Return all containers matching the given shape tree
 */ const $1d94774735aa9ea2$var$findContainersWithShapeTree = (shapeTreeUri, serverKeys, dataServers) => {
  const matchingContainers = [];
  const parsedServerKeys = (0, $6531da3b9e8c524a$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
  Object.keys(dataServers).forEach(dataServerKey => {
    if (parsedServerKeys.includes(dataServerKey))
      dataServers[dataServerKey].containers?.forEach(container => {
        if (container.shapeTreeUri === shapeTreeUri) matchingContainers.push(container);
      });
  });
  return matchingContainers;
};
var $1d94774735aa9ea2$export$2e2bcd8739ae039 = $1d94774735aa9ea2$var$findContainersWithShapeTree;

const $95cbc03f25caf72a$var$getListMethod = config => async (resourceId, params) => {
  const { dataServers: dataServers, resources: resources } = config;
  const dataModel = resources[resourceId];
  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
  let containers = [];
  if (!params.filter?._servers && dataModel.list?.containers) {
    if (!Array.isArray(dataModel.list?.containers))
      throw new Error(`The list.containers property of ${resourceId} dataModel must be of type array`);
    // If containers are set explicitly, use them
    containers = (0, $37c161736d0d7276$export$2e2bcd8739ae039)(dataModel.list.containers, dataServers);
  } else if (dataModel.shapeTreeUri)
    containers = (0, $1d94774735aa9ea2$export$2e2bcd8739ae039)(
      dataModel.shapeTreeUri,
      params?.filter?._servers || dataModel.list?.servers,
      dataServers
    ); // Otherwise find the container URIs on the given servers (either in the filter or the data model)
  else
    containers = (0, $047a107b0d203793$export$2e2bcd8739ae039)(
      (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(dataModel.types),
      params?.filter?._servers || dataModel.list?.servers,
      dataServers
    );
  if (dataModel.list?.fetchContainer) return (0, $8c999cc29c8d6a6c$export$2e2bcd8739ae039)(containers, params, config);
  else return (0, $fdadbcf8133b8b4f$export$2e2bcd8739ae039)(containers, resourceId, params, config);
};
var $95cbc03f25caf72a$export$2e2bcd8739ae039 = $95cbc03f25caf72a$var$getListMethod;

const $1e120883e96aa282$var$getManyMethod = config => async (resourceId, params) => {
  const { returnFailedResources: returnFailedResources } = config;
  let returnData = await Promise.all(
    params.ids.map(id =>
      (0, $aa09e6904cf4399f$export$2e2bcd8739ae039)(config)(resourceId, {
        id: typeof id === 'object' ? id['@id'] : id
      })
        .then(({ data: data }) => data)
        .catch(() => {
          // Catch if one resource fails to load
          // Otherwise no references will be show if only one is missing
          // See https://github.com/marmelab/react-admin/issues/5190
          if (returnFailedResources)
            return {
              id: id,
              _error: true
            };
          // Returning nothing
        })
    )
  );
  // We don't want undefined results to appear in the results as it will break with react-admin
  returnData = returnData.filter(e => e);
  return {
    data: returnData
  };
};
var $1e120883e96aa282$export$2e2bcd8739ae039 = $1e120883e96aa282$var$getManyMethod;

const $7529ad20819ad9cc$var$getManyReferenceMethod = config => async (resourceId, params) => {
  params.filter = {
    ...params.filter,
    [params.target]: params.id
  };
  // @ts-expect-error ts(2790): The operand of a 'delete' operator must be optional.
  delete params.target;
  return await (0, $95cbc03f25caf72a$export$2e2bcd8739ae039)(config)(resourceId, params);
};
var $7529ad20819ad9cc$export$2e2bcd8739ae039 = $7529ad20819ad9cc$var$getManyReferenceMethod;

const $fda69bf2752eb49a$var$generator = new (0, $bkNnK$sparqljs.Generator)();
const $fda69bf2752eb49a$var$patchMethod = config => async (resourceId, params) => {
  const { httpClient: httpClient } = config;
  const sparqlUpdate = {
    type: 'update',
    prefixes: {},
    updates: []
  };
  if (params.triplesToAdd)
    sparqlUpdate.updates.push({
      updateType: 'insert',
      insert: [
        {
          type: 'bgp',
          triples: params.triplesToAdd
        }
      ]
    });
  if (params.triplesToRemove)
    sparqlUpdate.updates.push({
      updateType: 'delete',
      delete: [
        {
          type: 'bgp',
          triples: params.triplesToRemove
        }
      ]
    });
  await httpClient(`${params.id}`, {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/sparql-update'
    }),
    body: $fda69bf2752eb49a$var$generator.stringify(sparqlUpdate)
  });
};
var $fda69bf2752eb49a$export$2e2bcd8739ae039 = $fda69bf2752eb49a$var$patchMethod;

// Return the first server matching with the baseUrl
const $68523d444fbb0b63$var$getServerKeyFromUri = (uri, dataServers) => {
  if (!uri) throw Error(`No URI provided to getServerKeyFromUri`);
  return (
    dataServers &&
    Object.keys(dataServers).find(key => {
      if (dataServers[key].pod)
        // The baseUrl ends with /data so remove this part to match with the webId and webId-related URLs (/inbox, /outbox...)
        return dataServers[key].baseUrl && uri.startsWith(dataServers[key].baseUrl.replace('/data', ''));
      return uri.startsWith(dataServers[key].baseUrl);
    })
  );
};
var $68523d444fbb0b63$export$2e2bcd8739ae039 = $68523d444fbb0b63$var$getServerKeyFromUri;

const $ceaafb56f75454f0$var$updateMethod = config => async (resourceId, params) => {
  const { httpClient: httpClient, jsonContext: jsonContext, dataServers: dataServers } = config;
  const serverKey = (0, $68523d444fbb0b63$export$2e2bcd8739ae039)(params.id, dataServers);
  // Upload files, if there are any
  const { updatedRecord: updatedRecord } = await (0, $6fcb30f76390d142$export$2e2bcd8739ae039).upload(
    params.data,
    config,
    serverKey
  );
  params.data = updatedRecord;
  await httpClient(`${params.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      '@context': jsonContext,
      ...params.data
    })
  });
  return {
    data: params.data
  };
};
var $ceaafb56f75454f0$export$2e2bcd8739ae039 = $ceaafb56f75454f0$var$updateMethod;

/**
 *
 * @param dataServers Data servers configuration
 * @param fetchFn The fetch function to use for the actual fetch call, e.g. `fetchUtils.fetchJson` or `fetch`
 * @returns
 */ const $837f5837e4147e21$var$fetchBase =
  (dataServers, fetchFn) =>
  (url, options = {}) => {
    if (!url) throw new Error(`No URL provided on httpClient call`);
    const authServerKey = (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('authServer', dataServers);
    if (!authServerKey) throw new Error(`No auth server configured in data servers`);
    const serverKey = (0, $68523d444fbb0b63$export$2e2bcd8739ae039)(url, dataServers);
    const headers = new Headers(options.headers);
    switch (options.method) {
      case 'POST':
      case 'PATCH':
      case 'PUT':
        if (!headers.has('Accept')) headers.set('Accept', 'application/ld+json');
        if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/ld+json');
        break;
      case 'DELETE':
        break;
      case 'GET':
      default:
        if (!headers.has('Accept')) headers.set('Accept', 'application/ld+json');
        break;
    }
    // Use proxy if...
    if (
      serverKey !== authServerKey && // The server is different from the auth server.
      dataServers[authServerKey]?.proxyUrl && // A proxy URL is configured on the auth server.
      dataServers[serverKey]?.noProxy !== true // The server does not explicitly disable the proxy.
    ) {
      // To the proxy endpoint, we post the URL, method, headers and body (if any) as multipart/form-data.
      const formData = new FormData();
      formData.append('id', url);
      formData.append('method', options.method || 'GET');
      formData.append('headers', JSON.stringify(Object.fromEntries(headers.entries())));
      if (options.body instanceof File) formData.append('body', options.body, options.body.name);
      else if (options.body instanceof Blob || typeof options.body === 'string') formData.append('body', options.body);
      // POST request to proxy endpoint.
      return fetchFn(dataServers[authServerKey].proxyUrl, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        body: formData
      });
    }
    // Add token if the server is the same as the auth server.
    if (serverKey === authServerKey) {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }
    options.headers = headers;
    return fetchFn(url, options);
  };
/**
 * Creates a fetch function that can be used to make calls to the data servers and which returns data formatted as JSON.
 * It will use the proxy endpoint if available and if the server is different from the auth server.
 * It will also set the Accept and Content-Type headers to `application/ld+json` for `POST`, `PATCH`, `PUT` and `GET` requests.
 * @param dataServers Data servers configuration
 * @returns A function with react-admin's fetchJson signature that can be used to make calls to the data servers.
 *
 */ const $837f5837e4147e21$export$64d1f38a5d384966 = dataServers => {
  const fetchBaseFn = $837f5837e4147e21$var$fetchBase(dataServers, (0, $bkNnK$reactadmin.fetchUtils).fetchJson);
  return (url, options) => {
    return fetchBaseFn(url, options);
  };
};
/**
 * Creates an authenticated fetch function that can be used to make calls to the data servers.
 * It will use the proxy endpoint if available and if the server is different from the auth server.
 * @param dataServers Data servers configuration
 * @returns A function that can be used to make authenticated fetch calls.
 */ const $837f5837e4147e21$export$467927aad8938eb1 = dataServers => {
  const fetchBaseFn = $837f5837e4147e21$var$fetchBase(dataServers, fetch);
  return (url, options) => {
    return fetchBaseFn(url, options);
  };
};

const $9ab033d1ec46b5da$var$isURI = value =>
  (typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));
const $9ab033d1ec46b5da$var$expandTypes = async (types, context) => {
  // If types are already full URIs, return them immediately
  if (types.every(type => $9ab033d1ec46b5da$var$isURI(type))) return types;
  const result = await (0, $parcel$interopDefault($bkNnK$jsonld)).expand({
    '@context': context,
    '@type': types
  });
  const expandedTypes = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(result[0]['@type']);
  if (!expandedTypes.every(type => $9ab033d1ec46b5da$var$isURI(type)))
    throw new Error(`
      Could not expand all types (${expandedTypes.join(', ')}).
      Is an ontology missing or not registered yet on the local context ?
    `);
  return expandedTypes;
};
var $9ab033d1ec46b5da$export$2e2bcd8739ae039 = $9ab033d1ec46b5da$var$expandTypes;

const $058bb6151d120fba$var$getTypesFromShapeTree = async shapeTreeUri => {
  let { json: shapeTree } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(shapeTreeUri, {
    headers: new Headers({
      Accept: 'application/ld+json'
    })
  });
  shapeTree = await (0, $parcel$interopDefault($bkNnK$jsonld)).compact(shapeTree, {
    st: 'http://www.w3.org/ns/shapetrees#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    expectsType: {
      '@id': 'st:expectsType',
      '@type': '@id'
    },
    shape: {
      '@id': 'st:shape',
      '@type': '@id'
    },
    describesInstance: {
      '@id': 'st:describesInstance',
      '@type': '@id'
    },
    label: {
      '@id': 'skos:prefLabel',
      '@container': '@language'
    }
  });
  if (shapeTree.shape) {
    const { json: shape } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(shapeTree.shape, {
      headers: new Headers({
        Accept: 'application/ld+json'
      })
    });
    return shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map(node => node?.['@id']) || [];
  } else return [];
};
var $058bb6151d120fba$export$2e2bcd8739ae039 = $058bb6151d120fba$var$getTypesFromShapeTree;

/**
 * For data server containers, expands types and adds `uri` and `server` properties.
 * For resources, expands types (if applicable from shape tree information).
 */ const $5e24772571dd1677$var$normalizeConfig = async config => {
  const newConfig = {
    ...config
  };
  // Add server and uri key to servers' containers
  for (const serverKey of Object.keys(newConfig.dataServers))
    if (newConfig.dataServers[serverKey].containers)
      newConfig.dataServers[serverKey].containers = await Promise.all(
        newConfig.dataServers[serverKey].containers?.map(async container => {
          return {
            ...container,
            types:
              container.types &&
              (await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(container.types, config.jsonContext)),
            server: serverKey,
            uri: (0, $parcel$interopDefault($bkNnK$urljoin))(config.dataServers[serverKey].baseUrl, container.path)
          };
        })
      );
  // Expand types in data models
  for (const resourceId of Object.keys(newConfig.resources)) {
    if (!newConfig.resources[resourceId].types && newConfig.resources[resourceId].shapeTreeUri)
      newConfig.resources[resourceId].types = await (0, $058bb6151d120fba$export$2e2bcd8739ae039)(
        newConfig.resources[resourceId].shapeTreeUri
      );
    newConfig.resources[resourceId].types = await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(
      (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(newConfig.resources[resourceId].types),
      config.jsonContext
    );
  }
  return newConfig;
};
var $5e24772571dd1677$export$2e2bcd8739ae039 = $5e24772571dd1677$var$normalizeConfig;

const $fcf4eee3b18e8350$var$isURL = value =>
  (typeof value === 'string' || value instanceof String) && value.startsWith('http');
const $fcf4eee3b18e8350$var$getOntologiesFromContextJson = contextJson => {
  const ontologies = {};
  for (const [key, value] of Object.entries(contextJson))
    if ($fcf4eee3b18e8350$var$isURL(value)) ontologies[key] = value;
  return ontologies;
};
const $fcf4eee3b18e8350$var$getOntologiesFromContextUrl = async contextUrl => {
  const { json: json } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(contextUrl, {
    headers: new Headers({
      Accept: 'application/ld+json'
    })
  });
  return $fcf4eee3b18e8350$var$getOntologiesFromContextJson(json['@context']);
};
const $fcf4eee3b18e8350$var$getOntologiesFromContext = async context => {
  let ontologies = {};
  if (Array.isArray(context))
    for (const contextUrl of context)
      ontologies = {
        ...ontologies,
        ...(await $fcf4eee3b18e8350$var$getOntologiesFromContextUrl(contextUrl))
      };
  else if (typeof context === 'string') ontologies = await $fcf4eee3b18e8350$var$getOntologiesFromContextUrl(context);
  else ontologies = $fcf4eee3b18e8350$var$getOntologiesFromContextJson(context);
  return ontologies;
};
var $fcf4eee3b18e8350$export$2e2bcd8739ae039 = $fcf4eee3b18e8350$var$getOntologiesFromContext;

const $5eeade28ff354aaa$var$dataProvider = originalConfig => {
  // Keep in memory for refresh
  let config;
  const prepareConfig = async () => {
    const fetchJson = (0, $837f5837e4147e21$export$64d1f38a5d384966)(originalConfig.dataServers);
    const authFetchFn = (0, $837f5837e4147e21$export$467927aad8938eb1)(originalConfig.dataServers);
    const dataset = (0, $bkNnK$ldoconnected.createConnectedLdoDataset)([
      (0, $bkNnK$ldoconnectedsolid.solidConnectedPlugin)
    ]);
    dataset.setContext('solid', {
      fetch: authFetchFn
    });
    config = {
      ...originalConfig,
      httpClient: fetchJson,
      authFetch: authFetchFn,
      dataset: dataset
    };
    config.dataServers ??= {};
    // Load plugins.
    for (const plugin of config.plugins) if (plugin.transformConfig) config = await plugin.transformConfig(config);
    // Configure httpClient & authFetch again with possibly updated data servers
    config.httpClient = (0, $837f5837e4147e21$export$64d1f38a5d384966)(config.dataServers);
    config.authFetch = (0, $837f5837e4147e21$export$467927aad8938eb1)(config.dataServers);
    dataset.setContext('solid', {
      fetch: config.authFetch
    });
    // Create the LDO dataset with the solidConnectedPlugin. It will be used to manage the RDF data.
    config.dataset = dataset;
    // Useful for debugging: Attach httpClient & authFetch to global document.
    // @ts-expect-error TS(2339)
    document.httpClient = config.httpClient;
    // @ts-expect-error TS(2339)
    document.authFetch = authFetchFn;
    if (!config.ontologies && config.jsonContext)
      config.ontologies = await (0, $fcf4eee3b18e8350$export$2e2bcd8739ae039)(config.jsonContext);
    else if (!config.jsonContext && config.ontologies) config.jsonContext = config.ontologies;
    else if (!config.jsonContext && !config.ontologies)
      throw new Error(`Either the JSON context or the ontologies must be set`);
    if (!config.returnFailedResources) config.returnFailedResources = false;
    config = await (0, $5e24772571dd1677$export$2e2bcd8739ae039)(config);
    console.debug('Config after plugins', config);
  };
  // Immediately call the preload plugins
  const prepareConfigPromise = prepareConfig();
  const waitForPrepareConfig =
    method =>
    async (...args) => {
      await prepareConfigPromise; // Return immediately if plugins have already been loaded
      return method(config)(...args);
    };
  return {
    getList: waitForPrepareConfig((0, $95cbc03f25caf72a$export$2e2bcd8739ae039)),
    getMany: waitForPrepareConfig((0, $1e120883e96aa282$export$2e2bcd8739ae039)),
    getManyReference: waitForPrepareConfig((0, $7529ad20819ad9cc$export$2e2bcd8739ae039)),
    getOne: waitForPrepareConfig((0, $aa09e6904cf4399f$export$2e2bcd8739ae039)),
    create: waitForPrepareConfig((0, $c1c6dddad031acf6$export$2e2bcd8739ae039)),
    update: waitForPrepareConfig((0, $ceaafb56f75454f0$export$2e2bcd8739ae039)),
    updateMany: () => {
      throw new Error('updateMany is not implemented yet');
    },
    delete: waitForPrepareConfig((0, $566b5adde94810fa$export$2e2bcd8739ae039)),
    deleteMany: waitForPrepareConfig((0, $3a3bc87603f934e3$export$2e2bcd8739ae039)),
    // Custom methods
    patch: waitForPrepareConfig((0, $fda69bf2752eb49a$export$2e2bcd8739ae039)),
    getDataModels: waitForPrepareConfig((0, $2789979a990866f4$export$2e2bcd8739ae039)),
    getDataServers: waitForPrepareConfig((0, $5a7f64ef6101d5f8$export$2e2bcd8739ae039)),
    getLocalDataServers: (0, $5a7f64ef6101d5f8$export$2e2bcd8739ae039)(originalConfig),
    httpClient: waitForPrepareConfig(c => (0, $837f5837e4147e21$export$64d1f38a5d384966)(c.dataServers)),
    authFetch: waitForPrepareConfig(c => (0, $837f5837e4147e21$export$467927aad8938eb1)(c.dataServers)),
    getDataset: waitForPrepareConfig(c => () => c.dataset),
    uploadFile: waitForPrepareConfig(c => rawFile => (0, $6fcb30f76390d142$export$a5575dbeeffdad98)(rawFile, c)),
    expandTypes: waitForPrepareConfig(
      c => types => (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(types, c.jsonContext)
    ),
    getConfig: waitForPrepareConfig(c => () => c),
    refreshConfig: async () => {
      await prepareConfig();
      return config;
    }
  };
};
var $5eeade28ff354aaa$export$2e2bcd8739ae039 = $5eeade28ff354aaa$var$dataProvider;

const $8c4c0f0b55649ce6$var$getPrefixFromUri = (uri, ontologies) => {
  for (const [prefix, namespace] of Object.entries(ontologies)) {
    if (uri.startsWith(namespace)) return uri.replace(namespace, `${prefix}:`);
  }
  return uri;
};
var $8c4c0f0b55649ce6$export$2e2bcd8739ae039 = $8c4c0f0b55649ce6$var$getPrefixFromUri;

/**
 * Adds `dataServers.user` properties to configuration (baseUrl, sparqlEndpoint, proxyUrl, ...).
 */ const $89358cee13a17a31$var$configureUserStorage = () => ({
  transformConfig: async config => {
    const token = localStorage.getItem('token');
    // If the user is logged in
    if (token) {
      const payload = (0, $parcel$interopDefault($bkNnK$jwtdecode))(token);
      const webId = payload.webId || payload.webid; // Currently we must deal with both formats
      const { json: user } = await config.httpClient(webId);
      if (user) {
        const newConfig = {
          ...config
        };
        newConfig.dataServers[webId] = {
          pod: true,
          default: true,
          authServer: true,
          baseUrl: user['pim:storage'] || (0, $parcel$interopDefault($bkNnK$urljoin))(webId, 'data'),
          sparqlEndpoint:
            user.endpoints?.['void:sparqlEndpoint'] || (0, $parcel$interopDefault($bkNnK$urljoin))(webId, 'sparql'),
          proxyUrl: user.endpoints?.proxyUrl,
          containers: []
        };
        if (!newConfig.jsonContext)
          newConfig.jsonContext = [
            'https://www.w3.org/ns/activitystreams',
            (0, $parcel$interopDefault($bkNnK$urljoin))(new URL(webId).origin, '/.well-known/context.jsonld')
          ];
        return newConfig;
      }
    }
    // Nothing to change
    return config;
  }
});
var $89358cee13a17a31$export$2e2bcd8739ae039 = $89358cee13a17a31$var$configureUserStorage;

const $37dc42f6e1c3b4af$var$getContainerFromDataRegistration = async (dataRegistrationUri, config) => {
  const { json: dataRegistration } = await config.httpClient(dataRegistrationUri, {
    headers: new Headers({
      Accept: 'application/ld+json',
      Prefer: 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
    })
  });
  const shapeTreeUri = dataRegistration['interop:registeredShapeTree'];
  let { json: shapeTree } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(shapeTreeUri, {
    headers: new Headers({
      Accept: 'application/ld+json'
    })
  });
  shapeTree = await (0, $parcel$interopDefault($bkNnK$jsonld)).compact(shapeTree, {
    st: 'http://www.w3.org/ns/shapetrees#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    expectsType: {
      '@id': 'st:expectsType',
      '@type': '@id'
    },
    shape: {
      '@id': 'st:shape',
      '@type': '@id'
    },
    describesInstance: {
      '@id': 'st:describesInstance',
      '@type': '@id'
    },
    label: {
      '@id': 'skos:prefLabel',
      '@container': '@language'
    }
  });
  const userStorage = (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('default', config.dataServers);
  const { baseUrl: baseUrl } = config.dataServers[userStorage];
  const containerPath = dataRegistration.id.replace(baseUrl, '');
  const container = {
    path: containerPath,
    shapeTreeUri: shapeTreeUri,
    label: shapeTree.label,
    labelPredicate: shapeTree.describesInstance,
    binaryResources: shapeTree.expectsType === 'st:NonRDFResource'
  };
  if (shapeTree.shape) {
    const { json: shape } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(shapeTree.shape, {
      headers: new Headers({
        Accept: 'application/ld+json'
      })
    });
    container.types = shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map(node => node?.['@id']);
  }
  return container;
};
var $37dc42f6e1c3b4af$export$2e2bcd8739ae039 = $37dc42f6e1c3b4af$var$getContainerFromDataRegistration;

/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */ const $c512de108ef5d674$var$fetchAppRegistration = (pluginConfig = {}) => {
  const { includeSelectedResources: includeSelectedResources = true } = pluginConfig;
  return {
    transformConfig: async config => {
      const token = localStorage.getItem('token');
      // If the user is logged in
      if (token) {
        const payload = (0, $parcel$interopDefault($bkNnK$jwtdecode))(token);
        const webId = payload.webId || payload.webid; // Currently we must deal with both formats
        const { json: user } = await config.httpClient(webId);
        const authAgentUri = user['interop:hasAuthorizationAgent'];
        if (authAgentUri) {
          // Find if an application registration is linked to this user
          // See https://solid.github.io/data-interoperability-panel/specification/#agent-registration-discovery
          const { headers: headers } = await config.httpClient(authAgentUri);
          if (headers.has('Link')) {
            const linkHeader = (0, $parcel$interopDefault($bkNnK$httplinkheader)).parse(headers.get('Link'));
            const registeredAgentLinkHeader = linkHeader.rel('http://www.w3.org/ns/solid/interop#registeredAgent');
            if (registeredAgentLinkHeader.length > 0) {
              const appRegistrationUri = registeredAgentLinkHeader[0].anchor;
              const { json: appRegistration } = await config.httpClient(appRegistrationUri);
              const newConfig = {
                ...config
              };
              // Load access grants concurrently to improve performances
              const results = await Promise.all(
                (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(appRegistration['interop:hasAccessGrant']).map(
                  async accessGrantUri => {
                    const { json: accessGrant } = await config.httpClient(accessGrantUri);
                    const container = await (0, $37dc42f6e1c3b4af$export$2e2bcd8739ae039)(
                      accessGrant['interop:hasDataRegistration'],
                      config
                    );
                    container.server = accessGrant['interop:dataOwner'];
                    if (accessGrant['interop:scopeOfGrant'] === 'interop:AllFromRegistry') return container;
                    else if (accessGrant['interop:scopeOfGrant'] === 'interop:SelectedFromRegistry') {
                      if (!includeSelectedResources) return undefined;
                      container.selectedResources = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(
                        accessGrant['interop:hasDataInstance']
                      );
                      return container;
                    }
                  }
                )
              );
              // Put data shared by other users in other servers (storages)
              for (const container of results.flat().filter(i => i !== undefined))
                if (!newConfig.dataServers[container.server])
                  newConfig.dataServers[container.server] = {
                    pod: true,
                    baseUrl: `${container.server}/data`,
                    containers: [container]
                  };
                else newConfig.dataServers[container.server].containers.push(container);
              return newConfig;
            }
          }
        }
      }
      return config;
    }
  };
};
var $c512de108ef5d674$export$2e2bcd8739ae039 = $c512de108ef5d674$var$fetchAppRegistration;

/**
 * Plugin to add data registrations to the user containers, by fetching the registry set.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */ const $cd772adda3024172$var$fetchDataRegistry = () => ({
  transformConfig: async config => {
    const token = localStorage.getItem('token');
    // If the user is logged in
    if (token) {
      const payload = (0, $parcel$interopDefault($bkNnK$jwtdecode))(token);
      const webId = payload.webId || payload.webid; // Currently we must deal with both formats
      if (!config.dataServers[webId])
        throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);
      const { json: user } = await config.httpClient(webId);
      const { json: registrySet } = await config.httpClient(user['interop:hasRegistrySet']);
      const { json: dataRegistry } = await config.httpClient(registrySet['interop:hasDataRegistry']);
      if (dataRegistry['interop:hasDataRegistration']) {
        const results = await Promise.all(
          dataRegistry['interop:hasDataRegistration'].map(dataRegistrationUri => {
            return (0, $37dc42f6e1c3b4af$export$2e2bcd8739ae039)(dataRegistrationUri, config);
          })
        );
        const newConfig = {
          ...config
        };
        newConfig.dataServers[webId].containers?.push(...results.flat());
        return newConfig;
      }
    }
    // Nothing to change
    return config;
  }
});
var $cd772adda3024172$export$2e2bcd8739ae039 = $cd772adda3024172$var$fetchDataRegistry;

/**
 * Plugin to add type indexes to the user containers, by fetching the them.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */ const $69d4da9beaa62ac6$var$fetchTypeIndexes = () => ({
  transformConfig: async config => {
    const token = localStorage.getItem('token');
    // If the user is logged in
    if (token) {
      const payload = (0, $parcel$interopDefault($bkNnK$jwtdecode))(token);
      const webId = payload.webId || payload.webid; // Currently we must deal with both formats
      if (!config.dataServers[webId])
        throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);
      const { json: user } = await config.httpClient(webId);
      const typeRegistrations = {
        public: [],
        private: []
      };
      if (user['solid:publicTypeIndex']) {
        const { json: publicTypeIndex } = await config.httpClient(user['solid:publicTypeIndex']);
        if (publicTypeIndex)
          typeRegistrations.public = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(
            publicTypeIndex['solid:hasTypeRegistration']
          );
      }
      if (user['pim:preferencesFile']) {
        const { json: preferencesFile } = await config.httpClient(user['pim:preferencesFile']);
        if (preferencesFile?.['solid:privateTypeIndex']) {
          const { json: privateTypeIndex } = await config.httpClient(preferencesFile['solid:privateTypeIndex']);
          typeRegistrations.private = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(
            privateTypeIndex['solid:hasTypeRegistration']
          );
        }
      }
      if (typeRegistrations.public.length > 0 || typeRegistrations.private.length > 0) {
        const newConfig = {
          ...config
        };
        for (const mode of Object.keys(typeRegistrations))
          for (const typeRegistration of typeRegistrations[mode]) {
            const types = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(typeRegistration['solid:forClass']);
            const container = {
              label: {
                en: (0, $bkNnK$changecase.capitalCase)(types[0].split(':')[1], {
                  separateNumbers: true
                })
              },
              path: typeRegistration['solid:instanceContainer'].replace(newConfig.dataServers[webId].baseUrl, ''),
              types: await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(types, user['@context']),
              private: mode === 'private'
            };
            const containerIndex = newConfig.dataServers[webId].containers.findIndex(c => c.path === container.path);
            if (containerIndex !== -1)
              // If a container with this URI already exist, add type registration information if they are not set
              newConfig.dataServers[webId].containers[containerIndex] = {
                ...container,
                ...newConfig.dataServers[webId].containers[containerIndex]
              };
            else newConfig.dataServers[webId].containers.push(container);
          }
        return newConfig;
      }
    }
    return config;
  }
});
var $69d4da9beaa62ac6$export$2e2bcd8739ae039 = $69d4da9beaa62ac6$var$fetchTypeIndexes;

const $1395e306228d41f2$var$fetchVoidEndpoints = () => ({
  transformConfig: async config => {
    let results = [];
    try {
      results = await Promise.all(
        Object.entries(config.dataServers)
          .filter(([_, server]) => server.pod !== true && server.void !== false)
          .map(async ([key, server]) =>
            config
              .httpClient(new URL('/.well-known/void', server.baseUrl).toString())
              .then(result => ({
                key: key,
                context: result.json?.['@context'],
                datasets: result.json?.['@graph']
              }))
              .catch(e => {
                if (e.status === 404 || e.status === 401 || e.status === 500)
                  return {
                    key: key,
                    error: e.message
                  };
                throw e;
              })
          )
      );
    } catch (e) {
      // Do not throw error if no endpoint found
    }
    results = results.filter(result => result.datasets);
    if (results.length > 0) {
      const newConfig = {
        ...config
      };
      for (const result of results) {
        // Ignore unfetchable endpoints
        if (result.datasets)
          for (const dataset of result.datasets) {
            newConfig.dataServers[result.key].name ??= dataset['dc:title'];
            newConfig.dataServers[result.key].description ??= dataset['dc:description'];
            newConfig.dataServers[result.key].sparqlEndpoint ??= dataset['void:sparqlEndpoint'];
            newConfig.dataServers[result.key].containers ??= [];
            for (const partition of (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(dataset['void:classPartition']))
              for (const type of (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(partition['void:class'])) {
                const path = partition['void:uriSpace'].replace(dataset['void:uriSpace'], '/');
                const expandedTypes = await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)([type], result.context);
                const containerIndex = newConfig.dataServers[result.key].containers.findIndex(c => c.path === path);
                if (containerIndex !== -1) {
                  // If a container with this path already exist, merge types
                  const mergedTypes = [
                    ...newConfig.dataServers[result.key].containers[containerIndex].types,
                    ...expandedTypes
                  ].filter((v, i, a) => a.indexOf(v) === i);
                  newConfig.dataServers[result.key].containers[containerIndex] = {
                    ...newConfig.dataServers[result.key].containers[containerIndex],
                    types: mergedTypes,
                    binaryResources: mergedTypes.includes('http://semapps.org/ns/core#File')
                  };
                } else
                  newConfig.dataServers[result.key].containers.push({
                    path: path,
                    types: expandedTypes,
                    binaryResources: expandedTypes.includes('http://semapps.org/ns/core#File')
                  });
              }
          }
      }
      return newConfig;
    } else return config;
  }
});
var $1395e306228d41f2$export$2e2bcd8739ae039 = $1395e306228d41f2$var$fetchVoidEndpoints;

const $9def35f4441a9bb2$var$useDataProviderConfig = () => {
  const dataProvider = (0, $bkNnK$reactadmin.useDataProvider)();
  const [config, setConfig] = (0, $bkNnK$react.useState)();
  const [isLoading, setIsLoading] = (0, $bkNnK$react.useState)(false);
  (0, $bkNnK$react.useEffect)(() => {
    if (!isLoading && !config) {
      setIsLoading(true);
      dataProvider.getConfig().then(c => {
        setConfig(c);
        setIsLoading(false);
      });
    }
  }, [dataProvider, setConfig, config, setIsLoading, isLoading]);
  return config;
};
var $9def35f4441a9bb2$export$2e2bcd8739ae039 = $9def35f4441a9bb2$var$useDataProviderConfig;

const $013953e307d438b1$var$compactPredicate = async (predicate, context) => {
  const result = await (0, $parcel$interopDefault($bkNnK$jsonld)).compact(
    {
      [predicate]: ''
    },
    context
  );
  return Object.keys(result).find(key => key !== '@context');
};
var $013953e307d438b1$export$2e2bcd8739ae039 = $013953e307d438b1$var$compactPredicate;

const $9d33c8835e67bede$var$useCompactPredicate = (predicate, context) => {
  const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
  const [result, setResult] = (0, $bkNnK$react.useState)();
  (0, $bkNnK$react.useEffect)(() => {
    if (config && predicate)
      (0, $013953e307d438b1$export$2e2bcd8739ae039)(predicate, context || config.jsonContext).then(r => {
        setResult(r);
      });
  }, [predicate, setResult, config, context]);
  return result;
};
var $9d33c8835e67bede$export$2e2bcd8739ae039 = $9d33c8835e67bede$var$useCompactPredicate;

const $20621bc841a5205a$var$useDataModels = () => {
  const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
  return config?.resources;
};
var $20621bc841a5205a$export$2e2bcd8739ae039 = $20621bc841a5205a$var$useDataModels;

const $c9933a88e2acc4da$var$useDataServers = () => {
  const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
  return config?.dataServers;
};
var $c9933a88e2acc4da$export$2e2bcd8739ae039 = $c9933a88e2acc4da$var$useDataServers;

const $3158e0dc13ffffaa$var$useContainers = (resourceId, serverKeys) => {
  const dataModels = (0, $20621bc841a5205a$export$2e2bcd8739ae039)();
  const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
  const [containers, setContainers] = (0, $bkNnK$react.useState)([]);
  // Warning: if serverKeys change, the containers list will not be updated (otherwise we have an infinite re-render loop)
  (0, $bkNnK$react.useEffect)(() => {
    if (dataServers && dataModels) {
      if (resourceId) {
        const dataModel = dataModels[resourceId];
        setContainers(
          (0, $047a107b0d203793$export$2e2bcd8739ae039)(
            (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(dataModel.types),
            serverKeys,
            dataServers
          )
        );
      } else {
        const parsedServerKeys = (0, $6531da3b9e8c524a$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
        setContainers(parsedServerKeys.map(serverKey => dataServers[serverKey].containers).flat());
      }
    }
  }, [dataModels, dataServers, setContainers, resourceId]);
  return containers;
};
var $3158e0dc13ffffaa$export$2e2bcd8739ae039 = $3158e0dc13ffffaa$var$useContainers;

const $21fb109d85e9c16c$var$useContainersByTypes = types => {
  const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
  const dataProvider = (0, $bkNnK$reactadmin.useDataProvider)();
  const [containers, setContainers] = (0, $bkNnK$react.useState)([]);
  (0, $bkNnK$react.useEffect)(() => {
    if (dataServers && types)
      dataProvider
        .expandTypes((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(types))
        .then(expandedTypes => {
          setContainers((0, $047a107b0d203793$export$2e2bcd8739ae039)(expandedTypes, '@all', dataServers));
        })
        .catch(() => {
          // Ignore errors
        });
  }, [dataServers, dataProvider, setContainers, types]);
  return containers;
};
var $21fb109d85e9c16c$export$2e2bcd8739ae039 = $21fb109d85e9c16c$var$useContainersByTypes;

const $d3746ce11bc56f3b$var$useContainerByUri = containerUri => {
  const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
  const [container, setContainer] = (0, $bkNnK$react.useState)();
  (0, $bkNnK$react.useEffect)(() => {
    if (dataServers && containerUri)
      Object.keys(dataServers).forEach(serverKey => {
        dataServers[serverKey].containers?.forEach(c => {
          if (c.uri === containerUri) setContainer(c);
        });
      });
  }, [dataServers, setContainer, containerUri]);
  return container;
};
var $d3746ce11bc56f3b$export$2e2bcd8739ae039 = $d3746ce11bc56f3b$var$useContainerByUri;

const $ff3623bf1421ebcc$var$findCreateContainerWithTypes = (types, createServerKey, dataServers) => {
  if (!dataServers[createServerKey].containers)
    throw new Error(`Data server ${createServerKey} has no declared containers`);
  const matchingContainers = dataServers[createServerKey].containers.filter(container =>
    container.types?.some(t => types.includes(t))
  );
  if (matchingContainers.length === 0)
    throw new Error(
      `No container found matching with types ${JSON.stringify(types)}. You can set explicitly the create.container property of the resource.`
    );
  else if (matchingContainers.length > 1)
    throw new Error(
      `More than one container found matching with types ${JSON.stringify(types)}. You must set the create.server or create.container property for the resource.`
    );
  return matchingContainers[0].uri;
};
var $ff3623bf1421ebcc$export$2e2bcd8739ae039 = $ff3623bf1421ebcc$var$findCreateContainerWithTypes;

const $32d32215b4e4729f$var$useGetCreateContainerUri = () => {
  const dataModels = (0, $20621bc841a5205a$export$2e2bcd8739ae039)();
  const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
  const getCreateContainerUri = (0, $bkNnK$react.useCallback)(
    resourceId => {
      if (!resourceId || !dataModels || !dataServers || !dataModels[resourceId]) return undefined;
      const dataModel = dataModels[resourceId];
      if (dataModel.create?.container) return dataModel.create.container;
      else if (dataModel.create?.server)
        return (0, $ff3623bf1421ebcc$export$2e2bcd8739ae039)(dataModel.types, dataModel.create.server, dataServers);
      else {
        const defaultServerKey = (0, $0a5fcc1f7fc2050f$export$2e2bcd8739ae039)('default', dataServers);
        if (!defaultServerKey)
          throw new Error(
            `No default dataServer found. You can set explicitly one setting the "default" attribute to true`
          );
        return (0, $ff3623bf1421ebcc$export$2e2bcd8739ae039)(dataModel.types, defaultServerKey, dataServers);
      }
    },
    [dataModels, dataServers]
  );
  return getCreateContainerUri;
};
var $32d32215b4e4729f$export$2e2bcd8739ae039 = $32d32215b4e4729f$var$useGetCreateContainerUri;

const $298b78bb7d4a3358$var$useCreateContainerUri = resourceId => {
  const getCreateContainerUri = (0, $32d32215b4e4729f$export$2e2bcd8739ae039)();
  const createContainerUri = (0, $bkNnK$react.useMemo)(
    () => getCreateContainerUri(resourceId),
    [getCreateContainerUri, resourceId]
  );
  return createContainerUri;
};
var $298b78bb7d4a3358$export$2e2bcd8739ae039 = $298b78bb7d4a3358$var$useCreateContainerUri;

const $63a32f1a35c6f80e$var$useDataModel = resourceId => {
  const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
  return config?.resources[resourceId];
};
var $63a32f1a35c6f80e$export$2e2bcd8739ae039 = $63a32f1a35c6f80e$var$useDataModel;

const $413b0e8af6982264$var$compute = (externalLinks, record) =>
  typeof externalLinks === 'function' ? externalLinks(record) : externalLinks;
const $413b0e8af6982264$var$isURL = url => typeof url === 'string' && url.startsWith('http');
const $413b0e8af6982264$var$useGetExternalLink = componentExternalLinks => {
  // Since the externalLinks config is defined only locally, we don't need to wait for VOID endpoints fetching
  const dataProvider = (0, $bkNnK$react.useContext)((0, $bkNnK$reactadmin.DataProviderContext));
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const dataServers = dataProvider.getLocalDataServers();
  const serversExternalLinks = (0, $bkNnK$react.useMemo)(() => {
    if (dataServers)
      return Object.fromEntries(
        Object.values(dataServers).map(server => {
          // If externalLinks is not defined in the data server, use external links for non-default servers
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          const externalLinks = server.externalLinks !== undefined ? server.externalLinks : !server.default;
          // @ts-expect-error TS(2571): Object is of type 'unknown'.
          return [server.baseUrl, externalLinks];
        })
      );
  }, [dataServers]);
  return (0, $bkNnK$react.useCallback)(
    record => {
      const computedComponentExternalLinks = $413b0e8af6982264$var$compute(componentExternalLinks, record);
      // If the component explicitly asks not to display as external links, use an internal link
      if (computedComponentExternalLinks === false) return false;
      if (!record?.id) return false;
      const serverBaseUrl = Object.keys(serversExternalLinks).find(baseUrl => record?.id.startsWith(baseUrl));
      // If no matching data servers could be found, assume we have an internal link
      if (!serverBaseUrl) return false;
      const computedServerExternalLinks = $413b0e8af6982264$var$compute(serversExternalLinks[serverBaseUrl], record);
      // If the data server explicitly asks not to display as external links, use an internal link
      if (computedServerExternalLinks === false) return false;
      if ($413b0e8af6982264$var$isURL(computedComponentExternalLinks)) return computedComponentExternalLinks;
      if ($413b0e8af6982264$var$isURL(computedServerExternalLinks)) return computedServerExternalLinks;
      return record.id;
    },
    [serversExternalLinks, componentExternalLinks]
  );
};
var $413b0e8af6982264$export$2e2bcd8739ae039 = $413b0e8af6982264$var$useGetExternalLink;

const $d602250066d4ff3e$var$useGetPrefixFromUri = () => {
  const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
  return (0, $bkNnK$react.useCallback)(
    uri => (0, $8c4c0f0b55649ce6$export$2e2bcd8739ae039)(uri, config.ontologies),
    [config?.ontologies]
  );
};
var $d602250066d4ff3e$export$2e2bcd8739ae039 = $d602250066d4ff3e$var$useGetPrefixFromUri;

/**
 * @example
 * <Show>
 *   <FilterHandler
 *     source="property" // ex pair:organizationOfMembership
 *     filter={{
 *       'propertyToFilter':'value'
 *     }} // ex {{'pair:membershipRole':'http://localhost:3000/membership-roles/role-1'}}
 *     >
 *     <SingleFieldList>
 *    </SingleFieldList>
 *   </FilterHandler>
 * </Show>
 */ const $d7e56c289bd8ceb0$var$FilterHandler = ({
  children: children,
  record: record,
  filter: filter,
  source: source,
  ...otherProps
}) => {
  const [filtered, setFiltered] = (0, $bkNnK$react.useState)();
  (0, $bkNnK$react.useEffect)(() => {
    if (record && source && Array.isArray(record?.[source])) {
      const filteredData = record?.[source].filter(r => {
        let eq = true;
        for (const key in filter) {
          const value = r[key];
          if (Array.isArray(value)) {
            if (!value.includes(filter[key])) eq = false;
          } else if (value !== filter[key]) eq = false;
        }
        return eq;
      });
      const newRecord = {
        ...record
      };
      // undefined setted if no data to obtain no render in RightLabel or equivalent
      newRecord[source] = filteredData.length > 0 ? filteredData : undefined;
      setFiltered(newRecord);
    }
  }, [record, source, filter]);
  return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactjsxruntime.Fragment), {
    children: (0, $parcel$interopDefault($bkNnK$react)).Children.map(children, (child, i) => {
      return /*#__PURE__*/ (0, $parcel$interopDefault($bkNnK$react)).cloneElement(child, {
        ...otherProps,
        record: filtered,
        source: source
      });
    })
  });
};
var $d7e56c289bd8ceb0$export$2e2bcd8739ae039 = $d7e56c289bd8ceb0$var$FilterHandler;

/*
 * @example Label used in examples
 *  const Label = ({label, ...otherProps})=>{
 *     return <h2>{label}</h2>
 *  }
 *
 * @example show header for each group with group property thanks to groupHeader
 * <GroupedReferenceHandler
 *   source="property" // predicat of main record to show / ex pair:organizationOfMembership
 *   groupReference="RAresource" // React-Admin resource reference. this is the "group by" ressource. / ex MembershipRole
 *   groupHeader={({group,...otherProps}) => <Label {...otherProps} label={group['pair:label']}></Label> }
 *   filterProperty="property of source filtered by groupReference"
 * >
 *   <ArrayField source="property"> // same props as GroupedArrayField source
 *    <ImageList>
 *    </ImageList>
 *   </ArrayField>
 * </GroupedReferenceHandler>
 *
 * @example call chhildren with label thanks to groupLabel
 * <GroupedReferenceHandler
 *   source="property" // predicat of main record to show / ex pair:organizationOfMembership
 *   groupReference="RAresource" // React-Admin resource reference. this is the "group by" ressource. / ex MembershipRole
 *   groupLabel="property of RAresource display" // property of React-Admin resource to display. children call whith props "label" filled by groupLabel property of groupReference
 *   filterProperty="property of source filtered by groupReference"
 * >
 *   <Label>
 *   <ArrayField source="property"> // same props as GroupedArrayField source
 *    <ImageList>
 *    </ImageList>
 *   </ArrayField>
 * </GroupedReferenceHandler>
 *
 * @example conditional show of group if no data in source. Conditionale groupHeader is not possible because GroupedArrayField define group before filter ; need use chhildren.
 * const ConditionalSourceDefinedHandler = ({record,source,children,...otherProps})=>{
 *   if (record?.[source] && (!Array.isArray(record[source])||record[source].length>0)){
 *     return  React.Children.map(children, (child, i) => {
 *         return React.cloneElement(child, {...otherProps,record,source});
 *       })
 *   }else{
 *     return <></>
 *   }
 * }
 *
 * <GroupedReferenceHandler
 *   source="property" // predicat of main record to show / ex pair:organizationOfMembership
 *   groupReference="RAresource" // React-Admin resource reference. this is the "group by" ressource. / ex MembershipRole
 *   groupLabel="property of RAresource display" // property of React-Admin resource to display. children call whith props "label" filled by groupLabel property of groupReference
 *   filterProperty="property of source filtered by groupReference"
 * >
 *  <ConditionalSourceDefinedHandler>
 *   <Label>
 *   <ArrayField source="property"> // same props as GroupedArrayField source
 *    <ImageList>
 *    </ImageList>
 *   </ArrayField>
 *  </ConditionalSourceDefinedHandler>
 * </GroupedReferenceHandler>
 *
 *
 */ const $62e4c61f126cac5e$var$GroupedReferenceHandler = ({
  children: children,
  groupReference: groupReference,
  groupLabel: groupLabel,
  groupHeader: groupHeader,
  filterProperty: filterProperty,
  ...otherProps
}) => {
  const record = (0, $bkNnK$reactadmin.useRecordContext)();
  const { data: data } = (0, $bkNnK$reactadmin.useGetList)(groupReference);
  return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactjsxruntime.Fragment), {
    children: data?.map((data, index) => {
      const filter = {};
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      filter[filterProperty] = data.id;
      return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsxs)((0, $bkNnK$reactjsxruntime.Fragment), {
        children: [
          groupHeader &&
            groupHeader({
              ...otherProps,
              group: data
            }),
          /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $d7e56c289bd8ceb0$export$2e2bcd8739ae039), {
            ...otherProps,
            record: record,
            filter: filter,
            label: data[groupLabel],
            children: children
          })
        ]
      });
    })
  });
};
var $62e4c61f126cac5e$export$2e2bcd8739ae039 = $62e4c61f126cac5e$var$GroupedReferenceHandler;

const $ef83a7754e7f8331$var$useReferenceInputStyles = (0, $parcel$interopDefault($bkNnK$muistylesmakeStyles))({
  form: {
    display: 'flex'
  },
  input: {
    paddingRight: '20px'
  }
});
const $ef83a7754e7f8331$var$useHideInputStyles = (0, $parcel$interopDefault($bkNnK$muistylesmakeStyles))({
  root: {
    display: 'none'
  }
});
const $ef83a7754e7f8331$var$ReificationArrayInput = props => {
  const { reificationClass: reificationClass, children: children, ...otherProps } = props;
  // @ts-expect-error TS(2349): This expression is not callable.
  const flexFormClasses = $ef83a7754e7f8331$var$useReferenceInputStyles();
  // @ts-expect-error TS(2349): This expression is not callable.
  const hideInputStyles = $ef83a7754e7f8331$var$useHideInputStyles();
  return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactadmin.ArrayInput), {
    ...otherProps,
    children: /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsxs)((0, $bkNnK$reactadmin.SimpleFormIterator), {
      // @ts-expect-error TS(2322): Type '{ children: any[]; classes: { form: any; }; ... Remove this comment to see the full error message
      classes: {
        form: flexFormClasses.form
      },
      children: [
        (0, $parcel$interopDefault($bkNnK$react)).Children.map(props.children, (child, i) => {
          return /*#__PURE__*/ (0, $parcel$interopDefault($bkNnK$react)).cloneElement(child, {
            className: flexFormClasses.input
          });
        }),
        /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactadmin.TextInput), {
          className: hideInputStyles.root,
          source: 'type',
          // @ts-expect-error TS(2322): Type '{ className: any; source: string; initialVal... Remove this comment to see the full error message
          initialValue: reificationClass
        })
      ]
    })
  });
};
var $ef83a7754e7f8331$export$2e2bcd8739ae039 = $ef83a7754e7f8331$var$ReificationArrayInput;

/**
 * Find the solid notification description resource for a given resource URI.
 */ const $84ab912646919f8c$var$findDescriptionResource = async (authenticatedFetch, resourceUri) => {
  const { headers: headers } = await authenticatedFetch(resourceUri, {
    method: 'HEAD'
  });
  const linkHeader = headers.get('Link');
  const matches = linkHeader?.match(
    /<([^>]+)>;\s*rel="(?:describedby|http:\/\/www\.w3\.org\/ns\/solid\/terms#storageDescription)"/
  );
  if (!matches?.[1]) return undefined;
  // Don't use authenticatedFetch to get this endpoint
  const response = await fetch(matches[1], {
    headers: new Headers({
      Accept: 'application/ld+json'
    })
  });
  return await response.json();
};
const $84ab912646919f8c$export$3edfe18db119b920 = async (
  authenticatedFetch,
  resourceUri,
  options = {
    type: 'WebSocketChannel2023'
  }
) => {
  const { type: type, closeAfter: closeAfter, startIn: startIn, rate: rate } = options;
  let { startAt: startAt, endAt: endAt } = options;
  if (startIn && !startAt) startAt = new Date(Date.now() + startIn).toISOString();
  if (closeAfter && !endAt) endAt = new Date(Date.now() + closeAfter).toISOString();
  const descriptionResource = await $84ab912646919f8c$var$findDescriptionResource(authenticatedFetch, resourceUri);
  // TODO: use a json-ld parser / ldo in the future for this...
  // Get solid notification subscription service for the given type.
  const subscriptionService = (
    await Promise.all(
      // Get the subscription service resources (that describe a channel type).
      (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(
        descriptionResource.subscription || descriptionResource['notify:subscription']
      ).map(async subscriptionServiceOrUri => {
        // They might not be resolved...
        if (typeof subscriptionServiceOrUri === 'string') {
          // Don't use authenticatedFetch to get this endpoint
          const response = await fetch(subscriptionServiceOrUri, {
            headers: new Headers({
              Accept: 'application/ld+json'
            })
          });
          return await response.json();
        }
        return subscriptionServiceOrUri;
      })
    )
  ).find(service => {
    // Find for the correct channel type (e.g. web socket).
    const channelType = service.channelType ?? service['notify:channelType'];
    return channelType === type || channelType === `notify:${type}`;
  });
  if (!subscriptionService) throw new Error(`No solid notification subscription service found for type ${type}`);
  // Create a new channel.
  const { json: channel } = await authenticatedFetch(subscriptionService.id || subscriptionService['@id'], {
    method: 'POST',
    body: JSON.stringify({
      '@context': 'https://www.w3.org/ns/solid/notifications-context/v1',
      type: 'WebSocketChannel2023',
      topic: resourceUri,
      startAt: startAt,
      endAt: endAt,
      rate: rate
    })
  });
  return channel;
};
const $84ab912646919f8c$export$28772ab4c256e709 = async (authenticatedFetch, resourceUri, options) => {
  const channel = await $84ab912646919f8c$export$3edfe18db119b920(authenticatedFetch, resourceUri, options);
  const receiveFrom = channel.receiveFrom || channel['notify:receiveFrom'];
  return new WebSocket(receiveFrom);
};
const $84ab912646919f8c$var$registeredWebSockets = new Map();
/**
 * @param authenticatedFetch A react admin fetch function.
 * @param resourceUri The resource to subscribe to
 * @param options Options to pass to @see createSolidNotificationChannel, if the channel does not exist yet.
 * @returns {WebSocket} A new or existing web socket that subscribed to the given resource.
 */ const $84ab912646919f8c$export$8d60734939c59ced = async (
  authenticatedFetch,
  resourceUri,
  options = {
    type: 'WebSocketChannel2023',
    closeAfter: 3600000
  }
) => {
  const socket = $84ab912646919f8c$var$registeredWebSockets.get(resourceUri);
  if (socket)
    // Will resolve or is resolved already.
    return socket;
  // Create a promise, to return immediately and set the sockets cache.
  // This prevents racing conditions that create multiple channels.
  const wsPromise = $84ab912646919f8c$export$28772ab4c256e709(authenticatedFetch, resourceUri, {
    ...options,
    type: 'WebSocketChannel2023'
  }).then(ws => {
    // Remove the promise from the cache, if it closes.
    ws.addEventListener('close', e => {
      $84ab912646919f8c$var$registeredWebSockets.delete(resourceUri);
    });
    // Close the socket, if the endAt / closeAfter time is reached.
    const closeIn = options.closeAfter ?? (options.endAt && new Date(options.endAt).getTime() - Date.now());
    if (closeIn)
      setTimeout(() => {
        ws.close();
      }, closeIn);
    return ws;
  });
  $84ab912646919f8c$var$registeredWebSockets.set(resourceUri, wsPromise);
  return wsPromise;
};

var $1bc09db736a9cb94$exports = {};
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

$parcel$exportWildcard(module.exports, $1bc09db736a9cb94$exports);

//# sourceMappingURL=index.cjs.js.map
