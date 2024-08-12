import $fj9kP$urljoin from "url-join";
import $fj9kP$jsonld from "jsonld";
import $fj9kP$rdfjsdatamodel, {triple as $fj9kP$triple, variable as $fj9kP$variable, namedNode as $fj9kP$namedNode} from "@rdfjs/data-model";
import {Generator as $fj9kP$Generator} from "sparqljs";
import $fj9kP$cryptojsmd5 from "crypto-js/md5";
import $fj9kP$jwtdecode from "jwt-decode";
import {fetchUtils as $fj9kP$fetchUtils, DataProviderContext as $fj9kP$DataProviderContext, useDataProvider as $fj9kP$useDataProvider, useRecordContext as $fj9kP$useRecordContext, useGetList as $fj9kP$useGetList, ArrayInput as $fj9kP$ArrayInput, SimpleFormIterator as $fj9kP$SimpleFormIterator, TextInput as $fj9kP$TextInput} from "react-admin";
import $fj9kP$react, {useContext as $fj9kP$useContext, useMemo as $fj9kP$useMemo, useCallback as $fj9kP$useCallback, useState as $fj9kP$useState, useEffect as $fj9kP$useEffect} from "react";
import {jsx as $fj9kP$jsx, Fragment as $fj9kP$Fragment, jsxs as $fj9kP$jsxs} from "react/jsx-runtime";
import $fj9kP$muistylesmakeStyles from "@mui/styles/makeStyles";



const $336b7edf722fe53e$var$fetchResource = async (resourceUri, config)=>{
    const { httpClient: httpClient, jsonContext: jsonContext } = config;
    let { json: data } = await httpClient(resourceUri);
    if (!data) throw new Error(`Not a valid JSON: ${resourceUri}`);
    data.id = data.id || data["@id"];
    // We compact only if the context is different between the frontend and the middleware
    // TODO deep compare if the context is an object
    if (data["@context"] !== jsonContext) data = await (0, $fj9kP$jsonld).compact(data, jsonContext);
    return data;
};
var $336b7edf722fe53e$export$2e2bcd8739ae039 = $336b7edf722fe53e$var$fetchResource;


