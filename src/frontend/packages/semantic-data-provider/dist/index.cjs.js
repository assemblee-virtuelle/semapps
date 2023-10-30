var $bkNnK$urljoin = require("url-join");
var $bkNnK$jsonld = require("jsonld");
var $bkNnK$speakingurl = require("speakingurl");
var $bkNnK$isobject = require("isobject");
var $bkNnK$rdfjsdatamodel = require("@rdfjs/data-model");
var $bkNnK$sparqljs = require("sparqljs");
var $bkNnK$cryptojsmd5 = require("crypto-js/md5");
var $bkNnK$jwtdecode = require("jwt-decode");
var $bkNnK$reactadmin = require("react-admin");
var $bkNnK$react = require("react");
var $bkNnK$reactjsxruntime = require("react/jsx-runtime");
var $bkNnK$muistylesmakeStyles = require("@mui/styles/makeStyles");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "dataProvider", () => $7f6a16d0025dc83a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "buildSparqlQuery", () => $33c37185da3771a9$export$2e2bcd8739ae039);
$parcel$export(module.exports, "buildBlankNodesQuery", () => $64d4ce40c79d1509$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useGetExternalLink", () => $85e9a897c6d7c14a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useContainers", () => $c2f8a77958c288fd$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useCreateContainer", () => $99ed32cbdb76cb50$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataModel", () => $404991bb01c2ceff$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataModels", () => $8d622cbd05acb834$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useDataServers", () => $9b817943cd488c90$export$2e2bcd8739ae039);
$parcel$export(module.exports, "FilterHandler", () => $f763906f9b20f2d8$export$2e2bcd8739ae039);
$parcel$export(module.exports, "GroupedReferenceHandler", () => $b4703fef6d6af456$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReificationArrayInput", () => $030f1232f6810456$export$2e2bcd8739ae039);


const $3db7a4510a668a04$var$fetchResource = async (resourceUri, config)=>{
    const { httpClient: httpClient, jsonContext: jsonContext } = config;
    let { json: data } = await httpClient(resourceUri);
    if (!data) throw new Error(`Not a valid JSON: ${resourceUri}`);
    data.id = data.id || data["@id"];
    // We compact only if the context is different between the frontend and the middleware
    // TODO deep compare if the context is an object
    if (data["@context"] !== jsonContext) data = await (0, ($parcel$interopDefault($bkNnK$jsonld))).compact(data, jsonContext);
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




const $58dec60cb6361eb9$export$190bcb5b6b4f794f = (fileName)=>{
    let fileExtension = "";
    const splitFileName = fileName.split(".");
    if (splitFileName.length > 1) {
        fileExtension = splitFileName.pop();
        fileName = splitFileName.join(".");
    }
    return `${(0, ($parcel$interopDefault($bkNnK$speakingurl)))(fileName, {
        lang: "fr"
    })}.${fileExtension}`;
};
const $58dec60cb6361eb9$export$be78b3111c50efdd = (o)=>o?.rawFile && o.rawFile instanceof File;
const $58dec60cb6361eb9$var$getUploadsContainerUri = (config)=>{
    const serverKey = Object.keys(config.dataServers).find((key)=>config.dataServers[key].uploadsContainer);
    if (serverKey) return (0, ($parcel$interopDefault($bkNnK$urljoin)))(config.dataServers[serverKey].baseUrl, config.dataServers[serverKey].uploadsContainer);
};
const $58dec60cb6361eb9$var$uploadFile = async (rawFile, config)=>{
    const uploadsContainerUri = $58dec60cb6361eb9$var$getUploadsContainerUri(config);
    if (!uploadsContainerUri) throw new Error("You must define an uploadsContainer in one of the server's configuration");
    const response = await config.httpClient(uploadsContainerUri, {
        method: "POST",
        body: rawFile,
        headers: new Headers({
            // We must sluggify the file name, because we can't use non-ASCII characters in the header
            // However we keep the extension apart (if it exists) so that it is not replaced with a -
            // TODO let the middleware guess the extension based on the content type
            Slug: $58dec60cb6361eb9$export$190bcb5b6b4f794f(rawFile.name),
            "Content-Type": rawFile.type
        })
    });
    if (response.status === 201) return response.headers.get("Location");
};
/*
 * Look for raw files in the record data.
 * If there are any, upload them and replace the file by its URL.
 */ const $58dec60cb6361eb9$var$uploadAllFiles = async (record, config)=>{
    for(const property in record)if (Object.prototype.hasOwnProperty.call(record, property)) {
        if (Array.isArray(record[property])) {
            for(let i = 0; i < record[property].length; i++)if ($58dec60cb6361eb9$export$be78b3111c50efdd(record[property][i])) record[property][i] = await $58dec60cb6361eb9$var$uploadFile(record[property][i].rawFile, config);
        } else if ($58dec60cb6361eb9$export$be78b3111c50efdd(record[property])) record[property] = await $58dec60cb6361eb9$var$uploadFile(record[property].rawFile, config);
    }
    return record;
};
var $58dec60cb6361eb9$export$2e2bcd8739ae039 = $58dec60cb6361eb9$var$uploadAllFiles;



const $8f44b7c15b8b8e1d$var$getServerKeyFromType = (type, dataServers)=>{
    return Object.keys(dataServers).find((key)=>{
        return dataServers[key][type];
    });
};
var $8f44b7c15b8b8e1d$export$2e2bcd8739ae039 = $8f44b7c15b8b8e1d$var$getServerKeyFromType;


const $982f4f2fb185d606$var$parseServerKey = (serverKey, dataServers)=>{
    switch(serverKey){
        case "@default":
            return (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("default", dataServers);
        case "@pod":
            return (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("pod", dataServers);
        case "@authServer":
            return (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("authServer", dataServers);
        default:
            return serverKey;
    }
};
// Return the list of servers keys in an array
// parsing keywords like @all, @default, @pod and @authServer
const $982f4f2fb185d606$var$parseServerKeys = (serverKeys, dataServers)=>{
    if (Array.isArray(serverKeys)) {
        if (serverKeys.includes("@all")) return Object.keys(dataServers);
        return serverKeys.map((serverKey)=>$982f4f2fb185d606$var$parseServerKey(serverKey, dataServers));
    }
    if (typeof serverKeys === "string") {
        if (serverKeys === "@all") return Object.keys(dataServers);
        if (serverKeys === "@remote") {
            const defaultServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("default", dataServers);
            return Object.keys(dataServers).filter((serverKey)=>serverKey !== defaultServerKey);
        }
        return [
            $982f4f2fb185d606$var$parseServerKey(serverKeys, dataServers)
        ];
    }
    // If server key is empty
    return false;
};
var $982f4f2fb185d606$export$2e2bcd8739ae039 = $982f4f2fb185d606$var$parseServerKeys;


const $fd693d31e1c2e54f$var$findContainersWithTypes = (types, serverKeys, dataServers)=>{
    const containers = {};
    const existingContainers = [];
    serverKeys = (0, $982f4f2fb185d606$export$2e2bcd8739ae039)(serverKeys, dataServers);
    Object.keys(dataServers).filter((key1)=>dataServers[key1].containers).forEach((key1)=>{
        Object.keys(dataServers[key1].containers).forEach((key2)=>{
            if (!serverKeys || serverKeys.includes(key2)) Object.keys(dataServers[key1].containers[key2]).forEach((type)=>{
                if (types.includes(type)) dataServers[key1].containers[key2][type].map((path)=>{
                    const containerUri = (0, ($parcel$interopDefault($bkNnK$urljoin)))(dataServers[key2].baseUrl, path);
                    // Avoid returning the same container several times
                    if (!existingContainers.includes(containerUri)) {
                        existingContainers.push(containerUri);
                        if (!containers[key1]) containers[key1] = [];
                        containers[key1].push(containerUri);
                    }
                });
            });
        });
    });
    return containers;
};
var $fd693d31e1c2e54f$export$2e2bcd8739ae039 = $fd693d31e1c2e54f$var$findContainersWithTypes;


const $907cbc087f6529e2$var$createMethod = (config)=>async (resourceId, params)=>{
        const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) Error(`Resource ${resourceId} is not mapped in resources file`);
        const headers = new Headers();
        let containerUri;
        let serverKey;
        if (dataModel.create?.container) {
            serverKey = Object.keys(dataModel.create.container)[0];
            containerUri = (0, ($parcel$interopDefault($bkNnK$urljoin)))(dataServers[serverKey].baseUrl, Object.values(dataModel.create.container)[0]);
        } else {
            serverKey = dataModel.create?.server || Object.keys(dataServers).find((key)=>dataServers[key].default === true);
            if (!serverKey) throw new Error("You must define a server for the creation, or a container, or a default server");
            const containers = (0, $fd693d31e1c2e54f$export$2e2bcd8739ae039)(dataModel.types, [
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
            params.data = await (0, $58dec60cb6361eb9$export$2e2bcd8739ae039)(params.data, config);
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
            return await (0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)(resourceId, {
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
            return await (0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)(resourceId, {
                id: params.id
            });
        }
    };
var $907cbc087f6529e2$export$2e2bcd8739ae039 = $907cbc087f6529e2$var$createMethod;


const $0e66902b578fe66a$var$deleteMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient } = config;
        await httpClient(params.id, {
            method: "DELETE"
        });
        return {
            data: {
                id: params.id
            }
        };
    };
var $0e66902b578fe66a$export$2e2bcd8739ae039 = $0e66902b578fe66a$var$deleteMethod;


const $f170294dd29d8bf8$var$deleteManyMethod = (config)=>async (resourceId, params)=>{
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
var $f170294dd29d8bf8$export$2e2bcd8739ae039 = $f170294dd29d8bf8$var$deleteManyMethod;


const $b16131432127b07b$var$getDataServers = (config)=>()=>{
        return config.dataServers;
    };
var $b16131432127b07b$export$2e2bcd8739ae039 = $b16131432127b07b$var$getDataServers;


const $241c41c6f6021c7a$var$getDataModels = (config)=>()=>{
        return config.resources;
    };
var $241c41c6f6021c7a$export$2e2bcd8739ae039 = $241c41c6f6021c7a$var$getDataModels;





const $6e66f3a2f960b9ca$export$26b9f946b448f23e = (type, resource)=>{
    const resourceType = resource.type || resource["@type"];
    return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};
const $6e66f3a2f960b9ca$var$fetchContainers = async (containers, resourceId, params, config)=>{
    const { httpClient: httpClient, jsonContext: jsonContext } = config;
    // Transform in an containerUri:serverKey object
    const containersServers = Object.keys(containers).reduce((acc, serverKey)=>({
            ...acc,
            ...Object.fromEntries(containers[serverKey].map((containerUri)=>[
                    containerUri,
                    serverKey
                ]))
        }), {});
    const fetchPromises = Object.keys(containersServers).map((containerUri)=>httpClient(containerUri).then(({ json: json })=>{
            // If container's context is different, compact it to have an uniform result
            // TODO deep compare if the context is an object
            if (json["@context"] !== jsonContext) return (0, ($parcel$interopDefault($bkNnK$jsonld))).compact(json, jsonContext);
            return json;
        }).then((json)=>{
            if ($6e66f3a2f960b9ca$export$26b9f946b448f23e("ldp:Container", json)) return json["ldp:contains"];
            throw new Error(`${containerUri} is not a LDP container`);
        }));
    // Fetch simultaneously all containers
    let results = await Promise.all(fetchPromises);
    if (results.length === 0) return {
        data: [],
        total: 0
    };
    // Merge all results in one array
    results = [].concat.apply(...results);
    let returnData = results.map((item)=>{
        item.id = item.id || item["@id"];
        return item;
    });
    // Apply filter to results
    if (params.filter) {
        // For SPARQL queries, we use "a" to filter types, but in containers it must be "type"
        if (params.filter.a) {
            params.filter.type = params.filter.a;
            delete params.filter.a;
        }
        if (Object.keys(params.filter).length > 0) returnData = returnData.filter((resource)=>{
            return Object.entries(params.filter).every(([k, v])=>{
                if (k == "q") return Object.entries(resource).some(([kr, vr])=>{
                    if (!(0, ($parcel$interopDefault($bkNnK$isobject)))(vr)) {
                        const arrayValues = Array.isArray(vr) ? vr : [
                            vr
                        ];
                        return arrayValues.some((va)=>{
                            if (typeof va === "string" || va instanceof String) return va.toLowerCase().normalize("NFD").includes(v.toLowerCase().normalize("NFD"));
                        });
                    }
                    return false;
                });
                if (resource[k]) return Array.isArray(resource[k]) ? resource[k].some((va)=>va.includes(v)) : resource[k].includes(v);
                return false;
            });
        });
    }
    if (params.sort) returnData = returnData.sort((a, b)=>{
        if (a[params.sort.field] && b[params.sort.field]) {
            if (params.sort.order === "ASC") return a[params.sort.field].localeCompare(b[params.sort.field]);
            return b[params.sort.field].localeCompare(a[params.sort.field]);
        }
        return true;
    });
    if (params.pagination) returnData = returnData.slice((params.pagination.page - 1) * params.pagination.perPage, params.pagination.page * params.pagination.perPage);
    return {
        data: returnData,
        total: results.length
    };
};
var $6e66f3a2f960b9ca$export$2e2bcd8739ae039 = $6e66f3a2f960b9ca$var$fetchContainers;



const $e5241bff9fc0c9d7$var$getEmbedFrame = (blankNodes)=>{
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
var $e5241bff9fc0c9d7$export$2e2bcd8739ae039 = $e5241bff9fc0c9d7$var$getEmbedFrame;





const $761c677606459117$var$resolvePrefix = (item, ontologies)=>{
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
var $761c677606459117$export$2e2bcd8739ae039 = $761c677606459117$var$resolvePrefix;


const $51d7c29cc84f802b$var$defaultToArray = (value)=>!value ? [] : Array.isArray(value) ? value : [
        value
    ];
// We need to always include the type or React-Admin will not work properly
const $51d7c29cc84f802b$var$typeQuery = (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)("s1"), (0, $bkNnK$rdfjsdatamodel.namedNode)("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), (0, $bkNnK$rdfjsdatamodel.variable)("type"));
const $51d7c29cc84f802b$var$buildBaseQuery = (predicates, ontologies)=>{
    let baseTriples;
    if (predicates) {
        baseTriples = $51d7c29cc84f802b$var$defaultToArray(predicates).map((predicate, i)=>(0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)("s1"), (0, $bkNnK$rdfjsdatamodel.namedNode)((0, $761c677606459117$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`)));
        return {
            construct: [
                $51d7c29cc84f802b$var$typeQuery,
                ...baseTriples
            ],
            where: [
                $51d7c29cc84f802b$var$typeQuery,
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
        (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)("s1"), (0, $bkNnK$rdfjsdatamodel.variable)("p1"), (0, $bkNnK$rdfjsdatamodel.variable)("o1"))
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
        for (const predicate of blankNodes)if (predicate.includes("/")) {
            const nodeNames = predicate.split("/");
            for(let i = 1; i <= nodeNames.length; i++)nodes.push(nodeNames.slice(0, i).join("/"));
        } else nodes.push(predicate);
    }
    return nodes;
};
const $64d4ce40c79d1509$var$generateSparqlVarName = (node)=>(0, ($parcel$interopDefault($bkNnK$cryptojsmd5)))(node);
const $64d4ce40c79d1509$var$getParentNode = (node)=>node.includes("/") && node.split("/")[0];
const $64d4ce40c79d1509$var$getPredicate = (node)=>node.includes("/") ? node.split("/")[1] : node;
const $64d4ce40c79d1509$var$buildUnionQuery = (queries)=>queries.map((q)=>{
        let triples = q.query;
        const firstTriple = queries.find((q2)=>q.parentNode === q2.node);
        if (firstTriple !== undefined) triples = triples.concat(firstTriple.query[0]);
        return {
            type: "bgp",
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
            const parentVarName = parentNode ? $64d4ce40c79d1509$var$generateSparqlVarName(parentNode) : "1";
            const query = [
                (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`s${parentVarName}`), (0, $bkNnK$rdfjsdatamodel.namedNode)((0, $761c677606459117$export$2e2bcd8739ae039)(predicate, ontologies)), (0, $bkNnK$rdfjsdatamodel.variable)(`s${varName}`)),
                (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`s${varName}`), (0, $bkNnK$rdfjsdatamodel.variable)(`p${varName}`), (0, $bkNnK$rdfjsdatamodel.variable)(`o${varName}`))
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
                    ...$64d4ce40c79d1509$var$buildUnionQuery(queries)
                ]
            }
        };
    }
    return {
        construct: "",
        where: ""
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
                    type: "filter",
                    expression: {
                        type: "operation",
                        operator: "isblank",
                        args: [
                            (0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`)
                        ]
                    }
                },
                (0, $bkNnK$rdfjsdatamodel.triple)((0, $bkNnK$rdfjsdatamodel.variable)(`o${i}`), (0, $bkNnK$rdfjsdatamodel.variable)(`p${i + 1}`), (0, $bkNnK$rdfjsdatamodel.variable)(`o${i + 1}`))
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
var $3b137d792e8838ac$export$2e2bcd8739ae039 = $3b137d792e8838ac$var$buildAutoDetectBlankNodesQuery;



const { literal: $33c37185da3771a9$var$literal, namedNode: $33c37185da3771a9$var$namedNode, triple: $33c37185da3771a9$var$triple, variable: $33c37185da3771a9$var$variable } = (0, ($parcel$interopDefault($bkNnK$rdfjsdatamodel)));
const $33c37185da3771a9$var$generator = new (0, $bkNnK$sparqljs.Generator)({
});
const $33c37185da3771a9$var$reservedFilterKeys = [
    "q",
    "sparqlWhere",
    "blankNodes",
    "blankNodesDepth",
    "_servers",
    "_predicates"
];
const $33c37185da3771a9$var$buildSparqlQuery = ({ containers: containers, params: params, dataModel: dataModel, ontologies: ontologies })=>{
    const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
    const predicates = params.filter?._predicates || dataModel.list?.predicates;
    const blankNodesDepth = params.filter?.blankNodesDepth ?? dataModel.list?.blankNodesDepth ?? 2;
    const filter = {
        ...dataModel.list?.filter,
        ...params.filter
    };
    const baseQuery = (0, $51d7c29cc84f802b$export$2e2bcd8739ae039)(predicates, ontologies);
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
                    "?containerUri": $33c37185da3771a9$var$namedNode(containerUri)
                }))
        },
        $33c37185da3771a9$var$triple($33c37185da3771a9$var$variable("containerUri"), $33c37185da3771a9$var$namedNode("http://www.w3.org/ns/ldp#contains"), $33c37185da3771a9$var$variable("s1")),
        {
            type: "filter",
            expression: {
                type: "operation",
                operator: "isiri",
                args: [
                    $33c37185da3771a9$var$variable("s1")
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
                        $33c37185da3771a9$var$variable("s1")
                    ],
                    where: [
                        $33c37185da3771a9$var$triple($33c37185da3771a9$var$variable("s1"), $33c37185da3771a9$var$variable("p1"), $33c37185da3771a9$var$variable("o1")),
                        {
                            type: "filter",
                            expression: {
                                type: "operation",
                                operator: "isliteral",
                                args: [
                                    $33c37185da3771a9$var$variable("o1")
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
                                                    $33c37185da3771a9$var$variable("o1")
                                                ]
                                            }
                                        ]
                                    },
                                    $33c37185da3771a9$var$literal(filter.q.toLowerCase(), "", $33c37185da3771a9$var$namedNode("http://www.w3.org/2001/XMLSchema#string"))
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
            if (!$33c37185da3771a9$var$reservedFilterKeys.includes(predicate)) resourceWhere.unshift($33c37185da3771a9$var$triple($33c37185da3771a9$var$variable("s1"), $33c37185da3771a9$var$namedNode((0, $761c677606459117$export$2e2bcd8739ae039)(predicate, ontologies)), $33c37185da3771a9$var$namedNode((0, $761c677606459117$export$2e2bcd8739ae039)(object, ontologies))));
        });
    }
    // Blank nodes
    const blankNodesQuery = blankNodes ? (0, $64d4ce40c79d1509$export$2e2bcd8739ae039)(blankNodes, baseQuery, ontologies) : (0, $3b137d792e8838ac$export$2e2bcd8739ae039)(blankNodesDepth, baseQuery);
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
                name: $33c37185da3771a9$var$namedNode("http://semapps.org/mirror"),
                patterns: containerWhere
            }
        ]
    }, {
        type: "union",
        patterns: [
            resourceWhere,
            {
                type: "graph",
                name: $33c37185da3771a9$var$namedNode("http://semapps.org/mirror"),
                patterns: resourceWhere
            }
        ]
    });
    return $33c37185da3771a9$var$generator.stringify(sparqlJsParams);
};
var $33c37185da3771a9$export$2e2bcd8739ae039 = $33c37185da3771a9$var$buildSparqlQuery;


const $1e7a94d745f8597b$var$compare = (a, b)=>{
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
const $1e7a94d745f8597b$var$fetchSparqlEndpoints = async (containers, resourceId, params, config)=>{
    const { dataServers: dataServers, resources: resources, httpClient: httpClient, jsonContext: jsonContext, ontologies: ontologies } = config;
    const dataModel = resources[resourceId];
    const sparqlQueryPromises = Object.keys(containers).map((serverKey)=>new Promise((resolve, reject)=>{
            const blankNodes = params.filter?.blankNodes || dataModel.list?.blankNodes;
            // When the SPARQL request comes from the browser's URL, it comes as JSON string which must must be parsed
            if (params.filter?.sparqlWhere && (typeof params.filter.sparqlWhere === "string" || params.filter.sparqlWhere instanceof String)) params.filter.sparqlWhere = JSON.parse(decodeURIComponent(params.filter.sparqlWhere));
            const sparqlQuery = (0, $33c37185da3771a9$export$2e2bcd8739ae039)({
                containers: containers[serverKey],
                params: params,
                dataModel: dataModel,
                ontologies: ontologies
            });
            httpClient(dataServers[serverKey].sparqlEndpoint, {
                method: "POST",
                body: sparqlQuery
            }).then(({ json: json })=>{
                // By default, embed only the blank nodes we explicitly asked to dereference
                // Otherwise we may have same-type resources embedded in other resources
                // To increase performances, you can set explicitEmbedOnFraming to false (make sure the result is still OK)
                const frame = dataModel.list?.explicitEmbedOnFraming !== false ? {
                    "@context": jsonContext,
                    "@type": dataModel.types,
                    "@embed": "@never",
                    ...(0, $e5241bff9fc0c9d7$export$2e2bcd8739ae039)(blankNodes)
                } : {
                    "@context": jsonContext,
                    "@type": dataModel.types
                };
                // omitGraph option force results to be in a @graph, even if we have a single result
                return (0, ($parcel$interopDefault($bkNnK$jsonld))).frame(json, frame, {
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
                resolve(compactJson["@graph"] || []);
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
            if (params.sort.order === "ASC") return $1e7a94d745f8597b$var$compare(a[params.sort.field], b[params.sort.field]);
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



const $e3a78b3d48a0a0fb$var$findContainersWithPaths = (paths, dataServers)=>{
    const containers = {};
    Object.keys(paths).forEach((serverKey)=>{
        if (dataServers[serverKey]) {
            containers[serverKey] = [];
            paths[serverKey].forEach((path)=>{
                containers[serverKey].push((0, ($parcel$interopDefault($bkNnK$urljoin)))(dataServers[serverKey].baseUrl, path));
            });
        } else throw new Error(`No server found with key ${serverKey}`);
    });
    return containers;
};
var $e3a78b3d48a0a0fb$export$2e2bcd8739ae039 = $e3a78b3d48a0a0fb$var$findContainersWithPaths;


const $b6ed253f3374f5d4$var$getListMethod = (config)=>async (resourceId, params = {})=>{
        const { dataServers: dataServers, resources: resources } = config;
        const dataModel = resources[resourceId];
        if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);
        let containers;
        if (!params.filter?._servers && dataModel.list?.containers) {
            if (Array.isArray(dataModel.list?.containers)) throw new Error(`The list.containers property of ${resourceId} dataModel must be of type object ({ serverKey: [containerUri] })`);
            // If containers are set explicitly, use them
            containers = (0, $e3a78b3d48a0a0fb$export$2e2bcd8739ae039)(dataModel.list.containers, dataServers);
        } else // Otherwise find the container URIs on the given servers (either in the filter or the data model)
        containers = (0, $fd693d31e1c2e54f$export$2e2bcd8739ae039)(dataModel.types, params.filter?._servers || dataModel.list?.servers, dataServers);
        if (dataModel.list?.fetchContainer) return (0, $6e66f3a2f960b9ca$export$2e2bcd8739ae039)(containers, resourceId, params, config);
        return (0, $1e7a94d745f8597b$export$2e2bcd8739ae039)(containers, resourceId, params, config);
    };
var $b6ed253f3374f5d4$export$2e2bcd8739ae039 = $b6ed253f3374f5d4$var$getListMethod;



const $e296494b4f6a4f89$var$getManyMethod = (config)=>async (resourceId, params)=>{
        const { returnFailedResources: returnFailedResources } = config;
        let returnData = await Promise.all(params.ids.map((id)=>(0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)(resourceId, {
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
var $e296494b4f6a4f89$export$2e2bcd8739ae039 = $e296494b4f6a4f89$var$getManyMethod;



const $e5e279a608b8e6b1$var$getManyReferenceMethod = (config)=>async (resourceId, params)=>{
        params.filter = {
            ...params.filter,
            [params.target]: params.id
        };
        delete params.target;
        return await (0, $b6ed253f3374f5d4$export$2e2bcd8739ae039)(config)(resourceId, params);
    };
var $e5e279a608b8e6b1$export$2e2bcd8739ae039 = $e5e279a608b8e6b1$var$getManyReferenceMethod;




const $17541daf7ea3b8f0$var$updateMethod = (config)=>async (resourceId, params)=>{
        const { httpClient: httpClient, jsonContext: jsonContext } = config;
        // Upload files, if there are any
        params.data = await (0, $58dec60cb6361eb9$export$2e2bcd8739ae039)(params.data, config);
        await httpClient(params.id, {
            method: "PUT",
            body: JSON.stringify({
                "@context": jsonContext,
                ...params.data
            })
        });
        return {
            data: params.data
        };
    };
var $17541daf7ea3b8f0$export$2e2bcd8739ae039 = $17541daf7ea3b8f0$var$updateMethod;





const $3cfb23eead135e3f$var$fetchUserConfig = async (config)=>{
    const { dataServers: dataServers, httpClient: httpClient } = config;
    const token = localStorage.getItem("token");
    const podKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("pod", dataServers);
    const authServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("authServer", dataServers);
    // If the user is logged in
    if (token) {
        const { webId: webId } = (0, ($parcel$interopDefault($bkNnK$jwtdecode)))(token);
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
            config.dataServers[podKey].baseUrl = (0, ($parcel$interopDefault($bkNnK$urljoin)))(webId, "data"); // TODO find POD URI from user profile
            config.dataServers[podKey].sparqlEndpoint = userData.endpoints?.["void:sparqlEndpoint"] || (0, ($parcel$interopDefault($bkNnK$urljoin)))(webId, "sparql");
        }
        if (authServerKey) // Fill the config provided to the data provider
        // We must modify the config object directly
        config.dataServers[authServerKey].proxyUrl = userData.endpoints?.proxyUrl;
    } else if (podKey) // If the user is not logged in, ignore the POD server
    delete config.dataServers[podKey];
};
var $3cfb23eead135e3f$export$2e2bcd8739ae039 = $3cfb23eead135e3f$var$fetchUserConfig;


const $915df908e0942746$var$defaultToArray = (value)=>!value ? undefined : Array.isArray(value) ? value : [
        value
    ];
const $915df908e0942746$var$fetchVoidEndpoints = async (config)=>{
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
                for (const partition of $915df908e0942746$var$defaultToArray(dataset["void:classPartition"]))for (const type of $915df908e0942746$var$defaultToArray(partition["void:class"])){
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
var $915df908e0942746$export$2e2bcd8739ae039 = $915df908e0942746$var$fetchVoidEndpoints;




// Return the first server matching with the baseUrl
const $59a07b932dae8600$var$getServerKeyFromUri = (uri, dataServers)=>{
    return Object.keys(dataServers).find((key)=>{
        if (dataServers[key].pod) // The baseUrl ends with /data so remove this part to match with the webId and webId-related URLs (/inbox, /outbox...)
        return dataServers[key].baseUrl && uri.startsWith(dataServers[key].baseUrl.replace("/data", ""));
        return uri.startsWith(dataServers[key].baseUrl);
    });
};
var $59a07b932dae8600$export$2e2bcd8739ae039 = $59a07b932dae8600$var$getServerKeyFromUri;



/*
 * HTTP client used by all calls in data provider and auth provider
 * Do proxy calls if a proxy endpoint is available and the server is different from the auth server
 */ const $341dff85fe619d85$var$httpClient = (dataServers)=>(url, options = {})=>{
        const authServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("authServer", dataServers);
        const serverKey = (0, $59a07b932dae8600$export$2e2bcd8739ae039)(url, dataServers);
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
            return (0, $bkNnK$reactadmin.fetchUtils).fetchJson(dataServers[authServerKey].proxyUrl, {
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
        return (0, $bkNnK$reactadmin.fetchUtils).fetchJson(url, options);
    };
var $341dff85fe619d85$export$2e2bcd8739ae039 = $341dff85fe619d85$var$httpClient;


const $7f6a16d0025dc83a$var$dataProvider = (config)=>{
    // TODO verify all data provider config + data models
    if (!(0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("default", config.dataServers)) throw new Error("You must define a default server in your dataServers config");
    if (!config.jsonContext) config.jsonContext = Object.fromEntries(config.ontologies.map((o)=>[
            o.prefix,
            o.url
        ]));
    if (!config.returnFailedResources) config.returnFailedResources = false;
    // Configure httpClient with data servers (this is needed for proxy calls)
    config.httpClient = (0, $341dff85fe619d85$export$2e2bcd8739ae039)(config.dataServers);
    const fetchUserConfigPromise = (0, $3cfb23eead135e3f$export$2e2bcd8739ae039)(config);
    const fetchVoidEndpointsPromise = (0, $915df908e0942746$export$2e2bcd8739ae039)(config);
    const waitForVoidEndpoints = (method)=>async (...arg)=>{
            await fetchUserConfigPromise;
            await fetchVoidEndpointsPromise; // Return immediately if promise is fulfilled
            return await method(...arg);
        };
    return {
        getList: waitForVoidEndpoints((0, $b6ed253f3374f5d4$export$2e2bcd8739ae039)(config)),
        getMany: waitForVoidEndpoints((0, $e296494b4f6a4f89$export$2e2bcd8739ae039)(config)),
        getManyReference: waitForVoidEndpoints((0, $e5e279a608b8e6b1$export$2e2bcd8739ae039)(config)),
        getOne: waitForVoidEndpoints((0, $9020b8e3f4a4c1a1$export$2e2bcd8739ae039)(config)),
        create: waitForVoidEndpoints((0, $907cbc087f6529e2$export$2e2bcd8739ae039)(config)),
        update: waitForVoidEndpoints((0, $17541daf7ea3b8f0$export$2e2bcd8739ae039)(config)),
        updateMany: ()=>{
            throw new Error("updateMany is not implemented yet");
        },
        delete: waitForVoidEndpoints((0, $0e66902b578fe66a$export$2e2bcd8739ae039)(config)),
        deleteMany: waitForVoidEndpoints((0, $f170294dd29d8bf8$export$2e2bcd8739ae039)(config)),
        // Custom methods
        getDataModels: waitForVoidEndpoints((0, $241c41c6f6021c7a$export$2e2bcd8739ae039)(config)),
        getDataServers: waitForVoidEndpoints((0, $b16131432127b07b$export$2e2bcd8739ae039)(config)),
        getLocalDataServers: (0, $b16131432127b07b$export$2e2bcd8739ae039)(config),
        fetch: waitForVoidEndpoints(config.httpClient)
    };
};
var $7f6a16d0025dc83a$export$2e2bcd8739ae039 = $7f6a16d0025dc83a$var$dataProvider;






const $85e9a897c6d7c14a$var$compute = (externalLinks, record)=>typeof externalLinks === "function" ? externalLinks(record) : externalLinks;
const $85e9a897c6d7c14a$var$isURL = (url)=>typeof url === "string" && url.startsWith("http");
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





const $404991bb01c2ceff$var$useDataModel = (resourceId)=>{
    // Get the raw data provider, since useDataProvider returns a wrapper
    const dataProvider = (0, $bkNnK$react.useContext)((0, $bkNnK$reactadmin.DataProviderContext));
    const [dataModel, setDataModel] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        dataProvider.getDataModels().then((results)=>setDataModel(results[resourceId]));
    }, [
        dataProvider,
        resourceId,
        setDataModel
    ]);
    return dataModel;
};
var $404991bb01c2ceff$export$2e2bcd8739ae039 = $404991bb01c2ceff$var$useDataModel;




const $9b817943cd488c90$var$useDataServers = ()=>{
    // Get the raw data provider, since useDataProvider returns a wrapper
    const dataProvider = (0, $bkNnK$react.useContext)((0, $bkNnK$reactadmin.DataProviderContext));
    const [dataServers, setDataServers] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        dataProvider.getDataServers().then((results)=>setDataServers(results));
    }, [
        dataProvider,
        setDataServers
    ]);
    return dataServers;
};
var $9b817943cd488c90$export$2e2bcd8739ae039 = $9b817943cd488c90$var$useDataServers;



const $c2f8a77958c288fd$var$useContainers = (resourceId, serverKeys = "@all")=>{
    const dataModel = (0, $404991bb01c2ceff$export$2e2bcd8739ae039)(resourceId);
    const dataServers = (0, $9b817943cd488c90$export$2e2bcd8739ae039)();
    const [containers, setContainers] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        if (dataModel && dataServers) setContainers((0, $fd693d31e1c2e54f$export$2e2bcd8739ae039)(dataModel.types, serverKeys, dataServers));
    }, [
        dataModel,
        dataServers,
        serverKeys
    ]);
    return containers;
};
var $c2f8a77958c288fd$export$2e2bcd8739ae039 = $c2f8a77958c288fd$var$useContainers;







const $b32fd11d6aa83d1c$var$findCreateContainerWithTypes = (types, createServerKey, dataServers)=>{
    const containers = [];
    if (Object.keys(dataServers[createServerKey].containers[createServerKey]).length > 0) Object.keys(dataServers[createServerKey].containers[createServerKey]).forEach((type)=>{
        if (types.includes(type)) dataServers[createServerKey].containers[createServerKey][type].map((path)=>{
            const containerUri = (0, ($parcel$interopDefault($bkNnK$urljoin)))(dataServers[createServerKey].baseUrl, path);
            if (!containers.includes(containerUri)) containers.push(containerUri);
        });
    });
    if (containers.length === 0) throw new Error(`No container found matching with types ${JSON.stringify(types)}. You can set explicitely the create.container property of the resource.`);
    else if (containers.length > 1) throw new Error(`More than one container found matching with types ${JSON.stringify(types)}. You must set the create.server or create.container property for the resource.`);
    return containers[0];
};
var $b32fd11d6aa83d1c$export$2e2bcd8739ae039 = $b32fd11d6aa83d1c$var$findCreateContainerWithTypes;



const $99ed32cbdb76cb50$var$useCreateContainer = (resourceId)=>{
    const dataModel = (0, $404991bb01c2ceff$export$2e2bcd8739ae039)(resourceId);
    const dataServers = (0, $9b817943cd488c90$export$2e2bcd8739ae039)();
    const [createContainer, setCreateContainer] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        if (dataModel && dataServers) {
            if (dataModel.create?.container) {
                const [serverKey, path] = Object.entries(dataModel.create.container)[0];
                if (!serverKey || !dataServers[serverKey]) throw new Error(`Wrong key for the dataModel.create.container config of resource ${resourceId}`);
                setCreateContainer((0, ($parcel$interopDefault($bkNnK$urljoin)))(dataServers[serverKey].baseUrl, path));
            } else if (dataModel.create?.server) setCreateContainer((0, $b32fd11d6aa83d1c$export$2e2bcd8739ae039)(dataModel.types, dataModel.create?.server, dataServers));
            else {
                const defaultServerKey = (0, $8f44b7c15b8b8e1d$export$2e2bcd8739ae039)("default", dataServers);
                setCreateContainer((0, $b32fd11d6aa83d1c$export$2e2bcd8739ae039)(dataModel.types, defaultServerKey, dataServers));
            }
        }
    }, [
        dataModel,
        dataServers,
        setCreateContainer
    ]);
    return createContainer;
};
var $99ed32cbdb76cb50$export$2e2bcd8739ae039 = $99ed32cbdb76cb50$var$useCreateContainer;





const $8d622cbd05acb834$var$useDataModels = ()=>{
    // Get the raw data provider, since useDataProvider returns a wrapper
    const dataProvider = (0, $bkNnK$react.useContext)((0, $bkNnK$reactadmin.DataProviderContext));
    const [dataModels, setDataModels] = (0, $bkNnK$react.useState)();
    (0, $bkNnK$react.useEffect)(()=>{
        dataProvider.getDataModels().then((results)=>setDataModels(results));
    }, [
        dataProvider,
        setDataModels
    ]);
    return dataModels;
};
var $8d622cbd05acb834$export$2e2bcd8739ae039 = $8d622cbd05acb834$var$useDataModels;





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
    const { data: data } = (0, $bkNnK$reactadmin.useGetList)({
        resource: groupReference,
        payload: {}
    });
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
        display: "flex"
    },
    input: {
        paddingRight: "20px"
    }
});
const $030f1232f6810456$var$useHideInputStyles = (0, ($parcel$interopDefault($bkNnK$muistylesmakeStyles)))({
    root: {
        display: "none"
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




//# sourceMappingURL=index.cjs.js.map
