import {createConnectedLdoDataset as $fj9kP$createConnectedLdoDataset} from "@ldo/connected";
import {solidConnectedPlugin as $fj9kP$solidConnectedPlugin} from "@ldo/connected-solid";
import {createLdoDataset as $fj9kP$createLdoDataset} from "@ldo/ldo";
import $fj9kP$speakingurl from "speakingurl";
import $fj9kP$jsonld from "jsonld";
import $fj9kP$rdfjsdatamodel, {triple as $fj9kP$triple, variable as $fj9kP$variable, namedNode as $fj9kP$namedNode} from "@rdfjs/data-model";
import {Generator as $fj9kP$Generator} from "sparqljs";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'cryp... Remove this comment to see the full error message
import $fj9kP$cryptojsmd5 from "crypto-js/md5";
import {fetchUtils as $fj9kP$fetchUtils, useDataProvider as $fj9kP$useDataProvider, DataProviderContext as $fj9kP$DataProviderContext, useRecordContext as $fj9kP$useRecordContext, useGetList as $fj9kP$useGetList, ArrayInput as $fj9kP$ArrayInput, SimpleFormIterator as $fj9kP$SimpleFormIterator, TextInput as $fj9kP$TextInput} from "react-admin";
import $fj9kP$urljoin from "url-join";
import $fj9kP$jwtdecode from "jwt-decode";
import $fj9kP$httplinkheader from "http-link-header";
import {capitalCase as $fj9kP$capitalCase} from "change-case";
import $fj9kP$react, {useState as $fj9kP$useState, useEffect as $fj9kP$useEffect, useMemo as $fj9kP$useMemo, useCallback as $fj9kP$useCallback, useContext as $fj9kP$useContext} from "react";
import {jsx as $fj9kP$jsx, Fragment as $fj9kP$Fragment, jsxs as $fj9kP$jsxs} from "react/jsx-runtime";
// @ts-expect-error TS(2307): Cannot find module '@mui/styles/makeStyles' or its... Remove this comment to see the full error message
import $fj9kP$muistylesmakeStyles from "@mui/styles/makeStyles";






const $336b7edf722fe53e$var$fetchResource = async (resourceUri: any, config: any)=>{
    const { httpClient: httpClient, jsonContext: jsonContext } = config;
    let { json: data } = await httpClient(resourceUri);
    if (!data) throw new Error(`Not a valid JSON: ${resourceUri}`);
    data.id = data.id || data['@id'];
    // We compact only if the context is different between the frontend and the middleware
    // TODO deep compare if the context is an object
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    if (data['@context'] !== jsonContext) data = await (0, $fj9kP$jsonld).compact(data, jsonContext);
    return data;
};
var $336b7edf722fe53e$export$2e2bcd8739ae039 = $336b7edf722fe53e$var$fetchResource;


const $ed447224dd38ce82$var$getOneMethod = (config: any) => async (resourceId: any, params: any)=>{
        const { resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const data = await (0, $336b7edf722fe53e$export$2e2bcd8739ae039)(params.id, config);
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
var $ed447224dd38ce82$export$2e2bcd8739ae039 = $ed447224dd38ce82$var$getOneMethod;


const $c35ffbda15247c32$var$getUploadsContainerUri = (config: any, serverKey: any)=>{
    // If no server key is defined or if the server has no uploads container, find any server with a uploads container
    if (!serverKey || !config.dataServers[serverKey].containers || !config.dataServers[serverKey].containers?.find((c: any) => c.binaryResources)) serverKey = Object.keys(config.dataServers).find((key)=>config.dataServers[key].containers?.find((c: any) => c.binaryResources));
    if (serverKey) return config.dataServers[serverKey].containers?.find((c: any) => c.binaryResources)?.uri;
    else // No server has an uploads container
    return null;
};
var $c35ffbda15247c32$export$2e2bcd8739ae039 = $c35ffbda15247c32$var$getUploadsContainerUri;


const $b17c43e3301545ca$var$isFile = (o: any) => o?.rawFile && o.rawFile instanceof File;
const $b17c43e3301545ca$export$a5575dbeeffdad98 = async (rawFile: any, config: any, serverKey: any)=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const uploadsContainerUri = (0, $c35ffbda15247c32$export$2e2bcd8739ae039)(config, serverKey);
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
/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */ const $b17c43e3301545ca$var$uploadAllFiles = async (record: any, config: any, serverKey: any)=>{
    const updatedRecord = {
        ...record
    };
    for (const property of Object.keys(record)){
        const value = record[property];
        if (Array.isArray(value)) for(let i = 0; i < value.length; i++){
            const itemValue = value[i];
            if ($b17c43e3301545ca$var$isFile(itemValue)) updatedRecord[property][i] = await $b17c43e3301545ca$export$a5575dbeeffdad98(itemValue.rawFile, config, serverKey);
        }
        else if ($b17c43e3301545ca$var$isFile(value)) updatedRecord[property] = await $b17c43e3301545ca$export$a5575dbeeffdad98(value.rawFile, config, serverKey);
    }
    return {
        updatedRecord: updatedRecord
    };
};
var $b17c43e3301545ca$export$2e2bcd8739ae039 = {
    upload: $b17c43e3301545ca$var$uploadAllFiles
};


const $8326b88c1a913ca9$var$getServerKeyFromType = (type: any, dataServers: any)=>{
    return dataServers && Object.keys(dataServers).find((key)=>{
        return dataServers[key][type];
    });
};
var $8326b88c1a913ca9$export$2e2bcd8739ae039 = $8326b88c1a913ca9$var$getServerKeyFromType;


const $99cc2e4a2a3c100b$var$parseServerKey = (serverKey: any, dataServers: any)=>{
    switch(serverKey){
        case '@default':
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)('default', dataServers);
        case '@pod':
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)('pod', dataServers);
        case '@authServer':
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)('authServer', dataServers);
        default:
            return serverKey;
    }
};
// Return the list of servers keys in an array
// parsing keywords like @all, @default, @pod and @authServer
const $99cc2e4a2a3c100b$var$parseServerKeys = (serverKeys: any, dataServers: any)=>{
    if (Array.isArray(serverKeys)) {
        if (serverKeys.includes('@all')) return Object.keys(dataServers);
        else return serverKeys.map((serverKey)=>$99cc2e4a2a3c100b$var$parseServerKey(serverKey, dataServers));
    } else if (typeof serverKeys === 'string') {
        if (serverKeys === '@all') return Object.keys(dataServers);
        else if (serverKeys === '@remote') {
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const defaultServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)('default', dataServers);
            return Object.keys(dataServers).filter((serverKey)=>serverKey !== defaultServerKey);
        } else return [
            $99cc2e4a2a3c100b$var$parseServerKey(serverKeys, dataServers)
        ];
    } else throw new Error(`The parseServerKeys expect a list of server keys, or keywords`);
};
var $99cc2e4a2a3c100b$export$2e2bcd8739ae039 = $99cc2e4a2a3c100b$var$parseServerKeys;


