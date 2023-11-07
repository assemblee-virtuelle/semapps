const urlJoin = require('url-join');

function getAclUriFromResourceUri(baseUrl, resourceUri) {
  return urlJoin(baseUrl, resourceUri.replace(baseUrl, baseUrl.endsWith('/') ? '_acl/' : '_acl'));
}

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

const regexProtocolAndHostAndPort = new RegExp('^http(s)?:\\/\\/([\\w-\\.:]*)');

function createFragmentURL(baseUrl, serverUrl) {
  let fragment = 'me';
  const res = serverUrl.match(regexProtocolAndHostAndPort);
  if (res) fragment = res[2].replace('-', '_').replace('.', '_').replace(':', '_');

  return urlJoin(baseUrl, `#${fragment}`);
}

const isMirror = (resourceUri, baseUrl) => {
  return !urlJoin(resourceUri, '/').startsWith(baseUrl);
};

const buildBlankNodesQuery = depth => {
  const BASE_QUERY = '?s1 ?p1 ?o1 .';
  let construct = BASE_QUERY;
  let where = '';
  if (depth > 0) {
    let whereQueries = [];
    whereQueries.push([BASE_QUERY]);
    for (let i = 1; i <= depth; i++) {
      construct += `\r\n?o${i} ?p${i + 1} ?o${i + 1} .`;
      whereQueries.push([
        ...whereQueries[whereQueries.length - 1],
        `FILTER((isBLANK(?o${i}))) .`,
        `?o${i} ?p${i + 1} ?o${i + 1} .`
      ]);
    }
    where = `{\r\n${whereQueries.map(q1 => q1.join('\r\n')).join('\r\n} UNION {\r\n')}\r\n}`;
  } else if (depth === 0) {
    where = BASE_QUERY;
  } else {
    throw new Error('The depth of buildBlankNodesQuery should be 0 or more');
  }
  return { construct, where };
};

const buildFiltersQuery = filters => {
  let where = '';
  if (filters) {
    Object.keys(filters).forEach((predicate, i) => {
      if (!predicate.startsWith('http')) throw new Error('The predicates of filters must be full URIs');
      if (filters[predicate]) {
        where += `
          FILTER EXISTS { ?s1 <${predicate}> ${
            filters[predicate].startsWith('http') ? `<${filters[predicate]}>` : `"${filters[predicate]}"`
          } } .
        `;
      } else {
        where += `
          FILTER NOT EXISTS { ?s1 <${predicate}> ?unwanted${i} } .
        `;
      }
    });
  }
  return { where };
};

const getPrefixJSON = ontologies => {
  const pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

// Replace a full URI with a prefix
const usePrefix = (uri, ontologies) => {
  if (!uri.startsWith('http')) return uri; // If it is already prefixed
  const ontology = ontologies.find(o => uri.startsWith(o.url));
  return uri.replace(ontology.url, `${ontology.prefix}:`);
};

// Replace a full URI with a prefix
const useFullURI = (prefixedUri, ontologies) => {
  if (prefixedUri.startsWith('http')) return prefixedUri; // If it is already a full URI
  const [prefix] = prefixedUri.split(':');
  const ontology = ontologies.find(o => o.prefix === prefix);
  return prefixedUri.replace(`${ontology.prefix}:`, ontology.url);
};

const getSlugFromUri = uri => uri.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
const getContainerFromUri = uri => uri.match(new RegExp(`(.*)/.*`))[1];

const getParentContainerUri = uri => uri.match(new RegExp(`(.*)/.*`))[1];

// Transforms "http://localhost:3000/dataset/data" to "dataset"
const getDatasetFromUri = uri => {
  const path = new URL(uri).pathname;
  const parts = path.split('/');
  if (parts.length > 1) return parts[1];
};

const hasType = (resource, type) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const isContainer = resource => hasType(resource, 'ldp:Container');

const defaultToArray = value => (!value ? undefined : Array.isArray(value) ? value : [value]);

const delay = t => new Promise(resolve => setTimeout(resolve, t));

// Remove undefined values from object
const cleanUndefined = obj =>
  Object.keys(obj).reduce((acc, key) => (obj[key] === undefined ? acc : { ...acc, [key]: obj[key] }), {});

const parseJson = json => {
  try {
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    // Ignore parse error. Assume it is a simple string.
  }
  return json;
};

const arrayOf = value => {
  // If the field is null-ish, we suppose there are no values.
  if (!value) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};

/**
 * Call a callback and expect the result object to have all properties in `fieldNames`.
 * If not, try again after `delayMs` until `maxTries` is reached.
 * If `fieldNames` is `undefined`, the return value of `callback` is expected to not be
 * `undefined`.
 * @type {import("./utilTypes").waitForResource}
 */
const waitForResource = async (delayMs, fieldNames, maxTries, callback) => {
  for (let i = 0; i < maxTries; i += 1) {
    const result = await callback();
    // If a result (and the expected field, if required) is present, return.
    if (result !== undefined && arrayOf(fieldNames).every(fieldName => Object.keys(result).includes(fieldName))) {
      return result;
    }
    await delay(delayMs);
  }
  throw new Error(`Waiting for resource failed. No results after ${maxTries} tries`);
};

module.exports = {
  buildBlankNodesQuery,
  buildFiltersQuery,
  getPrefixJSON,
  usePrefix,
  useFullURI,
  getSlugFromUri,
  getContainerFromUri,
  getParentContainerUri,
  getDatasetFromUri,
  hasType,
  isContainer,
  defaultToArray,
  delay,
  cleanUndefined,
  parseJson,
  getAclUriFromResourceUri,
  isMirror,
  createFragmentURL,
  regexPrefix,
  regexProtocolAndHostAndPort,
  waitForResource,
  arrayOf
};
