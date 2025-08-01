import urlJoin from 'url-join';
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

const isURL = value => (typeof value === 'string' || value instanceof String) && value.startsWith('http');

/** If the value starts with `http` or `urn:` */
const isURI = value =>
  (typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));

const buildFiltersQuery = filters => {
  let where = '';
  if (filters) {
    Object.keys(filters).forEach((predicate, i) => {
      if (filters[predicate]) {
        where += `
          FILTER EXISTS { 
            ?s1 ${isURI(predicate) ? `<${predicate}>` : predicate} ${
              isURI(filters[predicate]) ? `<${filters[predicate]}>` : `"${filters[predicate]}"`
            } } .
        `;
      } else {
        where += `
          FILTER NOT EXISTS { ?s1 ${isURI(predicate) ? `<${predicate}>` : predicate} ?unwanted${i} } .
        `;
      }
    });
  }
  return { where };
};

const isObject = value => typeof value === 'object' && !Array.isArray(value) && value !== null;
const getSlugFromUri = uri => uri.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
const getContainerFromUri = uri => uri.match(new RegExp(`(.*)/.*`))[1];

const getParentContainerUri = uri => uri.match(new RegExp(`(.*)/.*`))[1];
const getParentContainerPath = path => path.match(new RegExp(`(.*)/.*`))[1];

const getPathFromUri = uri => {
  try {
    const urlObject = new URL(uri);
    return urlObject.pathname;
  } catch (e) {
    return false;
  }
};

// Transforms "http://localhost:3000/alice/data" to "alice"
const getDatasetFromUri = uri => {
  const path = getPathFromUri(uri);
  if (path) {
    const parts = path.split('/');
    if (parts.length > 1) return parts[1];
  } else {
    throw new Error(`${uri} is not a valid URL`);
  }
};

// Transforms "http://localhost:3000/alice/data" to "http://localhost:3000/alice"
const getWebIdFromUri = uri => {
  const path = getPathFromUri(uri);
  if (path) {
    const parts = path.split('/');
    if (parts.length > 1) {
      const urlObject = new URL(uri);
      return `${urlObject.origin}/${parts[1]}`;
    }
  } else {
    throw new Error(`${uri} is not a valid URL`);
  }
};

const getId = resource => resource.id || resource['@id'];
const getType = resource => resource.type || resource['@type'];

const hasType = (resource, type) => {
  const resourceType = getType(resource);
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const isContainer = resource => hasType(resource, 'ldp:Container');

/** @deprecated Use arrayOf instead */
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
  if (value === null || value === undefined) {
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

export {
  buildBlankNodesQuery,
  buildFiltersQuery,
  isURL,
  isURI,
  isObject,
  getSlugFromUri,
  getContainerFromUri,
  getParentContainerUri,
  getParentContainerPath,
  getDatasetFromUri,
  getWebIdFromUri,
  getId,
  getType,
  hasType,
  isContainer,
  defaultToArray,
  delay,
  cleanUndefined,
  parseJson,
  isMirror,
  createFragmentURL,
  regexPrefix,
  regexProtocolAndHostAndPort,
  waitForResource,
  arrayOf
};