/**
 * Return all containers matching the given types
 */ const $15b841e67a1ba752$var$findContainersWithTypes = (types: any, serverKeys: any, dataServers: any)=>{
    const matchingContainers: any = [];
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const parsedServerKeys = (0, $99cc2e4a2a3c100b$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
    Object.keys(dataServers).forEach((dataServerKey)=>{
        if (parsedServerKeys.includes(dataServerKey)) dataServers[dataServerKey].containers?.forEach((container: any) => {
            if (container.types?.some((t: any) => types.includes(t))) matchingContainers.push(container);
        });
    });
    return matchingContainers;
};
var $15b841e67a1ba752$export$2e2bcd8739ae039 = $15b841e67a1ba752$var$findContainersWithTypes;


const $7c772a9c0c25a69d$var$findContainersWithURIs = (containersUris: any, dataServers: any)=>{
    const matchingContainers: any = [];
    Object.keys(dataServers).forEach((serverKey)=>{
        dataServers[serverKey].containers?.forEach((container: any) => {
            if (container.uri && containersUris.includes(container.uri)) matchingContainers.push(container);
        });
    });
    return matchingContainers;
};
var $7c772a9c0c25a69d$export$2e2bcd8739ae039 = $7c772a9c0c25a69d$var$findContainersWithURIs;


const $5a7a2f7583392866$var$createMethod = (config: any) => async (resourceId: any, params: any)=>{
        const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);
        const headers = new Headers();
        let containerUri;
        let serverKey;
        if (dataModel.create?.container) {
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const [container] = (0, $7c772a9c0c25a69d$export$2e2bcd8739ae039)([
                dataModel.create?.container
            ], dataServers);
            serverKey = container.server;
            containerUri = container.uri;
        } else {
            serverKey = dataModel.create?.server || Object.keys(dataServers).find((key)=>dataServers[key].default === true);
            if (!serverKey) throw new Error('You must define a server for the creation, or a container, or a default server');
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const containers = (0, $15b841e67a1ba752$export$2e2bcd8739ae039)(dataModel.types, [
                serverKey
            ], dataServers);
            if (!containers || containers.length === 0) throw new Error(`No container with types ${JSON.stringify(dataModel.types)} found on server ${serverKey}`);
            if (containers.length > 1) throw new Error(`More than one container detected with types ${JSON.stringify(dataModel.types)} on server ${serverKey}`);
            containerUri = containers[0].uri;
        }
        if (params.data) {
            if (dataModel.fieldsMapping?.title) {
                const slug = Array.isArray(dataModel.fieldsMapping.title) ? dataModel.fieldsMapping.title.map((f: any) => params.data[f]).join(' ') : params.data[dataModel.fieldsMapping.title];
                // Generate slug here, otherwise we may get errors with special characters
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                headers.set('Slug', (0, $fj9kP$speakingurl)(slug));
            }
            // Upload files, if there are any
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const { updatedRecord: updatedRecord } = await (0, $b17c43e3301545ca$export$2e2bcd8739ae039).upload(params.data, config, serverKey);
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
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return await (0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)(resourceId, {
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
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return await (0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)(resourceId, {
                id: params.id
            });
        }
    };
var $5a7a2f7583392866$export$2e2bcd8739ae039 = $5a7a2f7583392866$var$createMethod;


const $9510970b8e7eb9e2$var$deleteMethod = (config: any) => async (resourceId: any, params: any)=>{
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
var $9510970b8e7eb9e2$export$2e2bcd8739ae039 = $9510970b8e7eb9e2$var$deleteMethod;


const $298dd1ae21173ea0$var$deleteManyMethod = (config: any) => async (resourceId: any, params: any)=>{
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
var $298dd1ae21173ea0$export$2e2bcd8739ae039 = $298dd1ae21173ea0$var$deleteManyMethod;


const $7dd5bf9323d2d9c1$var$getDataServers = (config: any) => ()=>{
        return config.dataServers;
    };
var $7dd5bf9323d2d9c1$export$2e2bcd8739ae039 = $7dd5bf9323d2d9c1$var$getDataServers;


const $54a3fa40eed06111$var$getDataModels = (config: any) => ()=>{
        return config.resources;
    };
var $54a3fa40eed06111$export$2e2bcd8739ae039 = $54a3fa40eed06111$var$getDataModels;




const $cc8adac4b83414eb$var$arrayOf = (value: any) => {
    // If the field is null-ish, we suppose there are no values.
    if (!value) return [];
    // Return as is.
    if (Array.isArray(value)) return value;
    // Single value is made an array.
    return [
        value
    ];
};
var $cc8adac4b83414eb$export$2e2bcd8739ae039 = $cc8adac4b83414eb$var$arrayOf;


const $aba124ea15ea8bc6$var$isValidLDPContainer = (container: any) => {
    const resourceType = container.type || container['@type'];
    return Array.isArray(resourceType) ? resourceType.includes('ldp:Container') : resourceType === 'ldp:Container';
};
const $aba124ea15ea8bc6$var$isObject = (val: any) => {
    return val != null && typeof val === 'object' && !Array.isArray(val);
};
// @ts-expect-error TS(7031): Binding element 'httpClient' implicitly has an 'an... Remove this comment to see the full error message
const $aba124ea15ea8bc6$var$fetchContainers = async (containers: any, params: any, { httpClient: httpClient, jsonContext: jsonContext })=>{
    // @ts-expect-error TS(7031): Binding element 'json' implicitly has an 'any' typ... Remove this comment to see the full error message
    const fetchPromises = containers.map((container: any) => httpClient(container.uri).then(async ({ json: json })=>{
            const jsonResponse = json;
            // If container's context is different, compact it to have an uniform result
            // TODO deep compare if the context is an object
            // This is most likely an array of two strings
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            if (jsonResponse['@context'] !== jsonContext) return (0, $fj9kP$jsonld).compact(jsonResponse, jsonContext);
            return jsonResponse;
        }).then((json: any) => {
            if (!$aba124ea15ea8bc6$var$isValidLDPContainer(json)) throw new Error(`${container.uri} is not a LDP container`);
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(json['ldp:contains']).map((resource)=>({
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
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
            if (!$aba124ea15ea8bc6$var$isObject(attributeValue)) {
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
                return arrayValues.some((value: any) => typeof value === 'string' && value.includes(filters[attribute]));
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
var $aba124ea15ea8bc6$export$2e2bcd8739ae039 = $aba124ea15ea8bc6$var$fetchContainers;



const $3007d5479dd82d51$var$getEmbedFrame = (blankNodes: any) => {
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
                // @ts-expect-error TS(7006): Parameter 'accumulator' implicitly has an 'any' ty... Remove this comment to see the full error message
                ...predicates.reduce((accumulator, predicate) => ({
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
var $3007d5479dd82d51$export$2e2bcd8739ae039 = $3007d5479dd82d51$var$getEmbedFrame;




const $4872a1c30c1fc60e$var$getUriFromPrefix = (item: any, ontologies: any)=>{
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
var $4872a1c30c1fc60e$export$2e2bcd8739ae039 = $4872a1c30c1fc60e$var$getUriFromPrefix;


const $47d734d7812e6861$var$defaultToArray = (value: any) => !value ? [] : Array.isArray(value) ? value : [
        value
    ];
// We need to always include the type or React-Admin will not work properly
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $47d734d7812e6861$var$typeQuery = (0, $fj9kP$triple)((0, $fj9kP$variable)('s1'), (0, $fj9kP$namedNode)('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), (0, $fj9kP$variable)('type'));
const $47d734d7812e6861$var$buildBaseQuery = (predicates: any, ontologies: any)=>{
    let baseTriples;
    if (predicates) {
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        baseTriples = $47d734d7812e6861$var$defaultToArray(predicates).map((predicate, i)=>(0, $fj9kP$triple)((0, $fj9kP$variable)('s1'), (0, $fj9kP$namedNode)((0, $4872a1c30c1fc60e$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $fj9kP$variable)(`o${i + 1}`)));
        return {
            construct: [
                $47d734d7812e6861$var$typeQuery,
                ...baseTriples
            ],
            where: [
                $47d734d7812e6861$var$typeQuery,
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
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        (0, $fj9kP$triple)((0, $fj9kP$variable)('s1'), (0, $fj9kP$variable)('p1'), (0, $fj9kP$variable)('o1'))
    ];
    return {
        construct: baseTriples,
        where: baseTriples
    };
};
var $47d734d7812e6861$export$2e2bcd8739ae039 = $47d734d7812e6861$var$buildBaseQuery;





// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const $865f630cc944e818$var$extractNodes = (blankNodes: any) => {
    const nodes = [];
    if (blankNodes) {
        for (const predicate of blankNodes)if (predicate.includes('/')) {
            const nodeNames = predicate.split('/');
            for(let i = 1; i <= nodeNames.length; i++)nodes.push(nodeNames.slice(0, i).join('/'));
        } else nodes.push(predicate);
    }
    return nodes;
};
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $865f630cc944e818$var$generateSparqlVarName = (node: any) => (0, $fj9kP$cryptojsmd5)(node);
const $865f630cc944e818$var$getParentNode = (node: any) => node.includes('/') && node.split('/')[0];
const $865f630cc944e818$var$getPredicate = (node: any) => node.includes('/') ? node.split('/')[1] : node;
const $865f630cc944e818$var$buildUnionQuery = (queries: any) => queries.map((q: any) => {
        let triples = q.query;
        const firstTriple = queries.find((q2: any) => q.parentNode === q2.node);
        if (firstTriple !== undefined) triples = triples.concat(firstTriple.query[0]);
        return {
            type: 'bgp',
            triples: triples
        };
    });
const $865f630cc944e818$var$buildBlankNodesQuery = (blankNodes: any, baseQuery: any, ontologies: any)=>{
    const queries = [];
    const nodes = $865f630cc944e818$var$extractNodes(blankNodes);
    if (nodes && ontologies && ontologies.length > 0) {
        for (const node of nodes){
            const parentNode = $865f630cc944e818$var$getParentNode(node);
            const predicate = $865f630cc944e818$var$getPredicate(node);
            const varName = $865f630cc944e818$var$generateSparqlVarName(node);
            const parentVarName = parentNode ? $865f630cc944e818$var$generateSparqlVarName(parentNode) : '1';
            const query = [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                (0, $fj9kP$triple)((0, $fj9kP$variable)(`s${parentVarName}`), (0, $fj9kP$namedNode)((0, $4872a1c30c1fc60e$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $fj9kP$variable)(`s${varName}`)),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                (0, $fj9kP$triple)((0, $fj9kP$variable)(`s${varName}`), (0, $fj9kP$variable)(`p${varName}`), (0, $fj9kP$variable)(`o${varName}`))
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
                    ...$865f630cc944e818$var$buildUnionQuery(queries)
                ]
            }
        };
    }
    return {
        construct: '',
        where: ''
    };
};
// @ts-expect-error TS(2742): The inferred type of '$865f630cc944e818$export$2e2... Remove this comment to see the full error message
var $865f630cc944e818$export$2e2bcd8739ae039 = $865f630cc944e818$var$buildBlankNodesQuery;



const $efbe3fa6f1479c06$var$buildAutoDetectBlankNodesQuery = (depth: any, baseQuery: any)=>{
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
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            construct.push((0, $fj9kP$triple)((0, $fj9kP$variable)(`o${i}`), (0, $fj9kP$variable)(`p${i + 1}`), (0, $fj9kP$variable)(`o${i + 1}`)));
            whereQueries.push([
                ...whereQueries[whereQueries.length - 1],
                {
                    type: 'filter',
                    expression: {
                        type: 'operation',
                        operator: 'isblank',
                        args: [
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            (0, $fj9kP$variable)(`o${i}`)
                        ]
                    }
                },
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                (0, $fj9kP$triple)((0, $fj9kP$variable)(`o${i}`), (0, $fj9kP$variable)(`p${i + 1}`), (0, $fj9kP$variable)(`o${i + 1}`))
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
var $efbe3fa6f1479c06$export$2e2bcd8739ae039 = $efbe3fa6f1479c06$var$buildAutoDetectBlankNodesQuery;




var $6cde9a8fbbde3ffb$require$SparqlGenerator = $fj9kP$Generator;
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const { literal: $6cde9a8fbbde3ffb$var$literal, namedNode: $6cde9a8fbbde3ffb$var$namedNode, triple: $6cde9a8fbbde3ffb$var$triple, variable: $6cde9a8fbbde3ffb$var$variable } = (0, $fj9kP$rdfjsdatamodel);
const $6cde9a8fbbde3ffb$var$generator = new $6cde9a8fbbde3ffb$require$SparqlGenerator({
});
const $6cde9a8fbbde3ffb$var$reservedFilterKeys = [
    'q',
    'sparqlWhere',
    'blankNodes',
    'blankNodesDepth',
    '_servers',
    '_predicates'
];
// @ts-expect-error TS(7031): Binding element 'containersUris' implicitly has an... Remove this comment to see the full error message
const $6cde9a8fbbde3ffb$var$buildSparqlQuery = ({ containersUris: containersUris, params: params, dataModel: dataModel, ontologies: ontologies })=>{
    const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
    const predicates = params.filter?._predicates || dataModel.list?.predicates;
    const blankNodesDepth = params.filter?.blankNodesDepth ?? dataModel.list?.blankNodesDepth ?? 2;
    const filter = {
        ...dataModel.list?.filter,
        ...params.filter
    };
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const baseQuery = (0, $47d734d7812e6861$export$2e2bcd8739ae039)(predicates, ontologies);
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
            values: containersUris.map((containerUri: any) => ({
                '?containerUri': $6cde9a8fbbde3ffb$var$namedNode(containerUri)
            }))
        },
        $6cde9a8fbbde3ffb$var$triple($6cde9a8fbbde3ffb$var$variable('containerUri'), $6cde9a8fbbde3ffb$var$namedNode('http://www.w3.org/ns/ldp#contains'), $6cde9a8fbbde3ffb$var$variable('s1')),
        {
            type: 'filter',
            expression: {
                type: 'operation',
                operator: 'isiri',
                args: [
                    $6cde9a8fbbde3ffb$var$variable('s1')
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
                        $6cde9a8fbbde3ffb$var$variable('s1')
                    ],
                    where: [
                        $6cde9a8fbbde3ffb$var$triple($6cde9a8fbbde3ffb$var$variable('s1'), $6cde9a8fbbde3ffb$var$variable('p1'), $6cde9a8fbbde3ffb$var$variable('o1')),
                        {
                            type: 'filter',
                            expression: {
                                type: 'operation',
                                operator: 'isliteral',
                                args: [
                                    $6cde9a8fbbde3ffb$var$variable('o1')
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
                                                    $6cde9a8fbbde3ffb$var$variable('o1')
                                                ]
                                            }
                                        ]
                                    },
                                    // @ts-expect-error TS(2554): Expected 1-2 arguments, but got 3.
                                    $6cde9a8fbbde3ffb$var$literal(filter.q.toLowerCase(), '', $6cde9a8fbbde3ffb$var$namedNode('http://www.w3.org/2001/XMLSchema#string'))
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
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            if (!$6cde9a8fbbde3ffb$var$reservedFilterKeys.includes(predicate)) resourceWhere.unshift($6cde9a8fbbde3ffb$var$triple($6cde9a8fbbde3ffb$var$variable('s1'), $6cde9a8fbbde3ffb$var$namedNode((0, $4872a1c30c1fc60e$export$2e2bcd8739ae039)(predicate, ontologies)), $6cde9a8fbbde3ffb$var$namedNode((0, $4872a1c30c1fc60e$export$2e2bcd8739ae039)(object, ontologies))));
        });
    }
    // Blank nodes
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const blankNodesQuery = blankNodes ? (0, $865f630cc944e818$export$2e2bcd8739ae039)(blankNodes, baseQuery, ontologies) : (0, $efbe3fa6f1479c06$export$2e2bcd8739ae039)(blankNodesDepth, baseQuery);
    if (blankNodesQuery && blankNodesQuery.construct) {
        // @ts-expect-error TS(2769): No overload matches this call.
        resourceWhere = resourceWhere.concat(blankNodesQuery.where);
        // @ts-expect-error TS(2769): No overload matches this call.
        sparqlJsParams.template = sparqlJsParams.template.concat(blankNodesQuery.construct);
    } else resourceWhere.push(baseQuery.where);
    // @ts-expect-error TS(2345): Argument of type '(Quad | { type: string; values: ... Remove this comment to see the full error message
    sparqlJsParams.where.push(containerWhere, resourceWhere);
    // @ts-expect-error TS(2345): Argument of type '{ queryType: string; template: Q... Remove this comment to see the full error message
    return $6cde9a8fbbde3ffb$var$generator.stringify(sparqlJsParams);
};
var $6cde9a8fbbde3ffb$export$2e2bcd8739ae039 = $6cde9a8fbbde3ffb$var$buildSparqlQuery;


const $05a1b4063d50f1b7$var$compare = (a: any, b: any)=>{
    switch(typeof a){
        case 'string':
            return a.localeCompare(b);
        case 'number':
            return a - b;
        default:
            return 0;
    }
};
const $05a1b4063d50f1b7$var$fetchSparqlEndpoints = async (containers: any, resourceId: any, params: any, config: any)=>{
    const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext, ontologies: ontologies } = config;
    const dataModel = resources[resourceId];
    const serversToQuery = containers.reduce((acc: any, cur: any)=>{
        if (!acc.includes(cur.server)) acc.push(cur.server);
        return acc;
    }, []);
    const sparqlQueryPromises = serversToQuery.map((serverKey: any) => new Promise((resolve, reject)=>{
            const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const sparqlQuery = (0, $6cde9a8fbbde3ffb$export$2e2bcd8739ae039)({
                containersUris: containers.filter((c: any) => c.server === serverKey).map((c: any) => c.uri),
                params: params,
                dataModel: dataModel,
                ontologies: ontologies
            });
            httpClient(dataServers[serverKey].sparqlEndpoint, {
                method: 'POST',
                body: sparqlQuery
            // @ts-expect-error TS(7031): Binding element 'json' implicitly has an 'any' typ... Remove this comment to see the full error message
            }).then(({ json: json })=>{
                // If we declared the blank nodes to dereference, embed only those blank nodes
                // This solve problems which can occur when same-type resources are embedded in other resources
                // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
                const frame = blankNodes && dataModel.list?.explicitEmbedOnFraming !== false ? {
                    '@context': jsonContext,
                    '@type': dataModel.types,
                    '@embed': '@never',
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    ...(0, $3007d5479dd82d51$export$2e2bcd8739ae039)(blankNodes)
                } : {
                    '@context': jsonContext,
                    '@type': dataModel.types
                };
                // omitGraph option force results to be in a @graph, even if we have a single result
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                return (0, $fj9kP$jsonld).frame(json, frame, {
                    omitGraph: false
                });
            }).then((compactJson: any) => {
                if (compactJson['@id']) {
                    const { '@context': context, ...rest } = compactJson;
                    compactJson = {
                        '@context': context,
                        '@graph': [
                            rest
                        ]
                    };
                }
                resolve(compactJson['@graph']?.map((resource: any) => ({
                    '@context': compactJson['@context'],
                    ...resource
                })) || []);
            }).catch((e: any) => reject(e));
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
            if (params.sort.order === 'ASC') return $05a1b4063d50f1b7$var$compare(a[params.sort.field], b[params.sort.field]);
            return $05a1b4063d50f1b7$var$compare(b[params.sort.field], a[params.sort.field]);
        }
        return 0;
    });
    if (params.pagination) returnData = returnData.slice((params.pagination.page - 1) * params.pagination.perPage, params.pagination.page * params.pagination.perPage);
    return {
        data: returnData,
        total: results.length
    };
};
var $05a1b4063d50f1b7$export$2e2bcd8739ae039 = $05a1b4063d50f1b7$var$fetchSparqlEndpoints;




/**
 * Return all containers matching the given shape tree
 */ const $3bcb3ff5a72a9185$var$findContainersWithShapeTree = (shapeTreeUri: any, serverKeys: any, dataServers: any)=>{
    const matchingContainers: any = [];
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const parsedServerKeys = (0, $99cc2e4a2a3c100b$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
    Object.keys(dataServers).forEach((dataServerKey)=>{
        if (parsedServerKeys.includes(dataServerKey)) dataServers[dataServerKey].containers?.forEach((container: any) => {
            if (container.shapeTreeUri === shapeTreeUri) matchingContainers.push(container);
        });
    });
    return matchingContainers;
};
var $3bcb3ff5a72a9185$export$2e2bcd8739ae039 = $3bcb3ff5a72a9185$var$findContainersWithShapeTree;



const $1caf729dc3ce856d$var$getListMethod = (config: any) => async (resourceId: any, params: any)=>{
        const { dataServers: dataServers, resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
        let containers = [];
        if (!params.filter?._servers && dataModel.list?.containers) {
            if (!Array.isArray(dataModel.list?.containers)) throw new Error(`The list.containers property of ${resourceId} dataModel must be of type array`);
            // If containers are set explicitly, use them
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            containers = (0, $7c772a9c0c25a69d$export$2e2bcd8739ae039)(dataModel.list.containers, dataServers);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        } else if (dataModel.shapeTreeUri) containers = (0, $3bcb3ff5a72a9185$export$2e2bcd8739ae039)(dataModel.shapeTreeUri, params?.filter?._servers || dataModel.list?.servers, dataServers);
        else // Otherwise find the container URIs on the given servers (either in the filter or the data model)
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        containers = (0, $15b841e67a1ba752$export$2e2bcd8739ae039)((0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(dataModel.types), params?.filter?._servers || dataModel.list?.servers, dataServers);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        if (dataModel.list?.fetchContainer) return (0, $aba124ea15ea8bc6$export$2e2bcd8739ae039)(containers, params, config);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        else return (0, $05a1b4063d50f1b7$export$2e2bcd8739ae039)(containers, resourceId, params, config);
    };
var $1caf729dc3ce856d$export$2e2bcd8739ae039 = $1caf729dc3ce856d$var$getListMethod;



const $f1e05270f9a21255$var$getManyMethod = (config: any) => async (resourceId: any, params: any)=>{
        const { returnFailedResources: returnFailedResources } = config;
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        let returnData = await Promise.all(params.ids.map((id: any) => (0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)(resourceId, {
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
var $f1e05270f9a21255$export$2e2bcd8739ae039 = $f1e05270f9a21255$var$getManyMethod;



const $b5979a9678f57756$var$getManyReferenceMethod = (config: any) => async (resourceId: any, params: any)=>{
        params.filter = {
            ...params.filter,
            [params.target]: params.id
        };
        delete params.target;
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        return await (0, $1caf729dc3ce856d$export$2e2bcd8739ae039)(config)(resourceId, params);
    };
var $b5979a9678f57756$export$2e2bcd8739ae039 = $b5979a9678f57756$var$getManyReferenceMethod;




// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $cdfdce6efa87baab$var$generator = new (0, $fj9kP$Generator)();
const $cdfdce6efa87baab$var$patchMethod = (config: any) => async (resourceId: any, params: any)=>{
        const { httpClient: httpClient } = config;
        const sparqlUpdate = {
            type: 'update',
            prefixes: {},
            updates: []
        };
        if (params.triplesToAdd) sparqlUpdate.updates.push({
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
            updateType: 'insert',
            insert: [
                {
                    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
                    type: 'bgp',
                    // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
                    triples: params.triplesToAdd
                }
            ]
        });
        if (params.triplesToRemove) sparqlUpdate.updates.push({
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
            updateType: 'delete',
            delete: [
                {
                    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
                    type: 'bgp',
                    // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
                    triples: params.triplesToRemove
                }
            ]
        });
        await httpClient(`${params.id}`, {
            method: 'PATCH',
            headers: new Headers({
                'Content-Type': 'application/sparql-update'
            }),
            // @ts-expect-error TS(2345): Argument of type '{ type: string; prefixes: {}; up... Remove this comment to see the full error message
            body: $cdfdce6efa87baab$var$generator.stringify(sparqlUpdate)
        });
    };
var $cdfdce6efa87baab$export$2e2bcd8739ae039 = $cdfdce6efa87baab$var$patchMethod;



// Return the first server matching with the baseUrl
const $47e21ee81eed09a6$var$getServerKeyFromUri = (uri: any, dataServers: any)=>{
    if (!uri) throw Error(`No URI provided to getServerKeyFromUri`);
    return dataServers && Object.keys(dataServers).find((key)=>{
        if (dataServers[key].pod) // The baseUrl ends with /data so remove this part to match with the webId and webId-related URLs (/inbox, /outbox...)
        return dataServers[key].baseUrl && uri.startsWith(dataServers[key].baseUrl.replace('/data', ''));
        return uri.startsWith(dataServers[key].baseUrl);
    });
};
var $47e21ee81eed09a6$export$2e2bcd8739ae039 = $47e21ee81eed09a6$var$getServerKeyFromUri;


const $c5031381f4dfc62d$var$updateMethod = (config: any) => async (resourceId: any, params: any)=>{
        const { httpClient: httpClient, jsonContext: jsonContext, dataServers: dataServers } = config;
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const serverKey = (0, $47e21ee81eed09a6$export$2e2bcd8739ae039)(params.id, dataServers);
        // Upload files, if there are any
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const { updatedRecord: updatedRecord } = await (0, $b17c43e3301545ca$export$2e2bcd8739ae039).upload(params.data, config, serverKey);
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
var $c5031381f4dfc62d$export$2e2bcd8739ae039 = $c5031381f4dfc62d$var$updateMethod;





/*
 * HTTP client used by all calls in data provider and auth provider
 * Do proxy calls if a proxy endpoint is available and the server is different from the auth server
 */ const $22b4895a4ca7d626$var$httpClient = (dataServers: any) => (url: any, options = {})=>{
        if (!url) throw new Error(`No URL provided on httpClient call`);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const authServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)('authServer', dataServers);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const serverKey = (0, $47e21ee81eed09a6$export$2e2bcd8739ae039)(url, dataServers);
        const useProxy = serverKey !== authServerKey && dataServers[authServerKey]?.proxyUrl && dataServers[serverKey]?.noProxy !== true;
        // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
        if (!options.headers) options.headers = new Headers();
        // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
        switch(options.method){
            case 'POST':
            case 'PATCH':
            case 'PUT':
                // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
                if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
                // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
                if (!options.headers.has('Content-Type')) options.headers.set('Content-Type', 'application/ld+json');
                break;
            case 'DELETE':
                break;
            case 'GET':
            default:
                // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
                if (!options.headers.has('Accept')) options.headers.set('Accept', 'application/ld+json');
                break;
        }
        if (useProxy) {
            const formData = new FormData();
            formData.append('id', url);
            // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
            formData.append('method', options.method || 'GET');
            // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
            formData.append('headers', JSON.stringify(Object.fromEntries(options.headers.entries())));
            // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
            if (options.body) {
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
                if (options.body instanceof File) formData.append('body', options.body, options.body.name);
                // @ts-expect-error TS(2339): Property 'body' does not exist on type '{}'.
                else formData.append('body', options.body);
            }
            // Post to proxy endpoint with multipart/form-data format
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return (0, $fj9kP$fetchUtils).fetchJson(dataServers[authServerKey].proxyUrl, {
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
            // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
            if (token) options.headers.set('Authorization', `Bearer ${token}`);
        }
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        return (0, $fj9kP$fetchUtils).fetchJson(url, options);
    };
var $22b4895a4ca7d626$export$2e2bcd8739ae039 = $22b4895a4ca7d626$var$httpClient;







const $36aa010ec46eaf45$var$isURI = (value: any) => (typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));
const $36aa010ec46eaf45$var$expandTypes = async (types: any, context: any)=>{
    // If types are already full URIs, return them immediately
    if (types.every((type: any) => $36aa010ec46eaf45$var$isURI(type))) return types;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const result = await (0, $fj9kP$jsonld).expand({
        '@context': context,
        '@type': types
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const expandedTypes = (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(result[0]['@type']);
    if (!expandedTypes.every((type)=>$36aa010ec46eaf45$var$isURI(type))) throw new Error(`
      Could not expand all types (${expandedTypes.join(', ')}).
      Is an ontology missing or not registered yet on the local context ?
    `);
    return expandedTypes;
};
var $36aa010ec46eaf45$export$2e2bcd8739ae039 = $36aa010ec46eaf45$var$expandTypes;




const $ab7d38fd091ff1b6$var$getTypesFromShapeTree = async (shapeTreeUri: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    let { json: shapeTree } = await (0, $fj9kP$fetchUtils).fetchJson(shapeTreeUri, {
        headers: new Headers({
            Accept: 'application/ld+json'
        })
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    shapeTree = await (0, $fj9kP$jsonld).compact(shapeTree, {
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
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const { json: shape } = await (0, $fj9kP$fetchUtils).fetchJson(shapeTree.shape, {
            headers: new Headers({
                Accept: 'application/ld+json'
            })
        });
        return shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map((node: any) => node?.['@id']) || [];
    } else return [];
};
var $ab7d38fd091ff1b6$export$2e2bcd8739ae039 = $ab7d38fd091ff1b6$var$getTypesFromShapeTree;


/**
 * For data server containers, expands types and adds `uri` and `server` properties.
 * For resources, expands types (if applicable from shape tree information).
 */ const $33bf2a661b5c0cbd$var$normalizeConfig = async (config: any) => {
    const newConfig = {
        ...config
    };
    // Add server and uri key to servers' containers
    for (const serverKey of Object.keys(newConfig.dataServers))if (newConfig.dataServers[serverKey].containers) newConfig.dataServers[serverKey].containers = await Promise.all(newConfig.dataServers[serverKey].containers?.map(async (container: any) => {
        return {
            ...container,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            types: container.types && (await (0, $36aa010ec46eaf45$export$2e2bcd8739ae039)(container.types, config.jsonContext)),
            server: serverKey,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            uri: (0, $fj9kP$urljoin)(config.dataServers[serverKey].baseUrl, container.path)
        };
    }));
    // Expand types in data models
    for (const resourceId of Object.keys(newConfig.resources)){
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        if (!newConfig.resources[resourceId].types && newConfig.resources[resourceId].shapeTreeUri) newConfig.resources[resourceId].types = await (0, $ab7d38fd091ff1b6$export$2e2bcd8739ae039)(newConfig.resources[resourceId].shapeTreeUri);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        newConfig.resources[resourceId].types = await (0, $36aa010ec46eaf45$export$2e2bcd8739ae039)((0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(newConfig.resources[resourceId].types), config.jsonContext);
    }
    return newConfig;
};
var $33bf2a661b5c0cbd$export$2e2bcd8739ae039 = $33bf2a661b5c0cbd$var$normalizeConfig;




const $143de1c1f21344e7$var$isURL = (value: any) => (typeof value === 'string' || value instanceof String) && value.startsWith('http');
const $143de1c1f21344e7$var$getOntologiesFromContextJson = (contextJson: any) => {
    const ontologies = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    for (const [key, value] of Object.entries(contextJson))if ($143de1c1f21344e7$var$isURL(value)) ontologies[key] = value;
    return ontologies;
};
const $143de1c1f21344e7$var$getOntologiesFromContextUrl = async (contextUrl: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { json: json } = await (0, $fj9kP$fetchUtils).fetchJson(contextUrl, {
        headers: new Headers({
            Accept: 'application/ld+json'
        })
    });
    return $143de1c1f21344e7$var$getOntologiesFromContextJson(json['@context']);
};
const $143de1c1f21344e7$var$getOntologiesFromContext = async (context: any) => {
    let ontologies = {};
    if (Array.isArray(context)) for (const contextUrl of context)ontologies = {
        ...ontologies,
        ...(await $143de1c1f21344e7$var$getOntologiesFromContextUrl(contextUrl))
    };
    else if (typeof context === 'string') ontologies = await $143de1c1f21344e7$var$getOntologiesFromContextUrl(context);
    else ontologies = $143de1c1f21344e7$var$getOntologiesFromContextJson(context);
    return ontologies;
};
var $143de1c1f21344e7$export$2e2bcd8739ae039 = $143de1c1f21344e7$var$getOntologiesFromContext;


/** @type {(originalConfig: Configuration) => SemanticDataProvider} */ const $243bf28fbb1b868f$var$dataProvider = (originalConfig: any) => {
    // Keep in memory for refresh
    let config = {
        ...originalConfig
    };
    const prepareConfig = async ()=>{
        config.dataServers ??= {};
        // Configure httpClient with initial data servers, so that plugins may use it
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        config.httpClient = (0, $22b4895a4ca7d626$export$2e2bcd8739ae039)(config.dataServers);
        for (const plugin of config.plugins)if (plugin.transformConfig) config = await plugin.transformConfig(config);
        // Configure again httpClient with possibly updated data servers
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        config.httpClient = (0, $22b4895a4ca7d626$export$2e2bcd8739ae039)(config.dataServers);
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const dataset = (0, $fj9kP$createConnectedLdoDataset)([
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            (0, $fj9kP$solidConnectedPlugin)
        ]);
        dataset.setContext('solid', {
            // @ts-expect-error TS(2552): Cannot find name 'fetchFn'. Did you mean 'fetch'?
            fetch: fetchFn
        });
        // Attach httpClient to global document -- useful for debugging.
        // @ts-expect-error TS(2339): Property 'httpClient' does not exist on type 'Docu... Remove this comment to see the full error message
        document.httpClient = config.httpClient;
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        if (!config.ontologies && config.jsonContext) config.ontologies = await (0, $143de1c1f21344e7$export$2e2bcd8739ae039)(config.jsonContext);
        else if (!config.jsonContext && config.ontologies) config.jsonContext = config.ontologies;
        else if (!config.jsonContext && !config.ontologies) throw new Error(`Either the JSON context or the ontologies must be set`);
        if (!config.returnFailedResources) config.returnFailedResources = false;
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        config = await (0, $33bf2a661b5c0cbd$export$2e2bcd8739ae039)(config);
        console.log('Config after plugins', config);
    };
    // Immediately call the preload plugins
    const prepareConfigPromise = prepareConfig();
    const waitForPrepareConfig = (method: any) => async (...arg: any[])=>{
            await prepareConfigPromise; // Return immediately if plugins have already been loaded
            return method(config)(...arg);
        };
    return {
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getList: waitForPrepareConfig((0, $1caf729dc3ce856d$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getMany: waitForPrepareConfig((0, $f1e05270f9a21255$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getManyReference: waitForPrepareConfig((0, $b5979a9678f57756$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getOne: waitForPrepareConfig((0, $ed447224dd38ce82$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        create: waitForPrepareConfig((0, $5a7a2f7583392866$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        update: waitForPrepareConfig((0, $c5031381f4dfc62d$export$2e2bcd8739ae039)),
        updateMany: ()=>{
            throw new Error('updateMany is not implemented yet');
        },
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        delete: waitForPrepareConfig((0, $9510970b8e7eb9e2$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        deleteMany: waitForPrepareConfig((0, $298dd1ae21173ea0$export$2e2bcd8739ae039)),
        // Custom methods
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        patch: waitForPrepareConfig((0, $cdfdce6efa87baab$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getDataModels: waitForPrepareConfig((0, $54a3fa40eed06111$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getDataServers: waitForPrepareConfig((0, $7dd5bf9323d2d9c1$export$2e2bcd8739ae039)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        getLocalDataServers: (0, $7dd5bf9323d2d9c1$export$2e2bcd8739ae039)(originalConfig),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        fetch: waitForPrepareConfig((c: any) => (0, $22b4895a4ca7d626$export$2e2bcd8739ae039)(c.dataServers)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        ldoDataset: (0, $fj9kP$createLdoDataset)(),
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        uploadFile: waitForPrepareConfig((c: any) => (rawFile: any) => (0, $b17c43e3301545ca$export$a5575dbeeffdad98)(rawFile, c)),
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        expandTypes: waitForPrepareConfig((c: any) => (types: any) => (0, $36aa010ec46eaf45$export$2e2bcd8739ae039)(types, c.jsonContext)),
        getConfig: waitForPrepareConfig((c: any) => ()=>c),
        refreshConfig: async ()=>{
            config = {
                ...originalConfig
            };
            await prepareConfig();
            return config;
        }
    };
};
var $243bf28fbb1b868f$export$2e2bcd8739ae039 = $243bf28fbb1b868f$var$dataProvider;





const $861da9be2c0e62eb$var$getPrefixFromUri = (uri: any, ontologies: any)=>{
    for (const [prefix, namespace] of Object.entries(ontologies)){
        if (uri.startsWith(namespace)) return uri.replace(namespace, `${prefix}:`);
    }
    return uri;
};
var $861da9be2c0e62eb$export$2e2bcd8739ae039 = $861da9be2c0e62eb$var$getPrefixFromUri;




/**
 * Adds `dataServers.user` properties to configuration (baseUrl, sparqlEndpoint, proxyUrl, ...).
 */ const $cdd3c71a628eeefe$var$configureUserStorage = ()=>({
        transformConfig: async (config: any) => {
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const payload = (0, $fj9kP$jwtdecode)(token);
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
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
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        baseUrl: user['pim:storage'] || (0, $fj9kP$urljoin)(webId, 'data'),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        sparqlEndpoint: user.endpoints?.['void:sparqlEndpoint'] || (0, $fj9kP$urljoin)(webId, 'sparql'),
                        proxyUrl: user.endpoints?.proxyUrl,
                        containers: []
                    };
                    if (!newConfig.jsonContext) newConfig.jsonContext = [
                        'https://www.w3.org/ns/activitystreams',
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        (0, $fj9kP$urljoin)(new URL(webId).origin, '/.well-known/context.jsonld')
                    ];
                    return newConfig;
                }
            }
            // Nothing to change
            return config;
        }
    });
var $cdd3c71a628eeefe$export$2e2bcd8739ae039 = $cdd3c71a628eeefe$var$configureUserStorage;







const $d7a7484a035f15cd$var$getContainerFromDataRegistration = async (dataRegistrationUri: any, config: any)=>{
    const { json: dataRegistration } = await config.httpClient(dataRegistrationUri, {
        headers: new Headers({
            Accept: 'application/ld+json',
            Prefer: 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
        })
    });
    const shapeTreeUri = dataRegistration['interop:registeredShapeTree'];
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    let { json: shapeTree } = await (0, $fj9kP$fetchUtils).fetchJson(shapeTreeUri, {
        headers: new Headers({
            Accept: 'application/ld+json'
        })
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    shapeTree = await (0, $fj9kP$jsonld).compact(shapeTree, {
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
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const { json: shape } = await (0, $fj9kP$fetchUtils).fetchJson(shapeTree.shape, {
            headers: new Headers({
                Accept: 'application/ld+json'
            })
        });
        // @ts-expect-error TS(2339): Property 'types' does not exist on type '{ path: a... Remove this comment to see the full error message
        container.types = shape?.[0]?.['http://www.w3.org/ns/shacl#targetClass']?.map((node: any) => node?.['@id']);
    }
    return container;
};
var $d7a7484a035f15cd$export$2e2bcd8739ae039 = $d7a7484a035f15cd$var$getContainerFromDataRegistration;


/**
 * Return a function that look if an app (clientId) is registered with an user (webId)
 * If not, it redirects to the endpoint provided by the user's authorization agent
 * See https://solid.github.io/data-interoperability-panel/specification/#authorization-agent
 */ const $2c257b4237cb14ca$var$fetchAppRegistration = ()=>({
        transformConfig: async (config: any) => {
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const payload = (0, $fj9kP$jwtdecode)(token);
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                const authAgentUri = user['interop:hasAuthorizationAgent'];
                if (authAgentUri) {
                    // Find if an application registration is linked to this user
                    // See https://solid.github.io/data-interoperability-panel/specification/#agent-registration-discovery
                    const { headers: headers } = await config.httpClient(authAgentUri);
                    if (headers.has('Link')) {
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        const linkHeader = (0, $fj9kP$httplinkheader).parse(headers.get('Link'));
                        const registeredAgentLinkHeader = linkHeader.rel('http://www.w3.org/ns/solid/interop#registeredAgent');
                        if (registeredAgentLinkHeader.length > 0) {
                            const appRegistrationUri = registeredAgentLinkHeader[0].anchor;
                            const { json: appRegistration } = await config.httpClient(appRegistrationUri);
                            const newConfig = {
                                ...config
                            };
                            // Load data grants concurrently to improve performances
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            const results = await Promise.all((0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(appRegistration['interop:hasAccessGrant']).map(async (accessGrantUri)=>{
                                const { json: accessGrant } = await config.httpClient(accessGrantUri);
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                return Promise.all((0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(accessGrant['interop:hasDataGrant']).map(async (dataGrantUri)=>{
                                    const { json: dataGrant } = await config.httpClient(dataGrantUri);
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    return (0, $d7a7484a035f15cd$export$2e2bcd8739ae039)(dataGrant['interop:hasDataRegistration'], config);
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
var $2c257b4237cb14ca$export$2e2bcd8739ae039 = $2c257b4237cb14ca$var$fetchAppRegistration;




/**
 * Plugin to add data registrations to the user containers, by fetching the registry set.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */ const $91255e144bb55afc$var$fetchDataRegistry = ()=>({
        transformConfig: async (config: any) => {
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                if (!config.dataServers.user) throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const payload = (0, $fj9kP$jwtdecode)(token);
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                const { json: registrySet } = await config.httpClient(user['interop:hasRegistrySet']);
                const { json: dataRegistry } = await config.httpClient(registrySet['interop:hasDataRegistry']);
                if (dataRegistry['interop:hasDataRegistration']) {
                    const results = await Promise.all(dataRegistry['interop:hasDataRegistration'].map((dataRegistrationUri: any) => {
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        return (0, $d7a7484a035f15cd$export$2e2bcd8739ae039)(dataRegistrationUri, config);
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
var $91255e144bb55afc$export$2e2bcd8739ae039 = $91255e144bb55afc$var$fetchDataRegistry;






/**
 * Plugin to add type indexes to the user containers, by fetching the them.
 *
 * Requires the `configureUserStorage` plugin.
 *
 * @returns {Configuration} The configuration with the data registrations added to `dataServers.user.containers`
 */ const $2d5f75df63129ebc$var$fetchTypeIndexes = ()=>({
        transformConfig: async (config: any) => {
            const token = localStorage.getItem('token');
            // If the user is logged in
            if (token) {
                if (!config.dataServers.user) throw new Error(`You must configure the user storage first with the configureUserStorage plugin`);
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const payload = (0, $fj9kP$jwtdecode)(token);
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                const { json: user } = await config.httpClient(webId);
                const typeRegistrations = {
                    public: [],
                    private: []
                };
                if (user['solid:publicTypeIndex']) {
                    const { json: publicTypeIndex } = await config.httpClient(user['solid:publicTypeIndex']);
                    // @ts-expect-error TS(2322): Type 'any[]' is not assignable to type 'never[]'.
                    if (publicTypeIndex) typeRegistrations.public = (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(publicTypeIndex['solid:hasTypeRegistration']);
                }
                if (user['pim:preferencesFile']) {
                    const { json: preferencesFile } = await config.httpClient(user['pim:preferencesFile']);
                    if (preferencesFile?.['solid:privateTypeIndex']) {
                        const { json: privateTypeIndex } = await config.httpClient(preferencesFile['solid:privateTypeIndex']);
                        // @ts-expect-error TS(2322): Type 'any[]' is not assignable to type 'never[]'.
                        typeRegistrations.private = (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(privateTypeIndex['solid:hasTypeRegistration']);
                    }
                }
                if (typeRegistrations.public.length > 0 || typeRegistrations.private.length > 0) {
                    const newConfig = {
                        ...config
                    };
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    for (const mode of Object.keys(typeRegistrations))for (const typeRegistration of typeRegistrations[mode]){
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        const types = (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(typeRegistration['solid:forClass']);
                        const container = {
                            label: {
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                en: (0, $fj9kP$capitalCase)(types[0].split(':')[1], {
                                    separateNumbers: true
                                })
                            },
                            path: typeRegistration['solid:instanceContainer'].replace(newConfig.dataServers.user.baseUrl, ''),
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            types: await (0, $36aa010ec46eaf45$export$2e2bcd8739ae039)(types, user['@context']),
                            private: mode === 'private'
                        };
                        const containerIndex = newConfig.dataServers.user.containers.findIndex((c: any) => c.path === container.path);
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
var $2d5f75df63129ebc$export$2e2bcd8739ae039 = $2d5f75df63129ebc$var$fetchTypeIndexes;




const $a87fd63d8fca0380$var$fetchVoidEndpoints = ()=>({
        transformConfig: async (config: any) => {
            let results = [];
            try {
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                results = await Promise.all(Object.entries(config.dataServers).filter(([_, server])=>server.pod !== true && server.void !== false).map(async ([key, server])=>config.httpClient(new URL('/.well-known/void', server.baseUrl).toString()).then((result: any) => ({
                    key: key,
                    context: result.json?.['@context'],
                    datasets: result.json?.['@graph']
                })).catch((e: any) => {
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
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        for (const partition of (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(dataset['void:classPartition']))for (const type of (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(partition['void:class'])){
                            const path = partition['void:uriSpace'].replace(dataset['void:uriSpace'], '/');
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            const expandedTypes = await (0, $36aa010ec46eaf45$export$2e2bcd8739ae039)([
                                type
                            ], result.context);
                            const containerIndex = newConfig.dataServers[result.key].containers.findIndex((c: any) => c.path === path);
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
var $a87fd63d8fca0380$export$2e2bcd8739ae039 = $a87fd63d8fca0380$var$fetchVoidEndpoints;





const $3677b4de74c3d10d$var$useDataProviderConfig = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $fj9kP$useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [config, setConfig] = (0, $fj9kP$useState)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [isLoading, setIsLoading] = (0, $fj9kP$useState)(false);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $fj9kP$useEffect)(()=>{
        if (!isLoading && !config) {
            setIsLoading(true);
            dataProvider.getConfig().then((c: any) => {
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
var $3677b4de74c3d10d$export$2e2bcd8739ae039 = $3677b4de74c3d10d$var$useDataProviderConfig;



const $52b38c5b114c348c$var$compactPredicate = async (predicate: any, context: any)=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const result = await (0, $fj9kP$jsonld).compact({
        [predicate]: ''
    }, context);
    return Object.keys(result).find((key)=>key !== '@context');
};
var $52b38c5b114c348c$export$2e2bcd8739ae039 = $52b38c5b114c348c$var$compactPredicate;


const $72db0904d77f0f1e$var$useCompactPredicate = (predicate: any, context: any)=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const config = (0, $3677b4de74c3d10d$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [result, setResult] = (0, $fj9kP$useState)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $fj9kP$useEffect)(()=>{
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        if (config && predicate) (0, $52b38c5b114c348c$export$2e2bcd8739ae039)(predicate, context || config.jsonContext).then((r)=>{
            // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
var $72db0904d77f0f1e$export$2e2bcd8739ae039 = $72db0904d77f0f1e$var$useCompactPredicate;




const $3a9656756670cb78$var$useDataModels = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const config = (0, $3677b4de74c3d10d$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2339): Property 'resources' does not exist on type 'never... Remove this comment to see the full error message
    return config?.resources;
};
var $3a9656756670cb78$export$2e2bcd8739ae039 = $3a9656756670cb78$var$useDataModels;



const $4daf4cf698ee4eed$var$useDataServers = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const config = (0, $3677b4de74c3d10d$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2339): Property 'dataServers' does not exist on type 'nev... Remove this comment to see the full error message
    return config?.dataServers;
};
var $4daf4cf698ee4eed$export$2e2bcd8739ae039 = $4daf4cf698ee4eed$var$useDataServers;





const $586fa0ea9d02fa12$var$useContainers = (resourceId: any, serverKeys: any)=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataModels = (0, $3a9656756670cb78$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [containers, setContainers] = (0, $fj9kP$useState)([]);
    // Warning: if serverKeys change, the containers list will not be updated (otherwise we have an infinite re-render loop)
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $fj9kP$useEffect)(()=>{
        if (dataServers && dataModels) {
            if (resourceId) {
                const dataModel = dataModels[resourceId];
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                setContainers((0, $15b841e67a1ba752$export$2e2bcd8739ae039)((0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(dataModel.types), serverKeys, dataServers));
            } else {
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const parsedServerKeys = (0, $99cc2e4a2a3c100b$export$2e2bcd8739ae039)(serverKeys || '@all', dataServers);
                // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
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
var $586fa0ea9d02fa12$export$2e2bcd8739ae039 = $586fa0ea9d02fa12$var$useContainers;







const $9d2c669bd52faa31$var$useContainersByTypes = (types: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $fj9kP$useDataProvider)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [containers, setContainers] = (0, $fj9kP$useState)([]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $fj9kP$useEffect)(()=>{
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        if (dataServers && types) dataProvider.expandTypes((0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(types)).then((expandedTypes: any) => {
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            setContainers((0, $15b841e67a1ba752$export$2e2bcd8739ae039)(expandedTypes, '@all', dataServers));
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
var $9d2c669bd52faa31$export$2e2bcd8739ae039 = $9d2c669bd52faa31$var$useContainersByTypes;




const $43097d0b613bd4db$var$useContainerByUri = (containerUri: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [container, setContainer] = (0, $fj9kP$useState)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $fj9kP$useEffect)(()=>{
        if (dataServers && containerUri) Object.keys(dataServers).forEach((serverKey)=>{
            dataServers[serverKey].containers?.forEach((c: any) => {
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
var $43097d0b613bd4db$export$2e2bcd8739ae039 = $43097d0b613bd4db$var$useContainerByUri;





const $7d9911a250866af6$var$findCreateContainerWithTypes = (types: any, createServerKey: any, dataServers: any)=>{
    if (!dataServers[createServerKey].containers) throw new Error(`Data server ${createServerKey} has no declared containers`);
    const matchingContainers = dataServers[createServerKey].containers.filter((container: any) => container.types?.some((t: any) => types.includes(t)));
    if (matchingContainers.length === 0) throw new Error(`No container found matching with types ${JSON.stringify(types)}. You can set explicitly the create.container property of the resource.`);
    else if (matchingContainers.length > 1) throw new Error(`More than one container found matching with types ${JSON.stringify(types)}. You must set the create.server or create.container property for the resource.`);
    return matchingContainers[0].uri;
};
var $7d9911a250866af6$export$2e2bcd8739ae039 = $7d9911a250866af6$var$findCreateContainerWithTypes;




const $8dbb0c8c3814e663$var$useGetCreateContainerUri = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataModels = (0, $3a9656756670cb78$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const getCreateContainerUri = (0, $fj9kP$useCallback)((resourceId: any) => {
        if (!dataModels || !dataServers || !dataModels[resourceId]) return undefined;
        const dataModel = dataModels[resourceId];
        if (dataModel.create?.container) return dataModel.create.container;
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        else if (dataModel.create?.server) return (0, $7d9911a250866af6$export$2e2bcd8739ae039)(dataModel.types, dataModel.create.server, dataServers);
        else {
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const defaultServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)('default', dataServers);
            if (!defaultServerKey) throw new Error(`No default dataServer found. You can set explicitly one setting the "default" attribute to true`);
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return (0, $7d9911a250866af6$export$2e2bcd8739ae039)(dataModel.types, defaultServerKey, dataServers);
        }
    }, [
        dataModels,
        dataServers
    ]);
    return getCreateContainerUri;
};
var $8dbb0c8c3814e663$export$2e2bcd8739ae039 = $8dbb0c8c3814e663$var$useGetCreateContainerUri;


const $35f3e75c86e51f35$var$useCreateContainerUri = (resourceId: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const getCreateContainerUri = (0, $8dbb0c8c3814e663$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const createContainerUri = (0, $fj9kP$useMemo)(()=>getCreateContainerUri(resourceId), [
        getCreateContainerUri,
        resourceId
    ]);
    return createContainerUri;
};
var $35f3e75c86e51f35$export$2e2bcd8739ae039 = $35f3e75c86e51f35$var$useCreateContainerUri;



const $e5a0eacd756fd1d5$var$useDataModel = (resourceId: any) => {
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const config = (0, $3677b4de74c3d10d$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2339): Property 'resources' does not exist on type 'never... Remove this comment to see the full error message
    return config?.resources[resourceId];
};
var $e5a0eacd756fd1d5$export$2e2bcd8739ae039 = $e5a0eacd756fd1d5$var$useDataModel;








const $87656edf926c0f1f$var$compute = (externalLinks: any, record: any)=>typeof externalLinks === 'function' ? externalLinks(record) : externalLinks;
const $87656edf926c0f1f$var$isURL = (url: any) => typeof url === 'string' && url.startsWith('http');
const $87656edf926c0f1f$var$useGetExternalLink = (componentExternalLinks: any) => {
    // Since the externalLinks config is defined only locally, we don't need to wait for VOID endpoints fetching
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const dataProvider = (0, $fj9kP$useContext)((0, $fj9kP$DataProviderContext));
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const dataServers = dataProvider.getLocalDataServers();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const serversExternalLinks = (0, $fj9kP$useMemo)(()=>{
        if (dataServers) return Object.fromEntries(Object.values(dataServers).map((server)=>{
            // If externalLinks is not defined in the data server, use external links for non-default servers
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            const externalLinks = server.externalLinks !== undefined ? server.externalLinks : !server.default;
            return [
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                server.baseUrl,
                externalLinks
            ];
        }));
    }, [
        dataServers
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return (0, $fj9kP$useCallback)((record: any) => {
        const computedComponentExternalLinks = $87656edf926c0f1f$var$compute(componentExternalLinks, record);
        // If the component explicitly asks not to display as external links, use an internal link
        if (computedComponentExternalLinks === false) return false;
        if (!record?.id) return false;
        const serverBaseUrl = Object.keys(serversExternalLinks).find((baseUrl)=>record?.id.startsWith(baseUrl));
        // If no matching data servers could be found, assume we have an internal link
        if (!serverBaseUrl) return false;
        const computedServerExternalLinks = $87656edf926c0f1f$var$compute(serversExternalLinks[serverBaseUrl], record);
        // If the data server explicitly asks not to display as external links, use an internal link
        if (computedServerExternalLinks === false) return false;
        if ($87656edf926c0f1f$var$isURL(computedComponentExternalLinks)) return computedComponentExternalLinks;
        if ($87656edf926c0f1f$var$isURL(computedServerExternalLinks)) return computedServerExternalLinks;
        return record.id;
    }, [
        serversExternalLinks,
        componentExternalLinks
    ]);
};
var $87656edf926c0f1f$export$2e2bcd8739ae039 = $87656edf926c0f1f$var$useGetExternalLink;





const $487567a146508c4e$var$useGetPrefixFromUri = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const config = (0, $3677b4de74c3d10d$export$2e2bcd8739ae039)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return (0, $fj9kP$useCallback)((uri: any) => (0, $861da9be2c0e62eb$export$2e2bcd8739ae039)(uri, config.ontologies), [
        // @ts-expect-error TS(2339): Property 'ontologies' does not exist on type 'neve... Remove this comment to see the full error message
        config?.ontologies
    ]);
};
var $487567a146508c4e$export$2e2bcd8739ae039 = $487567a146508c4e$var$useGetPrefixFromUri;




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
 // @ts-expect-error TS(7031): Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
 */ const $406574efa35ec6f1$var$FilterHandler = ({ children: children, record: record, filter: filter, source: source, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [filtered, setFiltered] = (0, $fj9kP$useState)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $fj9kP$useEffect)(()=>{
        if (record && source && Array.isArray(record?.[source])) {
            const filteredData = record?.[source].filter((r: any) => {
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
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$Fragment), {
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: (0, $fj9kP$react).Children.map(children, (child, i)=>{
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return /*#__PURE__*/ (0, $fj9kP$react).cloneElement(child, {
                ...otherProps,
                record: filtered,
                source: source
            });
        })
    });
};
var $406574efa35ec6f1$export$2e2bcd8739ae039 = $406574efa35ec6f1$var$FilterHandler;






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
 // @ts-expect-error TS(7031): Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
 */ const $1d8c1cbe606a94ae$var$GroupedReferenceHandler = ({ children: children, groupReference: groupReference, groupLabel: groupLabel, groupHeader: groupHeader, filterProperty: filterProperty, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $fj9kP$useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data } = (0, $fj9kP$useGetList)(groupReference);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$Fragment), {
        children: data?.map((data, index)=>{
            const filter = {};
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            filter[filterProperty] = data.id;
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            return /*#__PURE__*/ (0, $fj9kP$jsxs)((0, $fj9kP$Fragment), {
                children: [
                    groupHeader && groupHeader({
                        ...otherProps,
                        group: data
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $fj9kP$jsx)((0, $406574efa35ec6f1$export$2e2bcd8739ae039), {
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
var $1d8c1cbe606a94ae$export$2e2bcd8739ae039 = $1d8c1cbe606a94ae$var$GroupedReferenceHandler;






// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $6844bbce0ad66151$var$useReferenceInputStyles = (0, $fj9kP$muistylesmakeStyles)({
    form: {
        display: 'flex'
    },
    input: {
        paddingRight: '20px'
    }
});
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $6844bbce0ad66151$var$useHideInputStyles = (0, $fj9kP$muistylesmakeStyles)({
    root: {
        display: 'none'
    }
});
const $6844bbce0ad66151$var$ReificationArrayInput = (props: any) => {
    const { reificationClass: reificationClass, children: children, ...otherProps } = props;
    const flexFormClasses = $6844bbce0ad66151$var$useReferenceInputStyles();
    const hideInputStyles = $6844bbce0ad66151$var$useHideInputStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$ArrayInput), {
        ...otherProps,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $fj9kP$jsxs)((0, $fj9kP$SimpleFormIterator), {
            classes: {
                form: flexFormClasses.form
            },
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                (0, $fj9kP$react).Children.map(props.children, (child, i)=>{
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    return /*#__PURE__*/ (0, $fj9kP$react).cloneElement(child, {
                        className: flexFormClasses.input
                    });
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$TextInput), {
                    className: hideInputStyles.root,
                    source: "type",
                    initialValue: reificationClass
                })
            ]
        })
    });
};
var $6844bbce0ad66151$export$2e2bcd8739ae039 = $6844bbce0ad66151$var$ReificationArrayInput;



/**
 * Find the solid notification description resource for a given resource URI.
 */ const $03d52e691e8dc945$var$findDescriptionResource = async (authenticatedFetch: any, resourceUri: any)=>{
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
const $03d52e691e8dc945$export$3edfe18db119b920 = async (authenticatedFetch: any, resourceUri: any, options = {
    type: 'WebSocketChannel2023'
})=>{
    // @ts-expect-error TS(2339): Property 'closeAfter' does not exist on type '{ ty... Remove this comment to see the full error message
    const { type: type, closeAfter: closeAfter, startIn: startIn, rate: rate } = options;
    // @ts-expect-error TS(2339): Property 'startAt' does not exist on type '{ type:... Remove this comment to see the full error message
    let { startAt: startAt, endAt: endAt } = options;
    if (startIn && !startAt) startAt = new Date(Date.now() + startIn).toISOString();
    if (closeAfter && !endAt) endAt = new Date(Date.now() + closeAfter).toISOString();
    const descriptionResource = await $03d52e691e8dc945$var$findDescriptionResource(authenticatedFetch, resourceUri);
    // TODO: use a json-ld parser / ldo in the future for this...
    // Get solid notification subscription service for the given type.
    const subscriptionService = (await Promise.all(// Get the subscription service resources (that describe a channel type).
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(descriptionResource.subscription || descriptionResource['notify:subscription']).map(async (subscriptionServiceOrUri)=>{
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
const $03d52e691e8dc945$export$28772ab4c256e709 = async (authenticatedFetch: any, resourceUri: any, options: any)=>{
    const channel = await $03d52e691e8dc945$export$3edfe18db119b920(authenticatedFetch, resourceUri, options);
    const receiveFrom = channel.receiveFrom || channel['notify:receiveFrom'];
    return new WebSocket(receiveFrom);
};
const $03d52e691e8dc945$var$registeredWebSockets = new Map();
/**
 * @param authenticatedFetch A react admin fetch function.
 * @param resourceUri The resource to subscribe to
 * @param options Options to pass to @see createSolidNotificationChannel, if the channel does not exist yet.
 * @returns {WebSocket} A new or existing web socket that subscribed to the given resource.
 */ const $03d52e691e8dc945$export$8d60734939c59ced = async (authenticatedFetch: any, resourceUri: any, options = {
    type: 'WebSocketChannel2023',
    closeAfter: 3600000
})=>{
    const socket = $03d52e691e8dc945$var$registeredWebSockets.get(resourceUri);
    if (socket) // Will resolve or is resolved already.
    return socket;
    // Create a promise, to return immediately and set the sockets cache.
    // This prevents racing conditions that create multiple channels.
    const wsPromise = $03d52e691e8dc945$export$28772ab4c256e709(authenticatedFetch, resourceUri, {
        ...options,
        type: 'WebSocketChannel2023'
    }).then((ws)=>{
        // Remove the promise from the cache, if it closes.
        ws.addEventListener('close', (e)=>{
            $03d52e691e8dc945$var$registeredWebSockets.delete(resourceUri);
        });
        // Close the socket, if the endAt / closeAfter time is reached.
        // @ts-expect-error TS(2339): Property 'endAt' does not exist on type '{ type: s... Remove this comment to see the full error message
        const closeIn = options.closeAfter ?? (options.endAt && new Date(options.endAt).getTime() - Date.now());
        if (closeIn) setTimeout(()=>{
            ws.close();
        }, closeIn);
        return ws;
    });
    $03d52e691e8dc945$var$registeredWebSockets.set(resourceUri, wsPromise);
    return wsPromise;
};


var $11242e90250f263e$exports = {};
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */ 



export {$243bf28fbb1b868f$export$2e2bcd8739ae039 as dataProvider, $6cde9a8fbbde3ffb$export$2e2bcd8739ae039 as buildSparqlQuery, $865f630cc944e818$export$2e2bcd8739ae039 as buildBlankNodesQuery, $4872a1c30c1fc60e$export$2e2bcd8739ae039 as getUriFromPrefix, $861da9be2c0e62eb$export$2e2bcd8739ae039 as getPrefixFromUri, $cdd3c71a628eeefe$export$2e2bcd8739ae039 as configureUserStorage, $2c257b4237cb14ca$export$2e2bcd8739ae039 as fetchAppRegistration, $91255e144bb55afc$export$2e2bcd8739ae039 as fetchDataRegistry, $2d5f75df63129ebc$export$2e2bcd8739ae039 as fetchTypeIndexes, $a87fd63d8fca0380$export$2e2bcd8739ae039 as fetchVoidEndpoints, $72db0904d77f0f1e$export$2e2bcd8739ae039 as useCompactPredicate, $586fa0ea9d02fa12$export$2e2bcd8739ae039 as useContainers, $9d2c669bd52faa31$export$2e2bcd8739ae039 as useContainersByTypes, $43097d0b613bd4db$export$2e2bcd8739ae039 as useContainerByUri, $35f3e75c86e51f35$export$2e2bcd8739ae039 as useCreateContainerUri, $e5a0eacd756fd1d5$export$2e2bcd8739ae039 as useDataModel, $3a9656756670cb78$export$2e2bcd8739ae039 as useDataModels, $3677b4de74c3d10d$export$2e2bcd8739ae039 as useDataProviderConfig, $4daf4cf698ee4eed$export$2e2bcd8739ae039 as useDataServers, $8dbb0c8c3814e663$export$2e2bcd8739ae039 as useGetCreateContainerUri, $87656edf926c0f1f$export$2e2bcd8739ae039 as useGetExternalLink, $487567a146508c4e$export$2e2bcd8739ae039 as useGetPrefixFromUri, $406574efa35ec6f1$export$2e2bcd8739ae039 as FilterHandler, $1d8c1cbe606a94ae$export$2e2bcd8739ae039 as GroupedReferenceHandler, $6844bbce0ad66151$export$2e2bcd8739ae039 as ReificationArrayInput, $03d52e691e8dc945$export$28772ab4c256e709 as createWsChannel, $03d52e691e8dc945$export$8d60734939c59ced as getOrCreateWsChannel, $03d52e691e8dc945$export$3edfe18db119b920 as createSolidNotificationChannel};
//# sourceMappingURL=index.es.js.map