const $ed447224dd38ce82$var$getOneMethod = (config)=>async (resourceId, params)=>{
        const { resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
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



const $b17c43e3301545ca$var$isFile = (o)=>o?.rawFile && o.rawFile instanceof File;
const $b17c43e3301545ca$var$isFileToDelete = (o)=>o?.fileToDelete !== undefined && o?.fileToDelete !== null;
const $b17c43e3301545ca$var$getUploadsContainerUri = (config)=>{
    const serverKey = Object.keys(config.dataServers).find((key)=>config.dataServers[key].uploadsContainer);
    if (serverKey && config.dataServers[serverKey].uploadsContainer) return (0, $fj9kP$urljoin)(config.dataServers[serverKey].baseUrl, config.dataServers[serverKey].uploadsContainer);
    return null;
};
const $b17c43e3301545ca$var$uploadFile = async (rawFile, config)=>{
    const uploadsContainerUri = $b17c43e3301545ca$var$getUploadsContainerUri(config);
    if (!uploadsContainerUri) throw new Error("You must define an uploadsContainer in one of the server's configuration");
    const response = await config.httpClient(uploadsContainerUri, {
        method: "POST",
        body: rawFile,
        headers: new Headers({
            "Content-Type": rawFile.type
        })
    });
    if (response.status === 201) return response.headers.get("Location");
    return null;
};
const $b17c43e3301545ca$var$deleteFiles = async (filesToDelete, config)=>{
    return Promise.all(filesToDelete.map((file)=>config.httpClient(file, {
            method: "DELETE"
        })));
};
/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */ const $b17c43e3301545ca$var$uploadAllFiles = async (record, config)=>{
    const filesToDelete = [];
    const updatedRecord = {
        ...record
    };
    for (const property of Object.keys(record)){
        const value = record[property];
        if (Array.isArray(value)) for(let i = 0; i < value.length; i++){
            const itemValue = value[i];
            if ($b17c43e3301545ca$var$isFile(itemValue)) {
                if ($b17c43e3301545ca$var$isFileToDelete(itemValue)) filesToDelete.push(itemValue.fileToDelete);
                updatedRecord[property][i] = await $b17c43e3301545ca$var$uploadFile(itemValue.rawFile, config);
            } else if ($b17c43e3301545ca$var$isFileToDelete(itemValue)) {
                filesToDelete.push(itemValue.fileToDelete);
                updatedRecord[property][i] = null;
            }
        }
        else if ($b17c43e3301545ca$var$isFile(value)) {
            if ($b17c43e3301545ca$var$isFileToDelete(value)) filesToDelete.push(value.fileToDelete);
            updatedRecord[property] = await $b17c43e3301545ca$var$uploadFile(value.rawFile, config);
        } else if ($b17c43e3301545ca$var$isFileToDelete(value)) {
            filesToDelete.push(value.fileToDelete);
            updatedRecord[property] = null;
        }
    }
    return {
        updatedRecord: updatedRecord,
        filesToDelete: filesToDelete
    };
};
var $b17c43e3301545ca$export$2e2bcd8739ae039 = {
    upload: $b17c43e3301545ca$var$uploadAllFiles,
    delete: $b17c43e3301545ca$var$deleteFiles
};



const $8326b88c1a913ca9$var$getServerKeyFromType = (type, dataServers)=>{
    return Object.keys(dataServers).find((key)=>{
        return dataServers[key][type];
    });
};
var $8326b88c1a913ca9$export$2e2bcd8739ae039 = $8326b88c1a913ca9$var$getServerKeyFromType;


const $64441f6e76bd15b6$var$parseServerKey = (serverKey, dataServers)=>{
    switch(serverKey){
        case "@default":
            return (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("default", dataServers);
        case "@pod":
            return (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("pod", dataServers);
        case "@authServer":
            return (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("authServer", dataServers);
        default:
            return serverKey;
    }
};
// Return the list of servers keys in an array
// parsing keywords like @all, @default, @pod and @authServer
const $64441f6e76bd15b6$var$parseServerKeys = (serverKeys, dataServers)=>{
    if (Array.isArray(serverKeys)) {
        if (serverKeys.includes("@all")) return Object.keys(dataServers);
        return serverKeys.map((serverKey)=>$64441f6e76bd15b6$var$parseServerKey(serverKey, dataServers));
    }
    if (typeof serverKeys === "string") {
        if (serverKeys === "@all") return Object.keys(dataServers);
        if (serverKeys === "@remote") {
            const defaultServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("default", dataServers);
            return Object.keys(dataServers).filter((serverKey)=>serverKey !== defaultServerKey);
        }
        return [
            $64441f6e76bd15b6$var$parseServerKey(serverKeys, dataServers)
        ];
    }
    // If server key is empty
    return false;
};
var $64441f6e76bd15b6$export$2e2bcd8739ae039 = $64441f6e76bd15b6$var$parseServerKeys;


const $15b841e67a1ba752$var$findContainersWithTypes = (types, serverKeys, dataServers)=>{
    const containers = {};
    const existingContainers = [];
    const parsedServerKeys = (0, $64441f6e76bd15b6$export$2e2bcd8739ae039)(serverKeys, dataServers);
    Object.keys(dataServers).filter((dataServerKey)=>dataServers[dataServerKey].containers).forEach((dataServerKey)=>{
        Object.keys(dataServers[dataServerKey].containers || {}).forEach((containerKey)=>{
            if (!parsedServerKeys || parsedServerKeys.includes(containerKey)) Object.keys(dataServers[dataServerKey].containers[containerKey]).forEach((type)=>{
                if (types.includes(type)) dataServers[dataServerKey].containers[containerKey][type].map((path)=>{
                    const containerUri = (0, $fj9kP$urljoin)(dataServers[containerKey].baseUrl, path);
                    // Avoid returning the same container several times
                    if (!existingContainers.includes(containerUri)) {
                        existingContainers.push(containerUri);
                        if (!containers[dataServerKey]) containers[dataServerKey] = [];
                        containers[dataServerKey].push(containerUri);
                    }
                });
            });
        });
    });
    return containers;
};
var $15b841e67a1ba752$export$2e2bcd8739ae039 = $15b841e67a1ba752$var$findContainersWithTypes;


const $5a7a2f7583392866$var$createMethod = (config)=>async (resourceId, params)=>{
        const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);
        const headers = new Headers();
        let containerUri;
        let serverKey;
        if (dataModel.create?.container) {
            serverKey = Object.keys(dataModel.create.container)[0];
            containerUri = (0, $fj9kP$urljoin)(dataServers[serverKey].baseUrl, Object.values(dataModel.create.container)[0]);
        } else {
            serverKey = dataModel.create?.server || Object.keys(dataServers).find((key)=>dataServers[key].default === true);
            if (!serverKey) throw new Error("You must define a server for the creation, or a container, or a default server");
            const containers = (0, $15b841e67a1ba752$export$2e2bcd8739ae039)(dataModel.types, [
                serverKey
            ], dataServers);
            // Extract the containerUri from the results (and ensure there is only one)
            const serverKeys = Object.keys(containers);
            if (!serverKeys || serverKeys.length === 0) throw new Error(`No container with types ${JSON.stringify(dataModel.types)} found on server ${serverKey}`);
            if (serverKeys.length > 1 || containers[serverKeys[0]].length > 1) throw new Error(`More than one container detected with types ${JSON.stringify(dataModel.types)} on server ${serverKey}`);
            containerUri = containers[serverKeys[0]][0];
        }
        if (params.data) {
            if (dataModel.fieldsMapping?.title) {
                if (Array.isArray(dataModel.fieldsMapping.title)) headers.set("Slug", dataModel.fieldsMapping.title.map((f)=>params.data[f]).join(" "));
                else headers.set("Slug", params.data[dataModel.fieldsMapping.title]);
            }
            // Upload files, if there are any
            const { updatedRecord: updatedRecord } = await (0, $b17c43e3301545ca$export$2e2bcd8739ae039).upload(params.data, config);
            params.data = updatedRecord;
            const { headers: responseHeaders } = await httpClient(containerUri, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "@context": jsonContext,
                    "@type": dataModel.types,
                    ...params.data
                })
            });
            // Retrieve newly-created resource
            const resourceUri = responseHeaders.get("Location");
            return await (0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)(resourceId, {
                id: resourceUri
            });
        }
        if (params.id) {
            headers.set("Content-Type", "application/sparql-update");
            await httpClient(containerUri, {
                method: "PATCH",
                headers: headers,
                body: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { <${containerUri}> ldp:contains <${params.id}>. };
      `
            });
            // Create must return the new data, so get them from the remote URI
            return await (0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)(resourceId, {
                id: params.id
            });
        }
    };
var $5a7a2f7583392866$export$2e2bcd8739ae039 = $5a7a2f7583392866$var$createMethod;



const $9510970b8e7eb9e2$var$deleteMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        await httpClient(`${params.id}`, {
            method: "DELETE"
        });
        if (params.meta?.filesToDelete) await (0, $b17c43e3301545ca$export$2e2bcd8739ae039).delete(params.meta.filesToDelete, config);
        return {
            data: {
                id: params.id
            }
        };
    };
var $9510970b8e7eb9e2$export$2e2bcd8739ae039 = $9510970b8e7eb9e2$var$deleteMethod;


const $298dd1ae21173ea0$var$deleteManyMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        const ids = [];
        for (const id of params.ids)try {
            await httpClient(id, {
                method: "DELETE"
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


const $7dd5bf9323d2d9c1$var$getDataServers = (config)=>()=>{
        return config.dataServers;
    };
var $7dd5bf9323d2d9c1$export$2e2bcd8739ae039 = $7dd5bf9323d2d9c1$var$getDataServers;


const $54a3fa40eed06111$var$getDataModels = (config)=>()=>{
        return config.resources;
    };
var $54a3fa40eed06111$export$2e2bcd8739ae039 = $54a3fa40eed06111$var$getDataModels;




const $cc8adac4b83414eb$var$arrayOf = (value)=>{
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


const $aba124ea15ea8bc6$var$isValidLDPContainer = (container)=>{
    const resourceType = container.type || container["@type"];
    return Array.isArray(resourceType) ? resourceType.includes("ldp:Container") : resourceType === "ldp:Container";
};
const $aba124ea15ea8bc6$var$isObject = (val)=>{
    return val != null && typeof val === "object" && !Array.isArray(val);
};
const $aba124ea15ea8bc6$var$fetchContainers = async (containers, params, { httpClient: httpClient, jsonContext: jsonContext })=>{
    const containersUri = Object.values(containers).flat();
    const fetchPromises = containersUri.map((containerUri)=>httpClient(containerUri).then(async ({ json: json })=>{
            const jsonResponse = json;
            // If container's context is different, compact it to have an uniform result
            // TODO deep compare if the context is an object
            if (jsonResponse["@context"] !== jsonContext) return (0, $fj9kP$jsonld).compact(jsonResponse, jsonContext);
            return jsonResponse;
        }).then((json)=>{
            if (!$aba124ea15ea8bc6$var$isValidLDPContainer(json)) throw new Error(`${containerUri} is not a LDP container`);
            return (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(json["ldp:contains"]).map((resource)=>({
                    "@context": json["@context"],
                    ...resource
                }));
        }));
    // Fetch simultaneously all containers
    const results = await Promise.all(fetchPromises);
    let resources = results.flat();
    resources = resources.map((resource)=>{
        resource.id = resource.id || resource["@id"];
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
            "id"
        ];
        resources = resources.map((resource)=>{
            return Object.keys(resource).filter((key)=>predicates.includes(key) || mandatoryAttributes.includes(key)).reduce((filteredResource, key)=>{
                filteredResource[key] = resource[key];
                return filteredResource;
            }, {
                "@context": []
            });
        });
    }
    if (Object.keys(filters).filter((f)=>![
            "_predicates",
            "_servers"
        ].includes(f)).length > 0) resources = resources.filter((resource)=>{
        // Full text filtering
        if (filters.q) return Object.values(resource).some((attributeValue)=>{
            if (!$aba124ea15ea8bc6$var$isObject(attributeValue)) {
                const arrayValues = Array.isArray(attributeValue) ? attributeValue : [
                    attributeValue
                ];
                return arrayValues.some((value)=>{
                    if (typeof value === "string") return value.toLowerCase().normalize("NFD").includes(filters.q.toLowerCase().normalize("NFD"));
                    return false;
                });
            }
            return false;
        });
        // Attribute filtering
        const attributesFilters = Object.keys(filters).filter((f)=>![
                "_predicates",
                "_servers",
                "q"
            ].includes(f));
        return attributesFilters.every((attribute)=>{
            if (resource[attribute]) {
                const arrayValues = Array.isArray(resource[attribute]) ? resource[attribute] : [
                    resource[attribute]
                ];
                return arrayValues.some((value)=>typeof value === "string" && value.includes(filters[attribute]));
            }
            return false;
        });
    });
    // Sorting
    if (params.sort) resources = resources.sort((a, b)=>{
        if (a[params.sort.field] && b[params.sort.field]) {
            if (params.sort.order === "ASC") return a[params.sort.field].localeCompare(b[params.sort.field]);
            return b[params.sort.field].localeCompare(a[params.sort.field]);
        }
        return true;
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



const $3007d5479dd82d51$var$getEmbedFrame = (blankNodes)=>{
    let embedFrame = {};
    let predicates;
    if (blankNodes) {
        for (const blankNode of blankNodes){
            if (blankNode.includes("/")) predicates = blankNode.split("/").reverse();
            else predicates = [
                blankNode
            ];
            embedFrame = {
                ...embedFrame,
                ...predicates.reduce((accumulator, predicate)=>({
                        [predicate]: {
                            "@embed": "@last",
                            ...accumulator
                        }
                    }), {})
            };
        }
        return embedFrame;
    }
};
var $3007d5479dd82d51$export$2e2bcd8739ae039 = $3007d5479dd82d51$var$getEmbedFrame;




const $564e5d81f6496048$var$resolvePrefix = (item, ontologies)=>{
    if (item.startsWith("http://") || item.startsWith("https://")) // Already resolved, return the URI
    return item;
    if (item === "a") // Special case
    return "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    const [prefix, value] = item.split(":");
    if (value) {
        const ontology = ontologies.find((ontology)=>ontology.prefix === prefix);
        if (ontology) return ontology.url + value;
        throw new Error(`No ontology found with prefix ${prefix}`);
    } else throw new Error(`The value "${item}" is not correct. It must include a prefix or be a full URI.`);
};
var $564e5d81f6496048$export$2e2bcd8739ae039 = $564e5d81f6496048$var$resolvePrefix;


const $47d734d7812e6861$var$defaultToArray = (value)=>!value ? [] : Array.isArray(value) ? value : [
        value
    ];
// We need to always include the type or React-Admin will not work properly
const $47d734d7812e6861$var$typeQuery = (0, $fj9kP$triple)((0, $fj9kP$variable)("s1"), (0, $fj9kP$namedNode)("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), (0, $fj9kP$variable)("type"));
const $47d734d7812e6861$var$buildBaseQuery = (predicates, ontologies)=>{
    let baseTriples;
    if (predicates) {
        baseTriples = $47d734d7812e6861$var$defaultToArray(predicates).map((predicate, i)=>(0, $fj9kP$triple)((0, $fj9kP$variable)("s1"), (0, $fj9kP$namedNode)((0, $564e5d81f6496048$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $fj9kP$variable)(`o${i + 1}`)));
        return {
            construct: [
                $47d734d7812e6861$var$typeQuery,
                ...baseTriples
            ],
            where: [
                $47d734d7812e6861$var$typeQuery,
                ...baseTriples.map((triple)=>({
                        type: "optional",
                        patterns: [
                            triple
                        ]
                    }))
            ]
        };
    }
    baseTriples = [
        (0, $fj9kP$triple)((0, $fj9kP$variable)("s1"), (0, $fj9kP$variable)("p1"), (0, $fj9kP$variable)("o1"))
    ];
    return {
        construct: baseTriples,
        where: baseTriples
    };
};
var $47d734d7812e6861$export$2e2bcd8739ae039 = $47d734d7812e6861$var$buildBaseQuery;





// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const $865f630cc944e818$var$extractNodes = (blankNodes)=>{
    const nodes = [];
    if (blankNodes) {
        for (const predicate of blankNodes)if (predicate.includes("/")) {
            const nodeNames = predicate.split("/");
            for(let i = 1; i <= nodeNames.length; i++)nodes.push(nodeNames.slice(0, i).join("/"));
        } else nodes.push(predicate);
    }
    return nodes;
};
const $865f630cc944e818$var$generateSparqlVarName = (node)=>(0, $fj9kP$cryptojsmd5)(node);
const $865f630cc944e818$var$getParentNode = (node)=>node.includes("/") && node.split("/")[0];
const $865f630cc944e818$var$getPredicate = (node)=>node.includes("/") ? node.split("/")[1] : node;
const $865f630cc944e818$var$buildUnionQuery = (queries)=>queries.map((q)=>{
        let triples = q.query;
        const firstTriple = queries.find((q2)=>q.parentNode === q2.node);
        if (firstTriple !== undefined) triples = triples.concat(firstTriple.query[0]);
        return {
            type: "bgp",
            triples: triples
        };
    });
const $865f630cc944e818$var$buildBlankNodesQuery = (blankNodes, baseQuery, ontologies)=>{
    const queries = [];
    const nodes = $865f630cc944e818$var$extractNodes(blankNodes);
    if (nodes && ontologies && ontologies.length > 0) {
        for (const node of nodes){
            const parentNode = $865f630cc944e818$var$getParentNode(node);
            const predicate = $865f630cc944e818$var$getPredicate(node);
            const varName = $865f630cc944e818$var$generateSparqlVarName(node);
            const parentVarName = parentNode ? $865f630cc944e818$var$generateSparqlVarName(parentNode) : "1";
            const query = [
                (0, $fj9kP$triple)((0, $fj9kP$variable)(`s${parentVarName}`), (0, $fj9kP$namedNode)((0, $564e5d81f6496048$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $fj9kP$variable)(`s${varName}`)),
                (0, $fj9kP$triple)((0, $fj9kP$variable)(`s${varName}`), (0, $fj9kP$variable)(`p${varName}`), (0, $fj9kP$variable)(`o${varName}`))
            ];
            queries.push({
                node: node,
                parentNode: parentNode,
                query: query,
                filter: "" // `FILTER(isBLANK(?s${varName})) .`
            });
        }
        return {
            construct: queries.length > 0 ? queries.map((q)=>q.query).reduce((pre, cur)=>pre.concat(cur)) : null,
            where: {
                type: "union",
                patterns: [
                    baseQuery.where,
                    ...$865f630cc944e818$var$buildUnionQuery(queries)
                ]
            }
        };
    }
    return {
        construct: "",
        where: ""
    };
};
var $865f630cc944e818$export$2e2bcd8739ae039 = $865f630cc944e818$var$buildBlankNodesQuery;



const $efbe3fa6f1479c06$var$buildAutoDetectBlankNodesQuery = (depth, baseQuery)=>{
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
            construct.push((0, $fj9kP$triple)((0, $fj9kP$variable)(`o${i}`), (0, $fj9kP$variable)(`p${i + 1}`), (0, $fj9kP$variable)(`o${i + 1}`)));
            whereQueries.push([
                ...whereQueries[whereQueries.length - 1],
                {
                    type: "filter",
                    expression: {
                        type: "operation",
                        operator: "isblank",
                        args: [
                            (0, $fj9kP$variable)(`o${i}`)
                        ]
                    }
                },
                (0, $fj9kP$triple)((0, $fj9kP$variable)(`o${i}`), (0, $fj9kP$variable)(`p${i + 1}`), (0, $fj9kP$variable)(`o${i + 1}`))
            ]);
        }
        where = {
            type: "union",
            patterns: whereQueries
        };
    } else if (depth === 0) where = baseQuery.where;
    else throw new Error("The depth of buildAutoDetectBlankNodesQuery should be 0 or more");
    return {
        construct: construct,
        where: where
    };
};
var $efbe3fa6f1479c06$export$2e2bcd8739ae039 = $efbe3fa6f1479c06$var$buildAutoDetectBlankNodesQuery;




var $6cde9a8fbbde3ffb$require$SparqlGenerator = $fj9kP$Generator;
const { literal: $6cde9a8fbbde3ffb$var$literal, namedNode: $6cde9a8fbbde3ffb$var$namedNode, triple: $6cde9a8fbbde3ffb$var$triple, variable: $6cde9a8fbbde3ffb$var$variable } = (0, $fj9kP$rdfjsdatamodel);
const $6cde9a8fbbde3ffb$var$generator = new $6cde9a8fbbde3ffb$require$SparqlGenerator({
});
const $6cde9a8fbbde3ffb$var$reservedFilterKeys = [
    "q",
    "sparqlWhere",
    "blankNodes",
    "blankNodesDepth",
    "_servers",
    "_predicates"
];
const $6cde9a8fbbde3ffb$var$buildSparqlQuery = ({ containers: containers, params: params, dataModel: dataModel, ontologies: ontologies })=>{
    const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
    const predicates = params.filter?._predicates || dataModel.list?.predicates;
    const blankNodesDepth = params.filter?.blankNodesDepth ?? dataModel.list?.blankNodesDepth ?? 2;
    const filter = {
        ...dataModel.list?.filter,
        ...params.filter
    };
    const baseQuery = (0, $47d734d7812e6861$export$2e2bcd8739ae039)(predicates, ontologies);
    const sparqlJsParams = {
        queryType: "CONSTRUCT",
        template: baseQuery.construct,
        where: [],
        type: "query",
        prefixes: Object.fromEntries(ontologies.map((ontology)=>[
                ontology.prefix,
                ontology.url
            ]))
    };
    const containerWhere = [
        {
            type: "values",
            values: containers.map((containerUri)=>({
                    "?containerUri": $6cde9a8fbbde3ffb$var$namedNode(containerUri)
                }))
        },
        $6cde9a8fbbde3ffb$var$triple($6cde9a8fbbde3ffb$var$variable("containerUri"), $6cde9a8fbbde3ffb$var$namedNode("http://www.w3.org/ns/ldp#contains"), $6cde9a8fbbde3ffb$var$variable("s1")),
        {
            type: "filter",
            expression: {
                type: "operation",
                operator: "isiri",
                args: [
                    $6cde9a8fbbde3ffb$var$variable("s1")
                ]
            }
        }
    ];
    let resourceWhere = [];
    if (filter && Object.keys(filter).length > 0) {
        const hasSPARQLFilter = filter.sparqlWhere && Object.keys(filter.sparqlWhere).length > 0;
        const hasFullTextSearch = filter.q && filter.q.length > 0;
        if (hasSPARQLFilter) /*
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
      */ // initialize array in case of single value :
        [].concat(filter.sparqlWhere).forEach((sw)=>{
            resourceWhere.push(sw);
        });
        if (hasFullTextSearch) resourceWhere.push({
            type: "group",
            patterns: [
                {
                    queryType: "SELECT",
                    variables: [
                        $6cde9a8fbbde3ffb$var$variable("s1")
                    ],
                    where: [
                        $6cde9a8fbbde3ffb$var$triple($6cde9a8fbbde3ffb$var$variable("s1"), $6cde9a8fbbde3ffb$var$variable("p1"), $6cde9a8fbbde3ffb$var$variable("o1")),
                        {
                            type: "filter",
                            expression: {
                                type: "operation",
                                operator: "isliteral",
                                args: [
                                    $6cde9a8fbbde3ffb$var$variable("o1")
                                ]
                            }
                        },
                        {
                            type: "filter",
                            expression: {
                                type: "operation",
                                operator: "regex",
                                args: [
                                    {
                                        type: "operation",
                                        operator: "lcase",
                                        args: [
                                            {
                                                type: "operation",
                                                operator: "str",
                                                args: [
                                                    $6cde9a8fbbde3ffb$var$variable("o1")
                                                ]
                                            }
                                        ]
                                    },
                                    $6cde9a8fbbde3ffb$var$literal(filter.q.toLowerCase(), "", $6cde9a8fbbde3ffb$var$namedNode("http://www.w3.org/2001/XMLSchema#string"))
                                ]
                            }
                        }
                    ],
                    type: "query"
                }
            ]
        });
        // Other filters
        // SPARQL keyword a = filter based on the class of a resource (example => 'a': 'pair:OrganizationType')
        // Other filters are based on a value (example => 'petr:hasAudience': 'http://localhost:3000/audiences/tout-public')
        Object.entries(filter).forEach(([predicate, object])=>{
            if (!$6cde9a8fbbde3ffb$var$reservedFilterKeys.includes(predicate)) resourceWhere.unshift($6cde9a8fbbde3ffb$var$triple($6cde9a8fbbde3ffb$var$variable("s1"), $6cde9a8fbbde3ffb$var$namedNode((0, $564e5d81f6496048$export$2e2bcd8739ae039)(predicate, ontologies)), $6cde9a8fbbde3ffb$var$namedNode((0, $564e5d81f6496048$export$2e2bcd8739ae039)(object, ontologies))));
        });
    }
    // Blank nodes
    const blankNodesQuery = blankNodes ? (0, $865f630cc944e818$export$2e2bcd8739ae039)(blankNodes, baseQuery, ontologies) : (0, $efbe3fa6f1479c06$export$2e2bcd8739ae039)(blankNodesDepth, baseQuery);
    if (blankNodesQuery && blankNodesQuery.construct) {
        resourceWhere = resourceWhere.concat(blankNodesQuery.where);
        sparqlJsParams.template = sparqlJsParams.template.concat(blankNodesQuery.construct);
    } else resourceWhere.push(baseQuery.where);
    sparqlJsParams.where.push({
        type: "union",
        patterns: [
            containerWhere,
            {
                type: "graph",
                name: $6cde9a8fbbde3ffb$var$namedNode("http://semapps.org/mirror"),
                patterns: containerWhere
            }
        ]
    }, {
        type: "union",
        patterns: [
            resourceWhere,
            {
                type: "graph",
                name: $6cde9a8fbbde3ffb$var$namedNode("http://semapps.org/mirror"),
                patterns: resourceWhere
            }
        ]
    });
    return $6cde9a8fbbde3ffb$var$generator.stringify(sparqlJsParams);
};
var $6cde9a8fbbde3ffb$export$2e2bcd8739ae039 = $6cde9a8fbbde3ffb$var$buildSparqlQuery;


const $05a1b4063d50f1b7$var$compare = (a, b)=>{
    switch(typeof a){
        case "string":
            return a.localeCompare(b);
        case "number":
        case "bigint":
            return a - b;
        default:
            return 0;
    }
};
const $05a1b4063d50f1b7$var$fetchSparqlEndpoints = async (containers, resourceId, params, config)=>{
    const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext, ontologies: ontologies } = config;
    const dataModel = resources[resourceId];
    const sparqlQueryPromises = Object.keys(containers).map((serverKey)=>new Promise((resolve, reject)=>{
            const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
            // When the SPARQL request comes from the browser's URL, it comes as JSON string which must must be parsed
            if (params.filter?.sparqlWhere && (typeof params.filter.sparqlWhere === "string" || params.filter.sparqlWhere instanceof String)) params.filter.sparqlWhere = JSON.parse(decodeURIComponent(params.filter.sparqlWhere));
            const sparqlQuery = (0, $6cde9a8fbbde3ffb$export$2e2bcd8739ae039)({
                containers: containers[serverKey],
                params: params,
                dataModel: dataModel,
                ontologies: ontologies
            });
            httpClient(dataServers[serverKey].sparqlEndpoint, {
                method: "POST",
                body: sparqlQuery
            }).then(({ json: json })=>{
                // If we declared the blank nodes to dereference, embed only those blank nodes
                // This solve problems which can occur when same-type resources are embedded in other resources
                // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
                const frame = blankNodes && dataModel.list?.explicitEmbedOnFraming !== false ? {
                    "@context": jsonContext,
                    "@type": dataModel.types,
                    "@embed": "@never",
                    ...(0, $3007d5479dd82d51$export$2e2bcd8739ae039)(blankNodes)
                } : {
                    "@context": jsonContext,
                    "@type": dataModel.types
                };
                // omitGraph option force results to be in a @graph, even if we have a single result
                return (0, $fj9kP$jsonld).frame(json, frame, {
                    omitGraph: false
                });
            }).then((compactJson)=>{
                if (compactJson["@id"]) {
                    const { "@context": context, ...rest } = compactJson;
                    compactJson = {
                        "@context": context,
                        "@graph": [
                            rest
                        ]
                    };
                }
                resolve(compactJson["@graph"].map((resource)=>({
                        "@context": compactJson["@context"],
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
        item.id = item.id || item["@id"];
        return item;
    });
    // TODO sort and paginate the results in the SPARQL query to improve performances
    if (params.sort) returnData = returnData.sort((a, b)=>{
        if (a[params.sort.field] !== undefined && b[params.sort.field] !== undefined) {
            if (params.sort.order === "ASC") return $05a1b4063d50f1b7$var$compare(a[params.sort.field], b[params.sort.field]);
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



const $4a0be4f601906b75$var$findContainersWithPaths = (paths, dataServers)=>{
    const containers = {};
    Object.keys(paths).forEach((serverKey)=>{
        if (dataServers[serverKey]) {
            containers[serverKey] = [];
            paths[serverKey].forEach((path)=>{
                containers[serverKey].push((0, $fj9kP$urljoin)(dataServers[serverKey].baseUrl, path));
            });
        } else throw new Error(`No server found with key ${serverKey}`);
    });
    return containers;
};
var $4a0be4f601906b75$export$2e2bcd8739ae039 = $4a0be4f601906b75$var$findContainersWithPaths;


const $7add415f7ebb1122$var$getListMethod = (config)=>async (resourceId, params = {})=>{
        const { dataServers: dataServers, resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
        let containers;
        if (!params.filter?._servers && dataModel.list?.containers) {
            if (Array.isArray(dataModel.list?.containers)) throw new Error(`The list.containers property of ${resourceId} dataModel must be of type object ({ serverKey: [containerUri] })`);
            // If containers are set explicitly, use them
            containers = (0, $4a0be4f601906b75$export$2e2bcd8739ae039)(dataModel.list.containers, dataServers);
        } else // Otherwise find the container URIs on the given servers (either in the filter or the data model)
        containers = (0, $15b841e67a1ba752$export$2e2bcd8739ae039)(dataModel.types, params.filter?._servers || dataModel.list?.servers, dataServers);
        if (dataModel.list?.fetchContainer) return (0, $aba124ea15ea8bc6$export$2e2bcd8739ae039)(containers, params, config);
        return (0, $05a1b4063d50f1b7$export$2e2bcd8739ae039)(containers, resourceId, params, config);
    };
var $7add415f7ebb1122$export$2e2bcd8739ae039 = $7add415f7ebb1122$var$getListMethod;



const $f1e05270f9a21255$var$getManyMethod = (config)=>async (resourceId, params)=>{
        const { returnFailedResources: returnFailedResources } = config;
        let returnData = await Promise.all(params.ids.map((id)=>(0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)(resourceId, {
                id: typeof id === "object" ? id["@id"] : id
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



const $b5979a9678f57756$var$getManyReferenceMethod = (config)=>async (resourceId, params)=>{
        params.filter = {
            ...params.filter,
            [params.target]: params.id
        };
        delete params.target;
        return await (0, $7add415f7ebb1122$export$2e2bcd8739ae039)(config)(resourceId, params);
    };
var $b5979a9678f57756$export$2e2bcd8739ae039 = $b5979a9678f57756$var$getManyReferenceMethod;




const $cdfdce6efa87baab$var$generator = new (0, $fj9kP$Generator)();
const $cdfdce6efa87baab$var$patchMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        const sparqlUpdate = {
            type: "update",
            prefixes: {},
            updates: []
        };
        if (params.triplesToAdd) sparqlUpdate.updates.push({
            updateType: "insert",
            insert: [
                {
                    type: "bgp",
                    triples: params.triplesToAdd
                }
            ]
        });
        if (params.triplesToRemove) sparqlUpdate.updates.push({
            updateType: "delete",
            delete: [
                {
                    type: "bgp",
                    triples: params.triplesToRemove
                }
            ]
        });
        await httpClient(`${params.id}`, {
            method: "PATCH",
            headers: new Headers({
                "Content-Type": "application/sparql-update"
            }),
            body: $cdfdce6efa87baab$var$generator.stringify(sparqlUpdate)
        });
    };
var $cdfdce6efa87baab$export$2e2bcd8739ae039 = $cdfdce6efa87baab$var$patchMethod;



const $c5031381f4dfc62d$var$updateMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient, jsonContext: jsonContext } = config;
        // Upload files, if there are any
        const { updatedRecord: updatedRecord, filesToDelete: filesToDelete } = await (0, $b17c43e3301545ca$export$2e2bcd8739ae039).upload(params.data, config);
        params.data = updatedRecord;
        await httpClient(`${params.id}`, {
            method: "PUT",
            body: JSON.stringify({
                "@context": jsonContext,
                ...params.data
            })
        });
        // Delete files only if update is successful
        await (0, $b17c43e3301545ca$export$2e2bcd8739ae039).delete(filesToDelete, config);
        return {
            data: params.data
        };
    };
var $c5031381f4dfc62d$export$2e2bcd8739ae039 = $c5031381f4dfc62d$var$updateMethod;





const $81a8da127161495a$var$fetchUserConfig = async (config)=>{
    const { dataServers: dataServers, httpClient: httpClient } = config;
    const token = localStorage.getItem("token");
    const podKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("pod", dataServers);
    const authServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("authServer", dataServers);
    // If the user is logged in
    if (token) {
        const payload = (0, $fj9kP$jwtdecode)(token);
        const webId = payload.webId || payload.webid; // Currently we must deal with both formats
        let userData;
        try {
            const { json: json } = await httpClient(webId);
            userData = json;
        } catch (e) {
            console.error(e);
            // If the webId cannot be fetched, assume an invalid token and disconnect the user
            localStorage.clear();
            window.location.reload();
            return;
        }
        // If we have a POD server
        if (podKey) {
            // Fill the config provided to the data provider
            // We must modify the config object directly
            config.dataServers[podKey].name = "My Pod";
            config.dataServers[podKey].baseUrl = (0, $fj9kP$urljoin)(webId, "data"); // TODO find POD URI from user profile
            config.dataServers[podKey].sparqlEndpoint = userData.endpoints?.["void:sparqlEndpoint"] || (0, $fj9kP$urljoin)(webId, "sparql");
        }
        if (authServerKey) // Fill the config provided to the data provider
        // We must modify the config object directly
        config.dataServers[authServerKey].proxyUrl = userData.endpoints?.proxyUrl;
    } else if (podKey) // If the user is not logged in, ignore the POD server
    delete config.dataServers[podKey];
};
var $81a8da127161495a$export$2e2bcd8739ae039 = $81a8da127161495a$var$fetchUserConfig;


const $31a4627920feab4a$var$defaultToArray = (value)=>!value ? undefined : Array.isArray(value) ? value : [
        value
    ];
const $31a4627920feab4a$var$fetchVoidEndpoints = async (config)=>{
    const fetchPromises = Object.entries(config.dataServers).filter(([key, server])=>server.pod !== true && server.void !== false).map(([key, server])=>config.httpClient(new URL("/.well-known/void", server.baseUrl).toString()).then((result)=>({
                key: key,
                datasets: result.json["@graph"]
            })).catch((e)=>{
            if (e.status === 404 || e.status === 401 || e.status === 500) return {
                key: key,
                error: e
            };
            throw e;
        }));
    let results = [];
    try {
        results = await Promise.all(fetchPromises);
    } catch (e) {
    // Do not throw error if no endpoint found
    }
    for (const result of results){
        config.dataServers[result.key].containers = config.dataServers[result.key].containers || {};
        config.dataServers[result.key].blankNodes = config.dataServers[result.key].blankNodes || {};
        // Ignore unfetchable endpoints
        if (result.datasets) for (const dataset of result.datasets){
            const datasetServerKey = Object.keys(config.dataServers).find((key)=>dataset["void:uriSpace"] === config.dataServers[key].baseUrl);
            // If the dataset is not part of a server mapped in the dataServers, ignore it
            if (datasetServerKey) {
                // If this is the local dataset, add the base information
                if (datasetServerKey === result.key) {
                    config.dataServers[result.key].name = config.dataServers[result.key].name || dataset["dc:title"];
                    config.dataServers[result.key].description = config.dataServers[result.key].description || dataset["dc:description"];
                    config.dataServers[result.key].sparqlEndpoint = config.dataServers[result.key].sparqlEndpoint || dataset["void:sparqlEndpoint"];
                }
                config.dataServers[result.key].containers[datasetServerKey] = config.dataServers[result.key].containers[datasetServerKey] || {};
                for (const partition of $31a4627920feab4a$var$defaultToArray(dataset["void:classPartition"]))for (const type of $31a4627920feab4a$var$defaultToArray(partition["void:class"])){
                    // Set containers by type
                    const path = partition["void:uriSpace"].replace(dataset["void:uriSpace"], "/");
                    if (config.dataServers[result.key].containers[datasetServerKey][type]) config.dataServers[result.key].containers[datasetServerKey][type].push(path);
                    else config.dataServers[result.key].containers[datasetServerKey][type] = [
                        path
                    ];
                }
            }
        }
    }
};
var $31a4627920feab4a$export$2e2bcd8739ae039 = $31a4627920feab4a$var$fetchVoidEndpoints;




// Return the first server matching with the baseUrl
const $47e21ee81eed09a6$var$getServerKeyFromUri = (uri, dataServers)=>{
    if (!uri) throw Error(`No URI provided to getServerKeyFromUri`);
    return Object.keys(dataServers).find((key)=>{
        if (dataServers[key].pod) // The baseUrl ends with /data so remove this part to match with the webId and webId-related URLs (/inbox, /outbox...)
        return dataServers[key].baseUrl && uri.startsWith(dataServers[key].baseUrl.replace("/data", ""));
        return uri.startsWith(dataServers[key].baseUrl);
    });
};
var $47e21ee81eed09a6$export$2e2bcd8739ae039 = $47e21ee81eed09a6$var$getServerKeyFromUri;



/*
 * HTTP client used by all calls in data provider and auth provider
 * Do proxy calls if a proxy endpoint is available and the server is different from the auth server
 */ const $22b4895a4ca7d626$var$httpClient = (dataServers)=>(url, options = {})=>{
        const authServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("authServer", dataServers);
        const serverKey = (0, $47e21ee81eed09a6$export$2e2bcd8739ae039)(url, dataServers);
        const useProxy = serverKey !== authServerKey && dataServers[authServerKey]?.proxyUrl && dataServers[serverKey]?.noProxy !== true;
        if (!options.headers) options.headers = new Headers();
        switch(options.method){
            case "POST":
            case "PATCH":
            case "PUT":
                if (!options.headers.has("Accept")) options.headers.set("Accept", "application/ld+json");
                if (!options.headers.has("Content-Type")) options.headers.set("Content-Type", "application/ld+json");
                break;
            case "DELETE":
                break;
            case "GET":
            default:
                if (!options.headers.has("Accept")) options.headers.set("Accept", "application/ld+json");
                break;
        }
        if (useProxy) {
            const formData = new FormData();
            formData.append("id", url);
            formData.append("method", options.method || "GET");
            formData.append("headers", JSON.stringify(Object.fromEntries(options.headers.entries())));
            if (options.body) {
                if (options.body instanceof File) formData.append("body", options.body, options.body.name);
                else formData.append("body", options.body);
            }
            // Post to proxy endpoint with multipart/form-data format
            return (0, $fj9kP$fetchUtils).fetchJson(dataServers[authServerKey].proxyUrl, {
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }),
                body: formData
            });
        }
        // Add token if the server is the same as the auth server
        if (serverKey === authServerKey) {
            const token = localStorage.getItem("token");
            if (token) options.headers.set("Authorization", `Bearer ${token}`);
        }
        return (0, $fj9kP$fetchUtils).fetchJson(url, options);
    };
var $22b4895a4ca7d626$export$2e2bcd8739ae039 = $22b4895a4ca7d626$var$httpClient;


const $243bf28fbb1b868f$var$dataProvider = (config)=>{
    // TODO verify all data provider config + data models
    if (!(0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("default", config.dataServers)) throw new Error("You must define a default server in your dataServers config");
    if (!config.jsonContext) config.jsonContext = Object.fromEntries(config.ontologies.map((o)=>[
            o.prefix,
            o.url
        ]));
    if (!config.returnFailedResources) config.returnFailedResources = false;
    // Configure httpClient with data servers (this is needed for proxy calls)
    config.httpClient = (0, $22b4895a4ca7d626$export$2e2bcd8739ae039)(config.dataServers);
    // Keep in memory for refresh
    const originalConfig = {
        ...config
    };
    let fetchUserConfigPromise = (0, $81a8da127161495a$export$2e2bcd8739ae039)(config);
    let fetchVoidEndpointsPromise = (0, $31a4627920feab4a$export$2e2bcd8739ae039)(config);
    const waitForConfig = (method)=>async (...arg)=>{
            await fetchUserConfigPromise;
            await fetchVoidEndpointsPromise; // Return immediately if promise is fulfilled
            return await method(...arg);
        };
    return {
        getList: waitForConfig((0, $7add415f7ebb1122$export$2e2bcd8739ae039)(config)),
        getMany: waitForConfig((0, $f1e05270f9a21255$export$2e2bcd8739ae039)(config)),
        getManyReference: waitForConfig((0, $b5979a9678f57756$export$2e2bcd8739ae039)(config)),
        getOne: waitForConfig((0, $ed447224dd38ce82$export$2e2bcd8739ae039)(config)),
        create: waitForConfig((0, $5a7a2f7583392866$export$2e2bcd8739ae039)(config)),
        update: waitForConfig((0, $c5031381f4dfc62d$export$2e2bcd8739ae039)(config)),
        updateMany: ()=>{
            throw new Error("updateMany is not implemented yet");
        },
        delete: waitForConfig((0, $9510970b8e7eb9e2$export$2e2bcd8739ae039)(config)),
        deleteMany: waitForConfig((0, $298dd1ae21173ea0$export$2e2bcd8739ae039)(config)),
        // Custom methods
        patch: waitForConfig((0, $cdfdce6efa87baab$export$2e2bcd8739ae039)(config)),
        getDataModels: waitForConfig((0, $54a3fa40eed06111$export$2e2bcd8739ae039)(config)),
        getDataServers: waitForConfig((0, $7dd5bf9323d2d9c1$export$2e2bcd8739ae039)(config)),
        getLocalDataServers: (0, $7dd5bf9323d2d9c1$export$2e2bcd8739ae039)(config),
        fetch: waitForConfig(config.httpClient),
        refreshConfig: async ()=>{
            config = {
                ...originalConfig
            };
            fetchUserConfigPromise = (0, $81a8da127161495a$export$2e2bcd8739ae039)(config);
            fetchVoidEndpointsPromise = (0, $31a4627920feab4a$export$2e2bcd8739ae039)(config);
            await fetchUserConfigPromise;
            await fetchVoidEndpointsPromise;
            return config;
        }
    };
};
var $243bf28fbb1b868f$export$2e2bcd8739ae039 = $243bf28fbb1b868f$var$dataProvider;






const $87656edf926c0f1f$var$compute = (externalLinks, record)=>typeof externalLinks === "function" ? externalLinks(record) : externalLinks;
const $87656edf926c0f1f$var$isURL = (url)=>typeof url === "string" && url.startsWith("http");
const $87656edf926c0f1f$var$useGetExternalLink = (componentExternalLinks)=>{
    // Since the externalLinks config is defined only locally, we don't need to wait for VOID endpoints fetching
    const dataProvider = (0, $fj9kP$useContext)((0, $fj9kP$DataProviderContext));
    const dataServers = dataProvider.getLocalDataServers();
    const serversExternalLinks = (0, $fj9kP$useMemo)(()=>{
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
    return (0, $fj9kP$useCallback)((record)=>{
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





const $e5a0eacd756fd1d5$var$useDataModel = (resourceId)=>{
    // Get the raw data provider, since useDataProvider returns a wrapper
    const dataProvider = (0, $fj9kP$useContext)((0, $fj9kP$DataProviderContext));
    const [dataModel, setDataModel] = (0, $fj9kP$useState)(undefined); // TODO: Type this object
    (0, $fj9kP$useEffect)(()=>{
        dataProvider.getDataModels().then((results)=>setDataModel(results[resourceId]));
    }, [
        dataProvider,
        resourceId,
        setDataModel
    ]);
    return dataModel;
};
var $e5a0eacd756fd1d5$export$2e2bcd8739ae039 = $e5a0eacd756fd1d5$var$useDataModel;




const $4daf4cf698ee4eed$var$useDataServers = ()=>{
    const dataProvider = (0, $fj9kP$useDataProvider)();
    const [dataServers, setDataServers] = (0, $fj9kP$useState)();
    (0, $fj9kP$useEffect)(()=>{
        dataProvider.getDataServers().then((results)=>{
            setDataServers(results);
        });
    }, [
        dataProvider,
        setDataServers
    ]);
    return dataServers;
};
var $4daf4cf698ee4eed$export$2e2bcd8739ae039 = $4daf4cf698ee4eed$var$useDataServers;



const $586fa0ea9d02fa12$var$useContainers = (resourceId, serverKeys = "@all")=>{
    const dataModel = (0, $e5a0eacd756fd1d5$export$2e2bcd8739ae039)(resourceId);
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    const [containers, setContainers] = (0, $fj9kP$useState)();
    (0, $fj9kP$useEffect)(()=>{
        if (dataModel && dataServers) setContainers((0, $15b841e67a1ba752$export$2e2bcd8739ae039)(dataModel.types, serverKeys, dataServers));
    }, [
        dataModel,
        dataServers,
        serverKeys
    ]);
    return containers;
};
var $586fa0ea9d02fa12$export$2e2bcd8739ae039 = $586fa0ea9d02fa12$var$useContainers;







const $7d9911a250866af6$var$findCreateContainerWithTypes = (types, createServerKey, dataServers)=>{
    const containers = [];
    Object.keys(dataServers[createServerKey].containers?.[createServerKey] || {}).forEach((type)=>{
        if (types.includes(type)) dataServers[createServerKey].containers[createServerKey][type].forEach((path)=>{
            const containerUri = (0, $fj9kP$urljoin)(dataServers[createServerKey].baseUrl, path);
            if (!containers.includes(containerUri)) containers.push(containerUri);
        });
    });
    if (containers.length === 0) throw new Error(`No container found matching with types ${JSON.stringify(types)}. You can set explicitely the create.container property of the resource.`);
    else if (containers.length > 1) throw new Error(`More than one container found matching with types ${JSON.stringify(types)}. You must set the create.server or create.container property for the resource.`);
    return containers[0];
};
var $7d9911a250866af6$export$2e2bcd8739ae039 = $7d9911a250866af6$var$findCreateContainerWithTypes;



/** @deprecated Use "useCreateContainerUri" instead */ const $7bd037d7ec9d51f8$var$useCreateContainer = (resourceId)=>{
    const dataModel = (0, $e5a0eacd756fd1d5$export$2e2bcd8739ae039)(resourceId);
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    const [createContainer, setCreateContainer] = (0, $fj9kP$useState)();
    (0, $fj9kP$useEffect)(()=>{
        if (dataModel && dataServers) {
            if (dataModel.create?.container) {
                const [serverKey, path] = Object.entries(dataModel.create.container)[0];
                if (!serverKey || !dataServers[serverKey]) throw new Error(`Wrong key for the dataModel.create.container config of resource ${resourceId}`);
                setCreateContainer((0, $fj9kP$urljoin)(dataServers[serverKey].baseUrl, path));
            } else if (dataModel.create?.server) setCreateContainer((0, $7d9911a250866af6$export$2e2bcd8739ae039)(dataModel.types, dataModel.create?.server, dataServers));
            else {
                const defaultServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("default", dataServers);
                setCreateContainer((0, $7d9911a250866af6$export$2e2bcd8739ae039)(dataModel.types, defaultServerKey, dataServers));
            }
        }
    }, [
        dataModel,
        dataServers,
        setCreateContainer
    ]);
    return createContainer;
};
var $7bd037d7ec9d51f8$export$2e2bcd8739ae039 = $7bd037d7ec9d51f8$var$useCreateContainer;









const $3a9656756670cb78$var$useDataModels = ()=>{
    const dataProvider = (0, $fj9kP$useDataProvider)();
    const [dataModels, setDataModels] = (0, $fj9kP$useState)();
    (0, $fj9kP$useEffect)(()=>{
        dataProvider.getDataModels().then((results)=>{
            setDataModels(results);
        });
    }, [
        dataProvider,
        setDataModels
    ]);
    return dataModels;
};
var $3a9656756670cb78$export$2e2bcd8739ae039 = $3a9656756670cb78$var$useDataModels;


const $35f3e75c86e51f35$var$useCreateContainerUri = ()=>{
    const dataModels = (0, $3a9656756670cb78$export$2e2bcd8739ae039)();
    const dataServers = (0, $4daf4cf698ee4eed$export$2e2bcd8739ae039)();
    const getContainerUri = (0, $fj9kP$useCallback)((resourceId)=>{
        if (!dataModels || !dataServers || !dataModels[resourceId]) return undefined;
        const dataModel = dataModels[resourceId];
        if (dataModel.create?.container) {
            const [serverKey, path] = Object.entries(dataModel.create.container)[0];
            if (!serverKey || !dataServers[serverKey]) throw new Error(`Wrong key for the dataModel.create.container config of resource ${resourceId}`);
            return (0, $fj9kP$urljoin)(dataServers[serverKey].baseUrl, path);
        }
        if (dataModel.create?.server) return (0, $7d9911a250866af6$export$2e2bcd8739ae039)(dataModel.types, dataModel.create?.server, dataServers);
        const defaultServerKey = (0, $8326b88c1a913ca9$export$2e2bcd8739ae039)("default", dataServers);
        if (!defaultServerKey) throw new Error(`No default dataServer found. You can set explicitly one setting the "default" attribute to true`);
        return (0, $7d9911a250866af6$export$2e2bcd8739ae039)(dataModel.types, defaultServerKey, dataServers);
    }, [
        dataModels,
        dataServers
    ]);
    return getContainerUri;
};
var $35f3e75c86e51f35$export$2e2bcd8739ae039 = $35f3e75c86e51f35$var$useCreateContainerUri;







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
 */ const $406574efa35ec6f1$var$FilterHandler = ({ children: children, record: record, filter: filter, source: source, ...otherProps })=>{
    const [filtered, setFiltered] = (0, $fj9kP$useState)();
    (0, $fj9kP$useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$Fragment), {
        children: (0, $fj9kP$react).Children.map(children, (child, i)=>{
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
 */ const $1d8c1cbe606a94ae$var$GroupedReferenceHandler = ({ children: children, groupReference: groupReference, groupLabel: groupLabel, groupHeader: groupHeader, filterProperty: filterProperty, ...otherProps })=>{
    const record = (0, $fj9kP$useRecordContext)();
    const { data: data } = (0, $fj9kP$useGetList)(groupReference);
    return /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$Fragment), {
        children: data?.map((data, index)=>{
            const filter = {};
            filter[filterProperty] = data.id;
            return /*#__PURE__*/ (0, $fj9kP$jsxs)((0, $fj9kP$Fragment), {
                children: [
                    groupHeader && groupHeader({
                        ...otherProps,
                        group: data
                    }),
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






const $6844bbce0ad66151$var$useReferenceInputStyles = (0, $fj9kP$muistylesmakeStyles)({
    form: {
        display: "flex"
    },
    input: {
        paddingRight: "20px"
    }
});
const $6844bbce0ad66151$var$useHideInputStyles = (0, $fj9kP$muistylesmakeStyles)({
    root: {
        display: "none"
    }
});
const $6844bbce0ad66151$var$ReificationArrayInput = (props)=>{
    const { reificationClass: reificationClass, children: children, ...otherProps } = props;
    const flexFormClasses = $6844bbce0ad66151$var$useReferenceInputStyles();
    const hideInputStyles = $6844bbce0ad66151$var$useHideInputStyles();
    return /*#__PURE__*/ (0, $fj9kP$jsx)((0, $fj9kP$ArrayInput), {
        ...otherProps,
        children: /*#__PURE__*/ (0, $fj9kP$jsxs)((0, $fj9kP$SimpleFormIterator), {
            classes: {
                form: flexFormClasses.form
            },
            children: [
                (0, $fj9kP$react).Children.map(props.children, (child, i)=>{
                    return /*#__PURE__*/ (0, $fj9kP$react).cloneElement(child, {
                        className: flexFormClasses.input
                    });
                }),
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
 */ const $03d52e691e8dc945$var$findDescriptionResource = async (fetch, resourceUri)=>{
    const { headers: headers } = await fetch(resourceUri, {
        method: "HEAD"
    });
    const linkHeader = headers.get("Link");
    const matches = linkHeader?.match(/<([^>]+)>;\s*rel="(?:describedby|http:\/\/www\.w3\.org\/ns\/solid\/terms#storageDescription)"/);
    if (!matches?.[1]) return undefined;
    const { json: descriptionResource } = await fetch(matches[1]);
    return descriptionResource;
};
const $03d52e691e8dc945$export$3edfe18db119b920 = async (fetch, resourceUri, options = {
    type: "WebSocketChannel2023"
})=>{
    const { type: type, closeAfter: closeAfter, startIn: startIn, rate: rate } = options;
    let { startAt: startAt, endAt: endAt } = options;
    if (startIn && !startAt) startAt = new Date(Date.now() + startIn).toISOString();
    if (closeAfter && !endAt) endAt = new Date(Date.now() + closeAfter).toISOString();
    const descriptionResource = await $03d52e691e8dc945$var$findDescriptionResource(fetch, resourceUri);
    // TODO: use a json-ld parser / ldo in the future for this...
    // Get solid notification subscription service for the given type.
    const subscriptionService = (await Promise.all(// Get the subscription service resources (that describe a channel type).
    (0, $cc8adac4b83414eb$export$2e2bcd8739ae039)(descriptionResource.subscription || descriptionResource["notify:subscription"]).map(async (subscriptionServiceOrUri)=>{
        // They might not be resolved...
        if (typeof subscriptionServiceOrUri === "string") {
            const { json: json } = await fetch(subscriptionServiceOrUri);
            return json;
        }
        return subscriptionServiceOrUri;
    }))).find((service)=>{
        // Find for the correct channel type (e.g. web socket).
        const channelType = service.channelType ?? service["notify:channelType"];
        return channelType === type || channelType === `notify:${type}`;
    });
    if (!subscriptionService) throw new Error(`No solid notification subscription service found for type ${type}`);
    // Create a new channel.
    const { json: channel } = await fetch(subscriptionService.id || subscriptionService["@id"], {
        method: "POST",
        body: JSON.stringify({
            "@context": "https://www.w3.org/ns/solid/notification/v1",
            type: "WebSocketChannel2023",
            topic: resourceUri,
            startAt: startAt,
            endAt: endAt,
            rate: rate
        })
    });
    return channel;
};
const $03d52e691e8dc945$export$28772ab4c256e709 = async (fetch, resourceUri, options)=>{
    const channel = await $03d52e691e8dc945$export$3edfe18db119b920(fetch, resourceUri, options);
    const receiveFrom = channel.receiveFrom || channel["notify:receiveFrom"];
    return new WebSocket(receiveFrom);
};
const $03d52e691e8dc945$var$registeredWebSockets = new Map();
/**
 * @param fetch A react admin fetch function.
 * @param resourceUri The resource to subscribe to
 * @param options Options to pass to @see createSolidNotificationChannel, if the channel does not exist yet.
 * @returns {WebSocket} A new or existing web socket that subscribed to the given resource.
 */ const $03d52e691e8dc945$export$8d60734939c59ced = async (fetch, resourceUri, options = {
    type: "WebSocketChannel2023",
    closeAfter: 3600000
})=>{
    const socket = $03d52e691e8dc945$var$registeredWebSockets.get(resourceUri);
    if (socket) // Will resolve or is resolved already.
    return socket;
    // Create a promise, to return immediately and set the sockets cache.
    // This prevents racing conditions that create multiple channels.
    const wsPromise = $03d52e691e8dc945$export$28772ab4c256e709(fetch, resourceUri, {
        ...options,
        type: "WebSocketChannel2023"
    }).then((ws)=>{
        // Remove the promise from the cache, if it closes.
        ws.addEventListener("close", (e)=>{
            $03d52e691e8dc945$var$registeredWebSockets.delete(resourceUri);
        });
        // Close the socket, if the endAt / closeAfter time is reached.
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



export {$243bf28fbb1b868f$export$2e2bcd8739ae039 as dataProvider, $6cde9a8fbbde3ffb$export$2e2bcd8739ae039 as buildSparqlQuery, $865f630cc944e818$export$2e2bcd8739ae039 as buildBlankNodesQuery, $87656edf926c0f1f$export$2e2bcd8739ae039 as useGetExternalLink, $586fa0ea9d02fa12$export$2e2bcd8739ae039 as useContainers, $7bd037d7ec9d51f8$export$2e2bcd8739ae039 as useCreateContainer, $35f3e75c86e51f35$export$2e2bcd8739ae039 as useCreateContainerUri, $e5a0eacd756fd1d5$export$2e2bcd8739ae039 as useDataModel, $3a9656756670cb78$export$2e2bcd8739ae039 as useDataModels, $4daf4cf698ee4eed$export$2e2bcd8739ae039 as useDataServers, $406574efa35ec6f1$export$2e2bcd8739ae039 as FilterHandler, $1d8c1cbe606a94ae$export$2e2bcd8739ae039 as GroupedReferenceHandler, $6844bbce0ad66151$export$2e2bcd8739ae039 as ReificationArrayInput, $03d52e691e8dc945$export$28772ab4c256e709 as createWsChannel, $03d52e691e8dc945$export$8d60734939c59ced as getOrCreateWsChannel, $03d52e691e8dc945$export$3edfe18db119b920 as createSolidNotificationChannel};
//# sourceMappingURL=index.es.js.map
