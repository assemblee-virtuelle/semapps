var $bkNnK$speakingurl = require("speakingurl");
var $bkNnK$jsonld = require("jsonld");
var $bkNnK$rdfjsdatamodel = require("@rdfjs/data-model");
var $bkNnK$sparqljs = require("sparqljs");
var $bkNnK$cryptojsmd5 = require("crypto-js/md5");
var $bkNnK$reactadmin = require("react-admin");
var $bkNnK$urljoin = require("url-join");
var $bkNnK$jwtdecode = require("jwt-decode");
var $bkNnK$httplinkheader = require("http-link-header");
var $bkNnK$changecase = require("change-case");
var $bkNnK$react = require("react");
var $bkNnK$reactjsxruntime = require("react/jsx-runtime");
var $bkNnK$muistylesmakeStyles = require("@mui/styles/makeStyles");


function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
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
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "dataProvider", () => $7f6a16d0025dc83a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "buildSparqlQuery", () => $33c37185da3771a9$export$2e2bcd8739ae039);
$parcel$export(module.exports, "buildBlankNodesQuery", () => $64d4ce40c79d1509$export$2e2bcd8739ae039);
$parcel$export(module.exports, "getUriFromPrefix", () => $108795c3831be99f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "getPrefixFromUri", () => $8c4c0f0b55649ce6$export$2e2bcd8739ae039);
$parcel$export(module.exports, "configureUserStorage", () => $89358cee13a17a31$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchAppRegistration", () => $c512de108ef5d674$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchDataRegistry", () => $cd772adda3024172$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchTypeIndexes", () => $69d4da9beaa62ac6$export$2e2bcd8739ae039);
$parcel$export(module.exports, "fetchVoidEndpoints", () => $1395e306228d41f2$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useCompactPredicate", () => $9d33c8835e67bede$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useContainers", () => $3158e0dc13ffffaa$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useContainersByTypes", () => $21fb109d85e9c16c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useContainerByUri", () => $d3746ce11bc56f3b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useCreateContainerUri", () => $298b78bb7d4a3358$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataModel", () => $63a32f1a35c6f80e$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataModels", () => $20621bc841a5205a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataProviderConfig", () => $9def35f4441a9bb2$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataServers", () => $c9933a88e2acc4da$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useGetCreateContainerUri", () => $32d32215b4e4729f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useGetExternalLink", () => $85e9a897c6d7c14a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useGetPrefixFromUri", () => $d602250066d4ff3e$export$2e2bcd8739ae039);
$parcel$export(module.exports, "FilterHandler", () => $f763906f9b20f2d8$export$2e2bcd8739ae039);
$parcel$export(module.exports, "GroupedReferenceHandler", () => $b4703fef6d6af456$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReificationArrayInput", () => $030f1232f6810456$export$2e2bcd8739ae039);
$parcel$export(module.exports, "createWsChannel", () => $84ab912646919f8c$export$28772ab4c256e709);
$parcel$export(module.exports, "getOrCreateWsChannel", () => $84ab912646919f8c$export$8d60734939c59ced);
$parcel$export(module.exports, "createSolidNotificationChannel", () => $84ab912646919f8c$export$3edfe18db119b920);
var $1bc09db736a9cb94$exports = {};
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */ 



const $3db7a4510a668a04$var$fetchResource = async (resourceUri, config)=>{
    const { httpClient: httpClient, jsonContext: jsonContext } = config;
    let { json: data } = await httpClient(resourceUri);
    if (!data) throw new Error(`Not a valid JSON: ${resourceUri}`);
    data.id = data.id || data['@id'];
    // We compact only if the context is different between the frontend and the middleware
    // TODO deep compare if the context is an object
    if (data['@context'] !== jsonContext) data = await (0, ($parcel$interopDefault($bkNnK$jsonld))).compact(data, jsonContext);
    return data;
};
var $3db7a4510a668a04$export$2e2bcd8739ae039 = $3db7a4510a668a04$var$fetchResource;


const $9020b8e3f4a4c1a1$var$getOneMethod = (config)=>async (resourceId, params)=>{
        const { resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
        const data = await (0, $3db7a4510a668a04$export$2e2bcd8739ae039)(params.id, config);
        // Transform single value into array if forceArray is set
        if (dataModel.list?.forceArray) {
            for (const forceArrayItem of dataModel.list?.forceArray || [])if (data[forceArrayItem] && !Array.isArray(data[forceArrayItem])) data[forceArrayItem] = [
                data[forceArrayItem]
            ];
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
var $9020b8e3f4a4c1a1$export$2e2bcd8739ae039 = $9020b8e3f4a4c1a1$var$getOneMethod;


const $0edd1f2d07c8231f$var$getUploadsContainerUri = (config, serverKey)=>{
    // If no server key is defined or if the server has no uploads container, find any server with a uploads container
    if (!serverKey || !config.dataServers[serverKey].containers || !config.dataServers[serverKey].containers?.find((c)=>c.binaryResources)) serverKey = Object.keys(config.dataServers).find((key)=>config.dataServers[key].containers?.find((c)=>c.binaryResources));
    if (serverKey) return config.dataServers[serverKey].containers?.find((c)=>c.binaryResources)?.uri;
    else // No server has an uploads container
    return null;
};
var $0edd1f2d07c8231f$export$2e2bcd8739ae039 = $0edd1f2d07c8231f$var$getUploadsContainerUri;


const $6fcb30f76390d142$var$isFile = (o)=>o?.rawFile && o.rawFile instanceof File;
const $6fcb30f76390d142$var$isFileToDelete = (o)=>o?.fileToDelete !== undefined && o?.fileToDelete !== null;
const $6fcb30f76390d142$export$a5575dbeeffdad98 = async (rawFile, config, serverKey)=>{
    const uploadsContainerUri = (0, $0edd1f2d07c8231f$export$2e2bcd8739ae039)(config, serverKey);
    if (!uploadsContainerUri) throw new Error("You must define an container with binaryResources in one of the server's configuration");
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
const $6fcb30f76390d142$var$deleteFiles = async (filesToDelete, config)=>{
    return Promise.all(filesToDelete.map((file)=>config.httpClient(file, {
            method: 'DELETE'
        })));
};
/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */ const $6fcb30f76390d142$var$uploadAllFiles = async (record, config, serverKey)=>{
    const filesToDelete = [];
    const updatedRecord = {
        ...record
    };
    for (const property of Object.keys(record)){
        const value = record[property];
        if (Array.isArray(value)) for(let i = 0; i < value.length; i++){
            const itemValue = value[i];
            if ($6fcb30f76390d142$var$isFile(itemValue)) {
                if ($6fcb30f76390d142$var$isFileToDelete(itemValue)) filesToDelete.push(itemValue.fileToDelete);
                updatedRecord[property][i] = await $6fcb30f76390d142$export$a5575dbeeffdad98(itemValue.rawFile, config, serverKey);
            } else if ($6fcb30f76390d142$var$isFileToDelete(itemValue)) {
                filesToDelete.push(itemValue.fileToDelete);
                updatedRecord[property][i] = null;
            }
        }
        else if ($6fcb30f76390d142$var$isFile(value)) {
            if ($6fcb30f76390d142$var$isFileToDelete(value)) filesToDelete.push(value.fileToDelete);
            updatedRecord[property] = await $6fcb30f76390d142$export$a5575dbeeffdad98(value.rawFile, config, serverKey);
        } else if ($6fcb30f76390d142$var$isFileToDelete(value)) {
            filesToDelete.push(value.fileToDelete);
            updatedRecord[property] = null;
        }
    }
    return {
        updatedRecord: updatedRecord,
        filesToDelete: filesToDelete
    };
};
var $6fcb30f76390d142$export$2e2bcd8739ae039 = {
    upload: $6fcb30f76390d142$var$uploadAllFiles,
    delete: $6fcb30f76390d142$var$deleteFiles
};


const $8f44b7c15b8b8e1d$var$getServerKeyFromType = (type, dataServers)=>{
    return dataServers && Object.keys(dataServers).find((key)=>{
        return dataServers[key][type];
    });
};
var $8f44b7c15b8b8e1d$export$2e2bcd8739ae039 = $8f44b7c15b8b8e1d$var$getServerKeyFromType;


const $6531da3b9e8c524a$var$parseServerKey = (serverKey, dataServers)=>{
    switch(serverKey){
        case '@default':
            return (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)('default', dataServers);
        case '@pod':
            return (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)('pod', dataServers);
        case '@authServer':
            return (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)('authServer', dataServers);
        default:
            return serverKey;
    }
};
// Return the list of servers keys in an array
// parsing keywords like @all, @default, @pod and @authServer
const $6531da3b9e8c524a$var$parseServerKeys = (serverKeys, dataServers)=>{
    if (Array.isArray(serverKeys)) {
        if (serverKeys.includes('@all')) return Object.keys(dataServers);
        else return serverKeys.map((serverKey)=>$6531da3b9e8c524a$var$parseServerKey(serverKey, dataServers));
    } else if (typeof serverKeys === 'string') {
        if (serverKeys === '@all') return Object.keys(dataServers);
        else if (serverKeys === '@remote') {
            const defaultServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)('default', dataServers);
            return Object.keys(dataServers).filter((serverKey)=>serverKey !== defaultServerKey);
        } else return [
            $6531da3b9e8c524a$var$parseServerKey(serverKeys, dataServers)
        ];
    } else throw new Error(`The parseServerKeys expect a list of server keys, or keywords`);
};
var $6531da3b9e8c524a$export$2e2bcd8739ae039 = $6531da3b9e8c524a$var$parseServerKeys;


/**
 * Return all containers matching the given types
 */ const $047a107b0d203793$var$findContainersWithTypes = (types, serverKeys, dataServers)=>{
    const matchingContainers = [];
    const parsedServerKeys = (0, $6531da3b9e8c524a$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
    Object.keys(dataServers).forEach((dataServerKey)=>{
        if (parsedServerKeys.includes(dataServerKey)) dataServers[dataServerKey].containers?.forEach((container)=>{
            if (container.types?.some((t)=>types.includes(t))) matchingContainers.push(container);
        });
    });
    return matchingContainers;
};
var $047a107b0d203793$export$2e2bcd8739ae039 = $047a107b0d203793$var$findContainersWithTypes;


const $37c161736d0d7276$var$findContainersWithURIs = (containersUris, dataServers)=>{
    const matchingContainers = [];
    Object.keys(dataServers).forEach((serverKey)=>{
        dataServers[serverKey].containers?.forEach((container)=>{
            if (container.uri && containersUris.includes(container.uri)) matchingContainers.push(container);
        });
    });
    return matchingContainers;
};
var $37c161736d0d7276$export$2e2bcd8739ae039 = $37c161736d0d7276$var$findContainersWithURIs;


const $907cbc087f6529e2$var$createMethod = (config)=>async (resourceId, params)=>{
        const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);
        const headers = new Headers();
        let containerUri;
        let serverKey;
        if (dataModel.create?.container) {
            const [container] = (0, $37c161736d0d7276$export$2e2bcd8739ae039)([
                dataModel.create?.container
            ], dataServers);
            serverKey = container.server;
            containerUri = container.uri;
        } else {
            serverKey = dataModel.create?.server || Object.keys(dataServers).find((key)=>dataServers[key].default === true);
            if (!serverKey) throw new Error('You must define a server for the creation, or a container, or a default server');
            const containers = (0, $047a107b0d203793$export$2e2bcd8739ae039)(dataModel.types, [
                serverKey
            ], dataServers);
            if (!containers || containers.length === 0) throw new Error(`No container with types ${JSON.stringify(dataModel.types)} found on server ${serverKey}`);
            if (containers.length > 1) throw new Error(`More than one container detected with types ${JSON.stringify(dataModel.types)} on server ${serverKey}`);
            containerUri = containers[0].uri;
        }
        if (params.data) {
            if (dataModel.fieldsMapping?.title) {
                const slug = Array.isArray(dataModel.fieldsMapping.title) ? dataModel.fieldsMapping.title.map((f)=>params.data[f]).join(' ') : params.data[dataModel.fieldsMapping.title];
                // Generate slug here, otherwise we may get errors with special characters
                headers.set('Slug', (0, ($parcel$interopDefault($bkNnK$speakingurl)))(slug));
            }
            // Upload files, if there are any
            const { updatedRecord: updatedRecord } = await (0, $6fcb30f76390d142$export$2e2bcd8739ae039).upload(params.data, config, serverKey);
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
            return await (0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)(resourceId, {
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
            return await (0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)(resourceId, {
                id: params.id
            });
        }
    };
var $907cbc087f6529e2$export$2e2bcd8739ae039 = $907cbc087f6529e2$var$createMethod;



const $566b5adde94810fa$var$deleteMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        await httpClient(`${params.id}`, {
            method: 'DELETE'
        });
        if (params.meta?.filesToDelete) await (0, $6fcb30f76390d142$export$2e2bcd8739ae039).delete(params.meta.filesToDelete, config);
        return {
            data: {
                id: params.id
            }
        };
    };
var $566b5adde94810fa$export$2e2bcd8739ae039 = $566b5adde94810fa$var$deleteMethod;


const $f170294dd29d8bf8$var$deleteManyMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        const ids = [];
        for (const id of params.ids)try {
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
var $f170294dd29d8bf8$export$2e2bcd8739ae039 = $f170294dd29d8bf8$var$deleteManyMethod;


const $b16131432127b07b$var$getDataServers = (config)=>()=>{
        return config.dataServers;
    };
var $b16131432127b07b$export$2e2bcd8739ae039 = $b16131432127b07b$var$getDataServers;


const $241c41c6f6021c7a$var$getDataModels = (config)=>()=>{
        return config.resources;
    };
var $241c41c6f6021c7a$export$2e2bcd8739ae039 = $241c41c6f6021c7a$var$getDataModels;




const $e6fbab1f303bdb93$var$arrayOf = (value)=>{
    // If the field is null-ish, we suppose there are no values.
    if (!value) return [];
    // Return as is.
    if (Array.isArray(value)) return value;
    // Single value is made an array.
    return [
        value
    ];
};
var $e6fbab1f303bdb93$export$2e2bcd8739ae039 = $e6fbab1f303bdb93$var$arrayOf;


const $8c999cc29c8d6a6c$var$isValidLDPContainer = (container)=>{
    const resourceType = container.type || container['@type'];
    return Array.isArray(resourceType) ? resourceType.includes('ldp:Container') : resourceType === 'ldp:Container';
};
const $8c999cc29c8d6a6c$var$isObject = (val)=>{
    return val != null && typeof val === 'object' && !Array.isArray(val);
};
const $8c999cc29c8d6a6c$var$fetchContainers = async (containers, params, { httpClient: httpClient, jsonContext: jsonContext })=>{
    const fetchPromises = containers.map((container)=>httpClient(container.uri).then(async ({ json: json })=>{
            const jsonResponse = json;
            // If container's context is different, compact it to have an uniform result
            // TODO deep compare if the context is an object
            if (jsonResponse['@context'] !== jsonContext) return (0, ($parcel$interopDefault($bkNnK$jsonld))).compact(jsonResponse, jsonContext);
            return jsonResponse;
        }).then((json)=>{
            if (!$8c999cc29c8d6a6c$var$isValidLDPContainer(json)) throw new Error(`${container.uri} is not a LDP container`);
            return (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(json['ldp:contains']).map((resource)=>({
                    '@context': json['@context'],
                    ...resource
                }));
        }));
    // Fetch simultaneously all containers
    const results = await Promise.all(fetchPromises);
    let resources = results.flat();
    resources = resources.map((resource)=>{
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
        const mandatoryAttributes = [
            'id'
        ];
        resources = resources.map((resource)=>{
            return Object.keys(resource).filter((key)=>predicates.includes(key) || mandatoryAttributes.includes(key)).reduce((filteredResource, key)=>{
                filteredResource[key] = resource[key];
                return filteredResource;
            }, {
                '@context': []
            });
        });
    }
    if (Object.keys(filters).filter((f)=>![
            '_predicates',
            '_servers'
        ].includes(f)).length > 0) resources = resources.filter((resource)=>{
        // Full text filtering
        if (filters.q) return Object.values(resource).some((attributeValue)=>{
            if (!$8c999cc29c8d6a6c$var$isObject(attributeValue)) {
                const arrayValues = Array.isArray(attributeValue) ? attributeValue : [
                    attributeValue
                ];
                return arrayValues.some((value)=>{
                    if (typeof value === 'string') return value.toLowerCase().normalize('NFD').includes(filters.q.toLowerCase().normalize('NFD'));
                    return false;
                });
            }
            return false;
        });
        // Attribute filtering
        const attributesFilters = Object.keys(filters).filter((f)=>![
                '_predicates',
                '_servers',
                'q'
            ].includes(f));
        return attributesFilters.every((attribute)=>{
            if (resource[attribute]) {
                const arrayValues = Array.isArray(resource[attribute]) ? resource[attribute] : [
                    resource[attribute]
                ];
                return arrayValues.some((value)=>typeof value === 'string' && value.includes(filters[attribute]));
            }
            return false;
        });
    });
    // Sorting
    if (params.sort) resources = resources.sort((a, b)=>{
        if (params.sort.order === 'ASC') return (a[params.sort.field] ?? '').localeCompare(b[params.sort.field] ?? '');
        return (b[params.sort.field] ?? '').localeCompare(a[params.sort.field] ?? '');
    });
    // Pagination
    const total = resources.length;
    if (params.pagination) resources = resources.slice((params.pagination.page - 1) * params.pagination.perPage, params.pagination.page * params.pagination.perPage);
    return {
        data: resources,
        total: total
    };
};
var $8c999cc29c8d6a6c$export$2e2bcd8739ae039 = $8c999cc29c8d6a6c$var$fetchContainers;



const $e5241bff9fc0c9d7$var$getEmbedFrame = (blankNodes)=>{
    let embedFrame = {};
    let predicates;
    if (blankNodes) {
        for (const blankNode of blankNodes){
            if (blankNode.includes('/')) predicates = blankNode.split('/').reverse();
            else predicates = [
                blankNode
            ];
            embedFrame = {
                ...embedFrame,
                ...predicates.reduce((accumulator, predicate)=>({
                        [predicate]: {
                            '@embed': '@last',
                            ...accumulator
                        }
                    }), {})
            };
        }
        return embedFrame;
    }
};
var $e5241bff9fc0c9d7$export$2e2bcd8739ae039 = $e5241bff9fc0c9d7$var$getEmbedFrame;




const $108795c3831be99f$var$getUriFromPrefix = (item, ontologies)=>{
    if (item.startsWith('http://') || item.startsWith('https://')) // Already resolved, return the URI
    return item;
    else if (item === 'a') // Special case
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


const $51d7c29cc84f802b$var$defaultToArray = (value)=>!value ? [] : Array.isArray(value) ? value : [
        value
    ];
// We need to always include the type or React-Admin will not work properly
const $51d7c29cc84f802b$var$typeQuery = (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)('s1'), (0, $bkNnK$rdfjsdatamodel.namedNode)('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), (0, $bkNnK$rdfjsdatamodel.variable)('type'));
const $51d7c29cc84f802b$var$buildBaseQuery = (predicates, ontologies)=>{
    let baseTriples;
    if (predicates) {
        baseTriples = $51d7c29cc84f802b$var$defaultToArray(predicates).map((predicate, i)=>(0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)('s1'), (0, $bkNnK$rdfjsdatamodel.namedNode)((0, $108795c3831be99f$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`)));
        return {
            construct: [
                $51d7c29cc84f802b$var$typeQuery,
                ...baseTriples
            ],
            where: [
                $51d7c29cc84f802b$var$typeQuery,
                ...baseTriples.map((triple)=>({
                        type: 'optional',
                        patterns: [
                            triple
                        ]
                    }))
            ]
        };
    }
    baseTriples = [
        (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)('s1'), (0, $bkNnK$rdfjsdatamodel.variable)('p1'), (0, $bkNnK$rdfjsdatamodel.variable)('o1'))
    ];
    return {
        construct: baseTriples,
        where: baseTriples
    };
};
var $51d7c29cc84f802b$export$2e2bcd8739ae039 = $51d7c29cc84f802b$var$buildBaseQuery;





// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const $64d4ce40c79d1509$var$extractNodes = (blankNodes)=>{
    const nodes = [];
    if (blankNodes) {
        for (const predicate of blankNodes)if (predicate.includes('/')) {
            const nodeNames = predicate.split('/');
            for(let i = 1; i <= nodeNames.length; i++)nodes.push(nodeNames.slice(0, i).join('/'));
        } else nodes.push(predicate);
    }
    return nodes;
};
const $64d4ce40c79d1509$var$generateSparqlVarName = (node)=>(0, ($parcel$interopDefault($bkNnK$cryptojsmd5)))(node);
const $64d4ce40c79d1509$var$getParentNode = (node)=>node.includes('/') && node.split('/')[0];
const $64d4ce40c79d1509$var$getPredicate = (node)=>node.includes('/') ? node.split('/')[1] : node;
const $64d4ce40c79d1509$var$buildUnionQuery = (queries)=>queries.map((q)=>{
        let triples = q.query;
        const firstTriple = queries.find((q2)=>q.parentNode === q2.node);
        if (firstTriple !== undefined) triples = triples.concat(firstTriple.query[0]);
        return {
            type: 'bgp',
            triples: triples
        };
    });
const $64d4ce40c79d1509$var$buildBlankNodesQuery = (blankNodes, baseQuery, ontologies)=>{
    const queries = [];
    const nodes = $64d4ce40c79d1509$var$extractNodes(blankNodes);
    if (nodes && ontologies && ontologies.length > 0) {
        for (const node of nodes){
            const parentNode = $64d4ce40c79d1509$var$getParentNode(node);
            const predicate = $64d4ce40c79d1509$var$getPredicate(node);
            const varName = $64d4ce40c79d1509$var$generateSparqlVarName(node);
            const parentVarName = parentNode ? $64d4ce40c79d1509$var$generateSparqlVarName(parentNode) : '1';
            const query = [
                (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`s${parentVarName}`), (0, $bkNnK$rdfjsdatamodel.namedNode)((0, $108795c3831be99f$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $bkNnK$rdfjsdatamodel.variable)(`s${varName}`)),
                (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`s${varName}`), (0, $bkNnK$rdfjsdatamodel.variable)(`p${varName}`), (0, $bkNnK$rdfjsdatamodel.variable)(`o${varName}`))
            ];
            queries.push({
                node: node,
                parentNode: parentNode,
                query: query,
                filter: '' // `FILTER(isBLANK(?s${varName})) .`
            });
        }
        return {
            construct: queries.length > 0 ? queries.map((q)=>q.query).reduce((pre, cur)=>pre.concat(cur)) : null,
            where: {
                type: 'union',
                patterns: [
                    baseQuery.where,
                    ...$64d4ce40c79d1509$var$buildUnionQuery(queries)
                ]
            }
        };
    }
    return {
        construct: '',
        where: ''
    };
};
var $64d4ce40c79d1509$export$2e2bcd8739ae039 = $64d4ce40c79d1509$var$buildBlankNodesQuery;



const $3b137d792e8838ac$var$buildAutoDetectBlankNodesQuery = (depth, baseQuery)=>{
    const construct = [
        ...baseQuery.construct
    ];
    let where = {};
    if (depth > 0) {
        const whereQueries = [];
        whereQueries.push([
            baseQuery.where
        ]);
        for(let i = 1; i <= depth; i++){
            construct.push((0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`), (0, $bkNnK$rdfjsdatamodel.variable)(`p${i + 1}`), (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`)));
            whereQueries.push([
                ...whereQueries[whereQueries.length - 1],
                {
                    type: 'filter',
                    expression: {
                        type: 'operation',
                        operator: 'isblank',
                        args: [
                            (0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`)
                        ]
                    }
                },
                (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`), (0, $bkNnK$rdfjsdatamodel.variable)(`p${i + 1}`), (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`))
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
var $3b137d792e8838ac$export$2e2bcd8739ae039 = $3b137d792e8838ac$var$buildAutoDetectBlankNodesQuery;




var $33c37185da3771a9$require$SparqlGenerator = $bkNnK$sparqljs.Generator;
const { literal: $33c37185da3771a9$var$literal, namedNode: $33c37185da3771a9$var$namedNode, triple: $33c37185da3771a9$var$triple, variable: $33c37185da3771a9$var$variable } = (0, ($parcel$interopDefault($bkNnK$rdfjsdatamodel)));
const $33c37185da3771a9$var$generator = new $33c37185da3771a9$require$SparqlGenerator({
});
const $33c37185da3771a9$var$reservedFilterKeys = [
    'q',
    'sparqlWhere',
    'blankNodes',
    'blankNodesDepth',
    '_servers',
    '_predicates'
];
const $33c37185da3771a9$var$buildSparqlQuery = ({ containersUris: containersUris, params: params, dataModel: dataModel, ontologies: ontologies })=>{
    const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
    const predicates = params.filter?._predicates || dataModel.list?.predicates;
    const blankNodesDepth = params.filter?.blankNodesDepth ?? dataModel.list?.blankNodesDepth ?? 2;
    const filter = {
        ...dataModel.list?.filter,
        ...params.filter
    };
    const baseQuery = (0, $51d7c29cc84f802b$export$2e2bcd8739ae039)(predicates, ontologies);
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
            values: containersUris.map((containerUri)=>({
                    '?containerUri': $33c37185da3771a9$var$namedNode(containerUri)
                }))
        },
        $33c37185da3771a9$var$triple($33c37185da3771a9$var$variable('containerUri'), $33c37185da3771a9$var$namedNode('http://www.w3.org/ns/ldp#contains'), $33c37185da3771a9$var$variable('s1')),
        {
            type: 'filter',
            expression: {
                type: 'operation',
                operator: 'isiri',
                args: [
                    $33c37185da3771a9$var$variable('s1')
                ]
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
            const sparqlWhere = filter.sparqlWhere && (typeof filter.sparqlWhere === 'string' || filter.sparqlWhere instanceof String) ? JSON.parse(decodeURIComponent(filter.sparqlWhere)) : filter.sparqlWhere;
            if (Object.keys(sparqlWhere).length > 0) [].concat(sparqlWhere).forEach((sw)=>{
                resourceWhere.push(sw);
            });
        }
        if (filter.q && filter.q.length > 0) resourceWhere.push({
            type: 'group',
            patterns: [
                {
                    queryType: 'SELECT',
                    variables: [
                        $33c37185da3771a9$var$variable('s1')
                    ],
                    where: [
                        $33c37185da3771a9$var$triple($33c37185da3771a9$var$variable('s1'), $33c37185da3771a9$var$variable('p1'), $33c37185da3771a9$var$variable('o1')),
                        {
                            type: 'filter',
                            expression: {
                                type: 'operation',
                                operator: 'isliteral',
                                args: [
                                    $33c37185da3771a9$var$variable('o1')
                                ]
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
                                                args: [
                                                    $33c37185da3771a9$var$variable('o1')
                                                ]
                                            }
                                        ]
                                    },
                                    $33c37185da3771a9$var$literal(filter.q.toLowerCase(), '', $33c37185da3771a9$var$namedNode('http://www.w3.org/2001/XMLSchema#string'))
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
        Object.entries(filter).forEach(([predicate, object])=>{
            if (!$33c37185da3771a9$var$reservedFilterKeys.includes(predicate)) resourceWhere.unshift($33c37185da3771a9$var$triple($33c37185da3771a9$var$variable('s1'), $33c37185da3771a9$var$namedNode((0, $108795c3831be99f$export$2e2bcd8739ae039)(predicate, ontologies)), $33c37185da3771a9$var$namedNode((0, $108795c3831be99f$export$2e2bcd8739ae039)(object, ontologies))));
        });
    }
    // Blank nodes
    const blankNodesQuery = blankNodes ? (0, $64d4ce40c79d1509$export$2e2bcd8739ae039)(blankNodes, baseQuery, ontologies) : (0, $3b137d792e8838ac$export$2e2bcd8739ae039)(blankNodesDepth, baseQuery);
    if (blankNodesQuery && blankNodesQuery.construct) {
        resourceWhere = resourceWhere.concat(blankNodesQuery.where);
        sparqlJsParams.template = sparqlJsParams.template.concat(blankNodesQuery.construct);
    } else resourceWhere.push(baseQuery.where);
    sparqlJsParams.where.push(containerWhere, resourceWhere);
    return $33c37185da3771a9$var$generator.stringify(sparqlJsParams);
};
var $33c37185da3771a9$export$2e2bcd8739ae039 = $33c37185da3771a9$var$buildSparqlQuery;


const $1e7a94d745f8597b$var$compare = (a, b)=>{
    switch(typeof a){
        case 'string':
            return a.localeCompare(b);
        case 'number':
            return a - b;
        default:
            return 0;
    }
};
const $1e7a94d745f8597b$var$fetchSparqlEndpoints = async (containers, resourceId, params, config)=>{
    const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext, ontologies: ontologies } = config;
    const dataModel = resources[resourceId];
    const serversToQuery = containers.reduce((acc, cur)=>{
        if (!acc.includes(cur.server)) acc.push(cur.server);
        return acc;
    }, []);
    const sparqlQueryPromises = serversToQuery.map((serverKey)=>new Promise((resolve, reject)=>{
            const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
            const sparqlQuery = (0, $33c37185da3771a9$export$2e2bcd8739ae039)({
                containersUris: containers.filter((c)=>c.server === serverKey).map((c)=>c.uri),
                params: params,
                dataModel: dataModel,
                ontologies: ontologies
            });
            httpClient(dataServers[serverKey].sparqlEndpoint, {
                method: 'POST',
                body: sparqlQuery
            }).then(({ json: json })=>{
                // If we declared the blank nodes to dereference, embed only those blank nodes
                // This solve problems which can occur when same-type resources are embedded in other resources
                // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
                const frame = blankNodes && dataModel.list?.explicitEmbedOnFraming !== false ? {
                    '@context': jsonContext,
                    '@type': dataModel.types,
                    '@embed': '@never',
                    ...(0, $e5241bff9fc0c9d7$export$2e2bcd8739ae039)(blankNodes)
                } : {
                    '@context': jsonContext,
                    '@type': dataModel.types
                };
                // omitGraph option force results to be in a @graph, even if we have a single result
                return (0, ($parcel$interopDefault($bkNnK$jsonld))).frame(json, frame, {
                    omitGraph: false
                });
            }).then((compactJson)=>{
                if (compactJson['@id']) {
                    const { '@context': context, ...rest } = compactJson;
                    compactJson = {
                        '@context': context,
                        '@graph': [
                            rest
                        ]
                    };
                }
                resolve(compactJson['@graph']?.map((resource)=>({
                        '@context': compactJson['@context'],
                        ...resource
                    })) || []);
            }).catch((e)=>reject(e));
        }));
    // Run simultaneous SPARQL queries
    let results = await Promise.all(sparqlQueryPromises);
    if (results.length === 0) return {
        data: [],
        total: 0
    };
    // Merge all results in one array
    results = [].concat(...results);
    // Add id in addition to @id, as this is what React-Admin expects
    let returnData = results.map((item)=>{
        item.id = item.id || item['@id'];
        return item;
    });
    // TODO sort and paginate the results in the SPARQL query to improve performances
    if (params.sort) returnData = returnData.sort((a, b)=>{
        if (a[params.sort.field] !== undefined && b[params.sort.field] !== undefined) {
            if (params.sort.order === 'ASC') return $1e7a94d745f8597b$var$compare(a[params.sort.field], b[params.sort.field]);
            return $1e7a94d745f8597b$var$compare(b[params.sort.field], a[params.sort.field]);
        }
        return 0;
    });
    if (params.pagination) returnData = returnData.slice((params.pagination.page - 1) * params.pagination.perPage, params.pagination.page * params.pagination.perPage);
    return {
        data: returnData,
        total: results.length
    };
};
var $1e7a94d745f8597b$export$2e2bcd8739ae039 = $1e7a94d745f8597b$var$fetchSparqlEndpoints;




/**
 * Return all containers matching the given shape tree
 */ const $1d94774735aa9ea2$var$findContainersWithShapeTree = (shapeTreeUri, serverKeys, dataServers)=>{
    const matchingContainers = [];
    const parsedServerKeys = (0, $6531da3b9e8c524a$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
    Object.keys(dataServers).forEach((dataServerKey)=>{
        if (parsedServerKeys.includes(dataServerKey)) dataServers[dataServerKey].containers?.forEach((container)=>{
            if (container.shapeTreeUri === shapeTreeUri) matchingContainers.push(container);
        });
    });
    return matchingContainers;
};
var $1d94774735aa9ea2$export$2e2bcd8739ae039 = $1d94774735aa9ea2$var$findContainersWithShapeTree;



const $95cbc03f25caf72a$var$getListMethod = (config)=>async (resourceId, params)=>{
        const { dataServers: dataServers, resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
        let containers = [];
        if (!params.filter?._servers && dataModel.list?.containers) {
            if (!Array.isArray(dataModel.list?.containers)) throw new Error(`The list.containers property of ${resourceId} dataModel must be of type array`);
            // If containers are set explicitly, use them
            containers = (0, $37c161736d0d7276$export$2e2bcd8739ae039)(dataModel.list.containers, dataServers);
        } else if (dataModel.shapeTreeUri) containers = (0, $1d94774735aa9ea2$export$2e2bcd8739ae039)(dataModel.shapeTreeUri, params?.filter?._servers || dataModel.list?.servers, dataServers);
        else // Otherwise find the container URIs on the given servers (either in the filter or the data model)
        containers = (0, $047a107b0d203793$export$2e2bcd8739ae039)((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(dataModel.types), params?.filter?._servers || dataModel.list?.servers, dataServers);
        if (dataModel.list?.fetchContainer) return (0, $8c999cc29c8d6a6c$export$2e2bcd8739ae039)(containers, params, config);
        else return (0, $1e7a94d745f8597b$export$2e2bcd8739ae039)(containers, resourceId, params, config);
    };
var $95cbc03f25caf72a$export$2e2bcd8739ae039 = $95cbc03f25caf72a$var$getListMethod;



const $e296494b4f6a4f89$var$getManyMethod = (config)=>async (resourceId, params)=>{
        const { returnFailedResources: returnFailedResources } = config;
        let returnData = await Promise.all(params.ids.map((id)=>(0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)(resourceId, {
                id: typeof id === 'object' ? id['@id'] : id
            }).then(({ data: data })=>data).catch(()=>{
                // Catch if one resource fails to load
                // Otherwise no references will be show if only one is missing
                // See https://github.com/marmelab/react-admin/issues/5190
                if (returnFailedResources) return {
                    id: id,
                    _error: true
                };
            // Returning nothing
            })));
        // We don't want undefined results to appear in the results as it will break with react-admin
        returnData = returnData.filter((e)=>e);
        return {
            data: returnData
        };
    };
var $e296494b4f6a4f89$export$2e2bcd8739ae039 = $e296494b4f6a4f89$var$getManyMethod;



const $e5e279a608b8e6b1$var$getManyReferenceMethod = (config)=>async (resourceId, params)=>{
        params.filter = {
            ...params.filter,
            [params.target]: params.id
        };
        delete params.target;
        return await (0, $95cbc03f25caf72a$export$2e2bcd8739ae039)(config)(resourceId, params);
    };
var $e5e279a608b8e6b1$export$2e2bcd8739ae039 = $e5e279a608b8e6b1$var$getManyReferenceMethod;




const $fda69bf2752eb49a$var$generator = new (0, $bkNnK$sparqljs.Generator)();
const $fda69bf2752eb49a$var$patchMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        const sparqlUpdate = {
            type: 'update',
            prefixes: {},
            updates: []
        };
        if (params.triplesToAdd) sparqlUpdate.updates.push({
            updateType: 'insert',
            insert: [
                {
                    type: 'bgp',
                    triples: params.triplesToAdd
                }
            ]
        });
        if (params.triplesToRemove) sparqlUpdate.updates.push({
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
const $59a07b932dae8600$var$getServerKeyFromUri = (uri, dataServers)=>{
    if (!uri) throw Error(`No URI provided to getServerKeyFromUri`);
    return dataServers && Object.keys(dataServers).find((key)=>{
        if (dataServers[key].pod) // The baseUrl ends with /data so remove this part to match with the webId and webId-related URLs (/inbox, /outbox...)
        return dataServers[key].baseUrl && uri.startsWith(dataServers[key].baseUrl.replace('/data', ''));
        return uri.startsWith(dataServers[key].baseUrl);
    });
};
var $59a07b932dae8600$export$2e2bcd8739ae039 = $59a07b932dae8600$var$getServerKeyFromUri;


const $ceaafb56f75454f0$var$updateMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient, jsonContext: jsonContext, dataServers: dataServers } = config;
        const serverKey = (0, $59a07b932dae8600$export$2e2bcd8739ae039)(params.id, dataServers);
        // Upload files, if there are any
        const { updatedRecord: updatedRecord, filesToDelete: filesToDelete } = await (0, $6fcb30f76390d142$export$2e2bcd8739ae039).upload(params.data, config, serverKey);
        params.data = updatedRecord;
        await httpClient(`${params.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                '@context': jsonContext,
                ...params.data
            })
        });
        // Delete files only if update is successful
        await (0, $6fcb30f76390d142$export$2e2bcd8739ae039).delete(filesToDelete, config);
        return {
            data: params.data
        };
    };
var $ceaafb56f75454f0$export$2e2bcd8739ae039 = $ceaafb56f75454f0$var$updateMethod;





/*
 * HTTP client used by all calls in data provider and auth provider
 * Do proxy calls if a proxy endpoint is available and the server is different from the auth server
 */ const $341dff85fe619d85$var$httpClient = (dataServers)=>(url, options = {})=>{
        if (!url) throw new Error(`No URL provided on httpClient call`);
        const authServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)('authServer', dataServers);
        const serverKey = (0, $59a07b932dae8600$export$2e2bcd8739ae039)(url, dataServers);
        const useProxy = serverKey !== authServerKey && dataServers[authServerKey]?.proxyUrl && dataServers[serverKey]?.noProxy !== true;
        if (!options.headers) options.headers = new Headers();
        switch(options.method){
            case 'POST':
            case 'PATCH':
            case 'PUT':
                if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
                if (!options.headers.has('Content-Type')) options.headers.set('Content-Type', 'application/ld+json');
                break;
            case 'DELETE':
                break;
            case 'GET':
            default:
                if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
                break;
        }
        if (useProxy) {
            const formData = new FormData();
            formData.append('id', url);
            formData.append('method', options.method || 'GET');
            formData.append('headers', JSON.stringify(Object.fromEntries(options.headers.entries())));
            if (options.body) {
                if (options.body instanceof File) formData.append('body', options.body, options.body.name);
                else formData.append('body', options.body);
            }
            // Post to proxy endpoint with multipart/form-data format
            return (0, $bkNnK$reactadmin.fetchUtils).fetchJson(dataServers[authServerKey].proxyUrl, {
                method: 'POST',
                headers: new Headers({
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }),
                body: formData
            });
        }
        // Add token if the server is the same as the auth server
        if (serverKey === authServerKey) {
            const token = localStorage.getItem('token');
            if (token) options.headers.set('Authorization', `Bearer ${token}`);
        }
        return (0, $bkNnK$reactadmin.fetchUtils).fetchJson(url, options);
    };
var $341dff85fe619d85$export$2e2bcd8739ae039 = $341dff85fe619d85$var$httpClient;







const $9ab033d1ec46b5da$var$isURI = (value)=>(typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));
const $9ab033d1ec46b5da$var$expandTypes = async (types, context)=>{
    // If types are already full URIs, return them immediately
    if (types.every((type)=>$9ab033d1ec46b5da$var$isURI(type))) return types;
    const result = await (0, ($parcel$interopDefault($bkNnK$jsonld))).expand({
        '@context': context,
        '@type': types
    });
    const expandedTypes = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(result[0]['@type']);
    if (!expandedTypes.every((type)=>$9ab033d1ec46b5da$var$isURI(type))) throw new Error(`
      Could not expand all types (${expandedTypes.join(', ')}).
      Is an ontology missing or not registered yet on the local context ?
    `);
    return expandedTypes;
};
var $9ab033d1ec46b5da$export$2e2bcd8739ae039 = $9ab033d1ec46b5da$var$expandTypes;




const $058bb6151d120fba$var$getTypesFromShapeTree = async (shapeTreeUri)=>{
    let { json: shapeTree } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(shapeTreeUri, {
        headers: new Headers({
            Accept: 'application/ld+json'
        })
    });
    shapeTree = await (0, ($parcel$interopDefault($bkNnK$jsonld))).compact(shapeTree, {
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
        return shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map((node)=>node?.['@id']) || [];
    } else return [];
};
var $058bb6151d120fba$export$2e2bcd8739ae039 = $058bb6151d120fba$var$getTypesFromShapeTree;


const $5e24772571dd1677$var$normalizeConfig = async (config)=>{
    const newConfig = {
        ...config
    };
    // Add server and uri key to servers' containers
    for (const serverKey of Object.keys(newConfig.dataServers))if (newConfig.dataServers[serverKey].containers) newConfig.dataServers[serverKey].containers = await Promise.all(newConfig.dataServers[serverKey].containers?.map(async (container)=>{
        return {
            ...container,
            types: container.types && await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(container.types, config.jsonContext),
            server: serverKey,
            uri: (0, ($parcel$interopDefault($bkNnK$urljoin)))(config.dataServers[serverKey].baseUrl, container.path)
        };
    }));
    // Expand types in data models
    for (const resourceId of Object.keys(newConfig.resources)){
        if (!newConfig.resources[resourceId].types && newConfig.resources[resourceId].shapeTreeUri) newConfig.resources[resourceId].types = await (0, $058bb6151d120fba$export$2e2bcd8739ae039)(newConfig.resources[resourceId].shapeTreeUri);
        newConfig.resources[resourceId].types = await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(newConfig.resources[resourceId].types), config.jsonContext);
    }
    return newConfig;
};
var $5e24772571dd1677$export$2e2bcd8739ae039 = $5e24772571dd1677$var$normalizeConfig;




const $fcf4eee3b18e8350$var$isURL = (value)=>(typeof value === 'string' || value instanceof String) && value.startsWith('http');
const $fcf4eee3b18e8350$var$getOntologiesFromContextJson = (contextJson)=>{
    const ontologies = {};
    for (const [key, value] of Object.entries(contextJson))if ($fcf4eee3b18e8350$var$isURL(value)) ontologies[key] = value;
    return ontologies;
};
const $fcf4eee3b18e8350$var$getOntologiesFromContextUrl = async (contextUrl)=>{
    const { json: json } = await (0, $bkNnK$reactadmin.fetchUtils).fetchJson(contextUrl, {
        headers: new Headers({
            Accept: 'application/ld+json'
        })
    });
    return $fcf4eee3b18e8350$var$getOntologiesFromContextJson(json['@context']);
};
const $fcf4eee3b18e8350$var$getOntologiesFromContext = async (context)=>{
    let ontologies = {};
    if (Array.isArray(context)) for (const contextUrl of context)ontologies = {
        ...ontologies,
        ...await $fcf4eee3b18e8350$var$getOntologiesFromContextUrl(contextUrl)
    };
    else if (typeof context === 'string') ontologies = await $fcf4eee3b18e8350$var$getOntologiesFromContextUrl(context);
    else ontologies = $fcf4eee3b18e8350$var$getOntologiesFromContextJson(context);
    return ontologies;
};
var $fcf4eee3b18e8350$export$2e2bcd8739ae039 = $fcf4eee3b18e8350$var$getOntologiesFromContext;


/** @type {(originalConfig: Configuration) => SemanticDataProvider} */ const $7f6a16d0025dc83a$var$dataProvider = (originalConfig)=>{
    // Keep in memory for refresh
    let config = {
        ...originalConfig
    };
    const prepareConfig = async ()=>{
        config.dataServers ??= {};
        // Configure httpClient with initial data servers, so that plugins may use it
        config.httpClient = (0, $341dff85fe619d85$export$2e2bcd8739ae039)(config.dataServers);
        // Useful for debugging.
        document.httpClient = config.httpClient;
        for (const plugin of config.plugins)if (plugin.transformConfig) config = await plugin.transformConfig(config);
        // Configure again httpClient with possibly updated data servers
        config.httpClient = (0, $341dff85fe619d85$export$2e2bcd8739ae039)(config.dataServers);
        if (!config.ontologies && config.jsonContext) config.ontologies = await (0, $fcf4eee3b18e8350$export$2e2bcd8739ae039)(config.jsonContext);
        else if (!config.jsonContext && config.ontologies) config.jsonContext = config.ontologies;
        else if (!config.jsonContext && !config.ontologies) throw new Error(`Either the JSON context or the ontologies must be set`);
        if (!config.returnFailedResources) config.returnFailedResources = false;
        config = await (0, $5e24772571dd1677$export$2e2bcd8739ae039)(config);
        console.log('Config after plugins', config);
    };
    // Immediately call the preload plugins
    const prepareConfigPromise = prepareConfig();
    const waitForPrepareConfig = (method)=>async (...arg)=>{
            await prepareConfigPromise; // Return immediately if plugins have already been loaded
            return method(config)(...arg);
        };
    return {
        getList: waitForPrepareConfig((0, $95cbc03f25caf72a$export$2e2bcd8739ae039)),
        getMany: waitForPrepareConfig((0, $e296494b4f6a4f89$export$2e2bcd8739ae039)),
        getManyReference: waitForPrepareConfig((0, $e5e279a608b8e6b1$export$2e2bcd8739ae039)),
        getOne: waitForPrepareConfig((0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)),
        create: waitForPrepareConfig((0, $907cbc087f6529e2$export$2e2bcd8739ae039)),
        update: waitForPrepareConfig((0, $ceaafb56f75454f0$export$2e2bcd8739ae039)),
        updateMany: ()=>{
            throw new Error('updateMany is not implemented yet');
        },
        delete: waitForPrepareConfig((0, $566b5adde94810fa$export$2e2bcd8739ae039)),
        deleteMany: waitForPrepareConfig((0, $f170294dd29d8bf8$export$2e2bcd8739ae039)),
        // Custom methods
        patch: waitForPrepareConfig((0, $fda69bf2752eb49a$export$2e2bcd8739ae039)),
        getDataModels: waitForPrepareConfig((0, $241c41c6f6021c7a$export$2e2bcd8739ae039)),
        getDataServers: waitForPrepareConfig((0, $b16131432127b07b$export$2e2bcd8739ae039)),
        getLocalDataServers: (0, $b16131432127b07b$export$2e2bcd8739ae039)(originalConfig),
        fetch: waitForPrepareConfig((c)=>(0, $341dff85fe619d85$export$2e2bcd8739ae039)(c.dataServers)),
        uploadFile: waitForPrepareConfig((c)=>(rawFile)=>(0, $6fcb30f76390d142$export$a5575dbeeffdad98)(rawFile, c)),
        expandTypes: waitForPrepareConfig((c)=>(types)=>(0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(types, c.jsonContext)),
        getConfig: waitForPrepareConfig((c)=>()=>c),
        refreshConfig: async ()=>{
            config = {
                ...originalConfig
            };
            await prepareConfig();
            return config;
        }
    };
};
var $7f6a16d0025dc83a$export$2e2bcd8739ae039 = $7f6a16d0025dc83a$var$dataProvider;





const $8c4c0f0b55649ce6$var$getPrefixFromUri = (uri, ontologies)=>{
    for (const [prefix, namespace] of Object.entries(ontologies)){
        if (uri.startsWith(namespace)) return uri.replace(namespace, `${prefix}:`);
    }
    return uri;
};
var $8c4c0f0b55649ce6$export$2e2bcd8739ae039 = $8c4c0f0b55649ce6$var$getPrefixFromUri;




const $89358cee13a17a31$var$configureUserStorage = ()=>({
        transformConfig: async (config)=>{
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                const payload = (0, ($parcel$interopDefault($bkNnK$jwtdecode)))(token);
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                if (user) {
                    const newConfig = {
                        ...config
                    };
                    newConfig.dataServers.user = {
                        pod: true,
                        default: true,
                        authServer: true,
                        baseUrl: user['pim:storage'] || (0, ($parcel$interopDefault($bkNnK$urljoin)))(webId, 'data'),
                        sparqlEndpoint: user.endpoints?.['void:sparqlEndpoint'] || (0, ($parcel$interopDefault($bkNnK$urljoin)))(webId, 'sparql'),
                        proxyUrl: user.endpoints?.proxyUrl,
                        containers: []
                    };
                    if (!newConfig.jsonContext) newConfig.jsonContext = [
                        'https://www.w3.org/ns/activitystreams',
                        (0, ($parcel$interopDefault($bkNnK$urljoin)))(new URL(webId).origin, '/.well-known/context.jsonld')
                    ];
                    return newConfig;
                }
            }
            // Nothing to change
            return config;
        }
    });
var $89358cee13a17a31$export$2e2bcd8739ae039 = $89358cee13a17a31$var$configureUserStorage;







const $37dc42f6e1c3b4af$var$getContainerFromDataRegistration = async (dataRegistrationUri, config)=>{
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
    shapeTree = await (0, ($parcel$interopDefault($bkNnK$jsonld))).compact(shapeTree, {
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
    const { baseUrl: baseUrl } = config.dataServers.user;
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
        container.types = shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map((node)=>node?.['@id']);
    }
    return container;
};
var $37dc42f6e1c3b4af$export$2e2bcd8739ae039 = $37dc42f6e1c3b4af$var$getContainerFromDataRegistration;


/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */ const $c512de108ef5d674$var$fetchAppRegistration = ()=>({
        transformConfig: async (config)=>{
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                const payload = (0, ($parcel$interopDefault($bkNnK$jwtdecode)))(token);
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                const authAgentUri = user['interop:hasAuthorizationAgent'];
                if (authAgentUri) {
                    // Find if an application registration is linked to this user
                    // See https://solid.github.io/data-interoperability-panel/specification/#agent-registration-discovery
                    const { headers: headers } = await config.httpClient(authAgentUri);
                    if (headers.has('Link')) {
                        const linkHeader = (0, ($parcel$interopDefault($bkNnK$httplinkheader))).parse(headers.get('Link'));
                        const registeredAgentLinkHeader = linkHeader.rel('http://www.w3.org/ns/solid/interop#registeredAgent');
                        if (registeredAgentLinkHeader.length > 0) {
                            const appRegistrationUri = registeredAgentLinkHeader[0].anchor;
                            const { json: appRegistration } = await config.httpClient(appRegistrationUri);
                            const newConfig = {
                                ...config
                            };
                            // Load data grants concurrently to improve performances
                            const results = await Promise.all((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(appRegistration['interop:hasAccessGrant']).map(async (accessGrantUri)=>{
                                const { json: accessGrant } = await config.httpClient(accessGrantUri);
                                return Promise.all((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(accessGrant['interop:hasDataGrant']).map(async (dataGrantUri)=>{
                                    const { json: dataGrant } = await config.httpClient(dataGrantUri);
                                    return (0, $37dc42f6e1c3b4af$export$2e2bcd8739ae039)(dataGrant['interop:hasDataRegistration'], config);
                                }));
                            }));
                            newConfig.dataServers.user.containers = results.flat();
                            return newConfig;
                        }
                    }
                }
            }
            return config;
        }
    });
var $c512de108ef5d674$export$2e2bcd8739ae039 = $c512de108ef5d674$var$fetchAppRegistration;




const $cd772adda3024172$var$fetchDataRegistry = ()=>({
        transformConfig: async (config)=>{
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                if (!config.dataServers.user) throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);
                const payload = (0, ($parcel$interopDefault($bkNnK$jwtdecode)))(token);
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                const { json: registrySet } = await config.httpClient(user['interop:hasRegistrySet']);
                const { json: dataRegistry } = await config.httpClient(registrySet['interop:hasDataRegistry']);
                if (dataRegistry['interop:hasDataRegistration']) {
                    const results = await Promise.all(dataRegistry['interop:hasDataRegistration'].map((dataRegistrationUri)=>{
                        return (0, $37dc42f6e1c3b4af$export$2e2bcd8739ae039)(dataRegistrationUri, config);
                    }));
                    const newConfig = {
                        ...config
                    };
                    newConfig.dataServers.user.containers?.push(...results.flat());
                    return newConfig;
                }
            }
            // Nothing to change
            return config;
        }
    });
var $cd772adda3024172$export$2e2bcd8739ae039 = $cd772adda3024172$var$fetchDataRegistry;






const $69d4da9beaa62ac6$var$fetchTypeIndexes = ()=>({
        transformConfig: async (config)=>{
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                if (!config.dataServers.user) throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);
                const payload = (0, ($parcel$interopDefault($bkNnK$jwtdecode)))(token);
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                const typeRegistrations = {
                    public: [],
                    private: []
                };
                if (user['solid:publicTypeIndex']) {
                    const { json: publicTypeIndex } = await config.httpClient(user['solid:publicTypeIndex']);
                    if (publicTypeIndex) typeRegistrations.public = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(publicTypeIndex['solid:hasTypeRegistration']);
                }
                if (user['pim:preferencesFile']) {
                    const { json: preferencesFile } = await config.httpClient(user['pim:preferencesFile']);
                    if (preferencesFile?.['solid:privateTypeIndex']) {
                        const { json: privateTypeIndex } = await config.httpClient(preferencesFile['solid:privateTypeIndex']);
                        typeRegistrations.private = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(privateTypeIndex['solid:hasTypeRegistration']);
                    }
                }
                if (typeRegistrations.public.length > 0 || typeRegistrations.private.length > 0) {
                    const newConfig = {
                        ...config
                    };
                    for (const mode of Object.keys(typeRegistrations))for (const typeRegistration of typeRegistrations[mode]){
                        const types = (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(typeRegistration['solid:forClass']);
                        const container = {
                            label: {
                                en: (0, $bkNnK$changecase.capitalCase)(types[0].split(':')[1], {
                                    separateNumbers: true
                                })
                            },
                            path: typeRegistration['solid:instanceContainer'].replace(newConfig.dataServers.user.baseUrl, ''),
                            types: await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)(types, user['@context']),
                            private: mode === 'private'
                        };
                        const containerIndex = newConfig.dataServers.user.containers.findIndex((c)=>c.path === container.path);
                        if (containerIndex !== -1) // If a container with this URI already exist, add type registration information if they are not set
                        newConfig.dataServers.user.containers[containerIndex] = {
                            ...container,
                            ...newConfig.dataServers.user.containers[containerIndex]
                        };
                        else newConfig.dataServers.user.containers.push(container);
                    }
                    return newConfig;
                }
            }
            return config;
        }
    });
var $69d4da9beaa62ac6$export$2e2bcd8739ae039 = $69d4da9beaa62ac6$var$fetchTypeIndexes;




const $1395e306228d41f2$var$fetchVoidEndpoints = ()=>({
        transformConfig: async (config)=>{
            let results = [];
            try {
                results = await Promise.all(Object.entries(config.dataServers).filter(([_, server])=>server.pod !== true && server.void !== false).map(async ([key, server])=>config.httpClient(new URL('/.well-known/void', server.baseUrl).toString()).then((result)=>({
                            key: key,
                            context: result.json?.['@context'],
                            datasets: result.json?.['@graph']
                        })).catch((e)=>{
                        if (e.status === 404 || e.status === 401 || e.status === 500) return {
                            key: key,
                            error: e.message
                        };
                        throw e;
                    })));
            } catch (e) {
            // Do not throw error if no endpoint found
            }
            results = results.filter((result)=>result.datasets);
            if (results.length > 0) {
                const newConfig = {
                    ...config
                };
                for (const result of results){
                    // Ignore unfetchable endpoints
                    if (result.datasets) for (const dataset of result.datasets){
                        newConfig.dataServers[result.key].name ??= dataset['dc:title'];
                        newConfig.dataServers[result.key].description ??= dataset['dc:description'];
                        newConfig.dataServers[result.key].sparqlEndpoint ??= dataset['void:sparqlEndpoint'];
                        newConfig.dataServers[result.key].containers ??= [];
                        for (const partition of (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(dataset['void:classPartition']))for (const type of (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(partition['void:class'])){
                            const path = partition['void:uriSpace'].replace(dataset['void:uriSpace'], '/');
                            const expandedTypes = await (0, $9ab033d1ec46b5da$export$2e2bcd8739ae039)([
                                type
                            ], result.context);
                            const containerIndex = newConfig.dataServers[result.key].containers.findIndex((c)=>c.path === path);
                            if (containerIndex !== -1) {
                                // If a container with this path already exist, merge types
                                const mergedTypes = [
                                    ...newConfig.dataServers[result.key].containers[containerIndex].types,
                                    ...expandedTypes
                                ].filter((v, i, a)=>a.indexOf(v) === i);
                                newConfig.dataServers[result.key].containers[containerIndex] = {
                                    ...newConfig.dataServers[result.key].containers[containerIndex],
                                    types: mergedTypes,
                                    binaryResources: mergedTypes.includes('http://semapps.org/ns/core#File')
                                };
                            } else newConfig.dataServers[result.key].containers.push({
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





const $9def35f4441a9bb2$var$useDataProviderConfig = ()=>{
    const dataProvider = (0, $bkNnK$reactadmin.useDataProvider)();
    const [config, setConfig] = (0, $bkNnK$react.useState)();
    const [isLoading, setIsLoading] = (0, $bkNnK$react.useState)(false);
    (0, $bkNnK$react.useEffect)(()=>{
        if (!isLoading && !config) {
            setIsLoading(true);
            dataProvider.getConfig().then((c)=>{
                setConfig(c);
                setIsLoading(false);
            });
        }
    }, [
        dataProvider,
        setConfig,
        config,
        setIsLoading,
        isLoading
    ]);
    return config;
};
var $9def35f4441a9bb2$export$2e2bcd8739ae039 = $9def35f4441a9bb2$var$useDataProviderConfig;



const $013953e307d438b1$var$compactPredicate = async (predicate, context)=>{
    const result = await (0, ($parcel$interopDefault($bkNnK$jsonld))).compact({
        [predicate]: ''
    }, context);
    return Object.keys(result).find((key)=>key !== '@context');
};
var $013953e307d438b1$export$2e2bcd8739ae039 = $013953e307d438b1$var$compactPredicate;


const $9d33c8835e67bede$var$useCompactPredicate = (predicate, context)=>{
    const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
    const [result, setResult] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        if (config && predicate) (0, $013953e307d438b1$export$2e2bcd8739ae039)(predicate, context || config.jsonContext).then((r)=>{
            setResult(r);
        });
    }, [
        predicate,
        setResult,
        config,
        context
    ]);
    return result;
};
var $9d33c8835e67bede$export$2e2bcd8739ae039 = $9d33c8835e67bede$var$useCompactPredicate;




const $20621bc841a5205a$var$useDataModels = ()=>{
    const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
    return config?.resources;
};
var $20621bc841a5205a$export$2e2bcd8739ae039 = $20621bc841a5205a$var$useDataModels;



const $c9933a88e2acc4da$var$useDataServers = ()=>{
    const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
    return config?.dataServers;
};
var $c9933a88e2acc4da$export$2e2bcd8739ae039 = $c9933a88e2acc4da$var$useDataServers;





const $3158e0dc13ffffaa$var$useContainers = (resourceId, serverKeys)=>{
    const dataModels = (0, $20621bc841a5205a$export$2e2bcd8739ae039)();
    const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
    const [containers, setContainers] = (0, $bkNnK$react.useState)([]);
    // Warning: if serverKeys change, the containers list will not be updated (otherwise we have an infinite re-render loop)
    (0, $bkNnK$react.useEffect)(()=>{
        if (dataServers && dataModels) {
            if (resourceId) {
                const dataModel = dataModels[resourceId];
                setContainers((0, $047a107b0d203793$export$2e2bcd8739ae039)((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(dataModel.types), serverKeys, dataServers));
            } else {
                const parsedServerKeys = (0, $6531da3b9e8c524a$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
                setContainers(parsedServerKeys.map((serverKey)=>dataServers[serverKey].containers).flat());
            }
        }
    }, [
        dataModels,
        dataServers,
        setContainers,
        resourceId
    ]);
    return containers;
};
var $3158e0dc13ffffaa$export$2e2bcd8739ae039 = $3158e0dc13ffffaa$var$useContainers;







const $21fb109d85e9c16c$var$useContainersByTypes = (types)=>{
    const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
    const dataProvider = (0, $bkNnK$reactadmin.useDataProvider)();
    const [containers, setContainers] = (0, $bkNnK$react.useState)([]);
    (0, $bkNnK$react.useEffect)(()=>{
        if (dataServers && types) dataProvider.expandTypes((0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(types)).then((expandedTypes)=>{
            setContainers((0, $047a107b0d203793$export$2e2bcd8739ae039)(expandedTypes, '@all', dataServers));
        }).catch(()=>{
        // Ignore errors
        });
    }, [
        dataServers,
        dataProvider,
        setContainers,
        types
    ]);
    return containers;
};
var $21fb109d85e9c16c$export$2e2bcd8739ae039 = $21fb109d85e9c16c$var$useContainersByTypes;




const $d3746ce11bc56f3b$var$useContainerByUri = (containerUri)=>{
    const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
    const [container, setContainer] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        if (dataServers && containerUri) Object.keys(dataServers).forEach((serverKey)=>{
            dataServers[serverKey].containers?.forEach((c)=>{
                if (c.uri === containerUri) setContainer(c);
            });
        });
    }, [
        dataServers,
        setContainer,
        containerUri
    ]);
    return container;
};
var $d3746ce11bc56f3b$export$2e2bcd8739ae039 = $d3746ce11bc56f3b$var$useContainerByUri;





const $ff3623bf1421ebcc$var$findCreateContainerWithTypes = (types, createServerKey, dataServers)=>{
    if (!dataServers[createServerKey].containers) throw new Error(`Data server ${createServerKey} has no declared containers`);
    const matchingContainers = dataServers[createServerKey].containers.filter((container)=>container.types?.some((t)=>types.includes(t)));
    if (matchingContainers.length === 0) throw new Error(`No container found matching with types ${JSON.stringify(types)}. You can set explicitly the create.container property of the resource.`);
    else if (matchingContainers.length > 1) throw new Error(`More than one container found matching with types ${JSON.stringify(types)}. You must set the create.server or create.container property for the resource.`);
    return matchingContainers[0].uri;
};
var $ff3623bf1421ebcc$export$2e2bcd8739ae039 = $ff3623bf1421ebcc$var$findCreateContainerWithTypes;




const $32d32215b4e4729f$var$useGetCreateContainerUri = ()=>{
    const dataModels = (0, $20621bc841a5205a$export$2e2bcd8739ae039)();
    const dataServers = (0, $c9933a88e2acc4da$export$2e2bcd8739ae039)();
    const getCreateContainerUri = (0, $bkNnK$react.useCallback)((resourceId)=>{
        if (!dataModels || !dataServers || !dataModels[resourceId]) return undefined;
        const dataModel = dataModels[resourceId];
        if (dataModel.create?.container) return dataModel.create.container;
        else if (dataModel.create?.server) return (0, $ff3623bf1421ebcc$export$2e2bcd8739ae039)(dataModel.types, dataModel.create.server, dataServers);
        else {
            const defaultServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)('default', dataServers);
            if (!defaultServerKey) throw new Error(`No default dataServer found. You can set explicitly one setting the "default" attribute to true`);
            return (0, $ff3623bf1421ebcc$export$2e2bcd8739ae039)(dataModel.types, defaultServerKey, dataServers);
        }
    }, [
        dataModels,
        dataServers
    ]);
    return getCreateContainerUri;
};
var $32d32215b4e4729f$export$2e2bcd8739ae039 = $32d32215b4e4729f$var$useGetCreateContainerUri;


const $298b78bb7d4a3358$var$useCreateContainerUri = (resourceId)=>{
    const getCreateContainerUri = (0, $32d32215b4e4729f$export$2e2bcd8739ae039)();
    const createContainerUri = (0, $bkNnK$react.useMemo)(()=>getCreateContainerUri(resourceId), [
        getCreateContainerUri,
        resourceId
    ]);
    return createContainerUri;
};
var $298b78bb7d4a3358$export$2e2bcd8739ae039 = $298b78bb7d4a3358$var$useCreateContainerUri;



const $63a32f1a35c6f80e$var$useDataModel = (resourceId)=>{
    const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
    return config?.resources[resourceId];
};
var $63a32f1a35c6f80e$export$2e2bcd8739ae039 = $63a32f1a35c6f80e$var$useDataModel;








const $85e9a897c6d7c14a$var$compute = (externalLinks, record)=>typeof externalLinks === 'function' ? externalLinks(record) : externalLinks;
const $85e9a897c6d7c14a$var$isURL = (url)=>typeof url === 'string' && url.startsWith('http');
const $85e9a897c6d7c14a$var$useGetExternalLink = (componentExternalLinks)=>{
    // Since the externalLinks config is defined only locally, we don't need to wait for VOID endpoints fetching
    const dataProvider = (0, $bkNnK$react.useContext)((0, $bkNnK$reactadmin.DataProviderContext));
    const dataServers = dataProvider.getLocalDataServers();
    const serversExternalLinks = (0, $bkNnK$react.useMemo)(()=>{
        if (dataServers) return Object.fromEntries(Object.values(dataServers).map((server)=>{
            // If externalLinks is not defined in the data server, use external links for non-default servers
            const externalLinks = server.externalLinks !== undefined ? server.externalLinks : !server.default;
            return [
                server.baseUrl,
                externalLinks
            ];
        }));
    }, [
        dataServers
    ]);
    return (0, $bkNnK$react.useCallback)((record)=>{
        const computedComponentExternalLinks = $85e9a897c6d7c14a$var$compute(componentExternalLinks, record);
        // If the component explicitly asks not to display as external links, use an internal link
        if (computedComponentExternalLinks === false) return false;
        if (!record?.id) return false;
        const serverBaseUrl = Object.keys(serversExternalLinks).find((baseUrl)=>record?.id.startsWith(baseUrl));
        // If no matching data servers could be found, assume we have an internal link
        if (!serverBaseUrl) return false;
        const computedServerExternalLinks = $85e9a897c6d7c14a$var$compute(serversExternalLinks[serverBaseUrl], record);
        // If the data server explicitly asks not to display as external links, use an internal link
        if (computedServerExternalLinks === false) return false;
        if ($85e9a897c6d7c14a$var$isURL(computedComponentExternalLinks)) return computedComponentExternalLinks;
        if ($85e9a897c6d7c14a$var$isURL(computedServerExternalLinks)) return computedServerExternalLinks;
        return record.id;
    }, [
        serversExternalLinks,
        componentExternalLinks
    ]);
};
var $85e9a897c6d7c14a$export$2e2bcd8739ae039 = $85e9a897c6d7c14a$var$useGetExternalLink;





const $d602250066d4ff3e$var$useGetPrefixFromUri = ()=>{
    const config = (0, $9def35f4441a9bb2$export$2e2bcd8739ae039)();
    return (0, $bkNnK$react.useCallback)((uri)=>(0, $8c4c0f0b55649ce6$export$2e2bcd8739ae039)(uri, config.ontologies), [
        config?.ontologies
    ]);
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
 */ const $f763906f9b20f2d8$var$FilterHandler = ({ children: children, record: record, filter: filter, source: source, ...otherProps })=>{
    const [filtered, setFiltered] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        if (record && source && Array.isArray(record?.[source])) {
            const filteredData = record?.[source].filter((r)=>{
                let eq = true;
                for(const key in filter){
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
    }, [
        record,
        source,
        filter
    ]);
    return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactjsxruntime.Fragment), {
        children: (0, ($parcel$interopDefault($bkNnK$react))).Children.map(children, (child, i)=>{
            return /*#__PURE__*/ (0, ($parcel$interopDefault($bkNnK$react))).cloneElement(child, {
                ...otherProps,
                record: filtered,
                source: source
            });
        })
    });
};
var $f763906f9b20f2d8$export$2e2bcd8739ae039 = $f763906f9b20f2d8$var$FilterHandler;






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
 */ const $b4703fef6d6af456$var$GroupedReferenceHandler = ({ children: children, groupReference: groupReference, groupLabel: groupLabel, groupHeader: groupHeader, filterProperty: filterProperty, ...otherProps })=>{
    const record = (0, $bkNnK$reactadmin.useRecordContext)();
    const { data: data } = (0, $bkNnK$reactadmin.useGetList)(groupReference);
    return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactjsxruntime.Fragment), {
        children: data?.map((data, index)=>{
            const filter = {};
            filter[filterProperty] = data.id;
            return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsxs)((0, $bkNnK$reactjsxruntime.Fragment), {
                children: [
                    groupHeader && groupHeader({
                        ...otherProps,
                        group: data
                    }),
                    /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $f763906f9b20f2d8$export$2e2bcd8739ae039), {
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
var $b4703fef6d6af456$export$2e2bcd8739ae039 = $b4703fef6d6af456$var$GroupedReferenceHandler;






const $030f1232f6810456$var$useReferenceInputStyles = (0, ($parcel$interopDefault($bkNnK$muistylesmakeStyles)))({
    form: {
        display: 'flex'
    },
    input: {
        paddingRight: '20px'
    }
});
const $030f1232f6810456$var$useHideInputStyles = (0, ($parcel$interopDefault($bkNnK$muistylesmakeStyles)))({
    root: {
        display: 'none'
    }
});
const $030f1232f6810456$var$ReificationArrayInput = (props)=>{
    const { reificationClass: reificationClass, children: children, ...otherProps } = props;
    const flexFormClasses = $030f1232f6810456$var$useReferenceInputStyles();
    const hideInputStyles = $030f1232f6810456$var$useHideInputStyles();
    return /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactadmin.ArrayInput), {
        ...otherProps,
        children: /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsxs)((0, $bkNnK$reactadmin.SimpleFormIterator), {
            classes: {
                form: flexFormClasses.form
            },
            children: [
                (0, ($parcel$interopDefault($bkNnK$react))).Children.map(props.children, (child, i)=>{
                    return /*#__PURE__*/ (0, ($parcel$interopDefault($bkNnK$react))).cloneElement(child, {
                        className: flexFormClasses.input
                    });
                }),
                /*#__PURE__*/ (0, $bkNnK$reactjsxruntime.jsx)((0, $bkNnK$reactadmin.TextInput), {
                    className: hideInputStyles.root,
                    source: "type",
                    initialValue: reificationClass
                })
            ]
        })
    });
};
var $030f1232f6810456$export$2e2bcd8739ae039 = $030f1232f6810456$var$ReificationArrayInput;



/**
 * Find the solid notification description resource for a given resource URI.
 */ const $84ab912646919f8c$var$findDescriptionResource = async (authenticatedFetch, resourceUri)=>{
    const { headers: headers } = await authenticatedFetch(resourceUri, {
        method: 'HEAD'
    });
    const linkHeader = headers.get('Link');
    const matches = linkHeader?.match(/<([^>]+)>;\s*rel="(?:describedby|http:\/\/www\.w3\.org\/ns\/solid\/terms#storageDescription)"/);
    if (!matches?.[1]) return undefined;
    // Don't use authenticatedFetch to get this endpoint
    const response = await fetch(matches[1], {
        headers: new Headers({
            Accept: 'application/ld+json'
        })
    });
    return await response.json();
};
const $84ab912646919f8c$export$3edfe18db119b920 = async (authenticatedFetch, resourceUri, options = {
    type: 'WebSocketChannel2023'
})=>{
    const { type: type, closeAfter: closeAfter, startIn: startIn, rate: rate } = options;
    let { startAt: startAt, endAt: endAt } = options;
    if (startIn && !startAt) startAt = new Date(Date.now() + startIn).toISOString();
    if (closeAfter && !endAt) endAt = new Date(Date.now() + closeAfter).toISOString();
    const descriptionResource = await $84ab912646919f8c$var$findDescriptionResource(authenticatedFetch, resourceUri);
    // TODO: use a json-ld parser / ldo in the future for this...
    // Get solid notification subscription service for the given type.
    const subscriptionService = (await Promise.all(// Get the subscription service resources (that describe a channel type).
    (0, $e6fbab1f303bdb93$export$2e2bcd8739ae039)(descriptionResource.subscription || descriptionResource['notify:subscription']).map(async (subscriptionServiceOrUri)=>{
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
    }))).find((service)=>{
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
const $84ab912646919f8c$export$28772ab4c256e709 = async (authenticatedFetch, resourceUri, options)=>{
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
 */ const $84ab912646919f8c$export$8d60734939c59ced = async (authenticatedFetch, resourceUri, options = {
    type: 'WebSocketChannel2023',
    closeAfter: 3600000
})=>{
    const socket = $84ab912646919f8c$var$registeredWebSockets.get(resourceUri);
    if (socket) // Will resolve or is resolved already.
    return socket;
    // Create a promise, to return immediately and set the sockets cache.
    // This prevents racing conditions that create multiple channels.
    const wsPromise = $84ab912646919f8c$export$28772ab4c256e709(authenticatedFetch, resourceUri, {
        ...options,
        type: 'WebSocketChannel2023'
    }).then((ws)=>{
        // Remove the promise from the cache, if it closes.
        ws.addEventListener('close', (e)=>{
            $84ab912646919f8c$var$registeredWebSockets.delete(resourceUri);
        });
        // Close the socket, if the endAt / closeAfter time is reached.
        const closeIn = options.closeAfter ?? (options.endAt && new Date(options.endAt).getTime() - Date.now());
        if (closeIn) setTimeout(()=>{
            ws.close();
        }, closeIn);
        return ws;
    });
    $84ab912646919f8c$var$registeredWebSockets.set(resourceUri, wsPromise);
    return wsPromise;
};



$parcel$exportWildcard(module.exports, $1bc09db736a9cb94$exports);


//# sourceMappingURL=index.cjs.js.map
