import urlJoin from 'url-join';

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');
const regexProtocolAndHostAndPort = new RegExp('^http(s)?:\\/\\/([\\w-\\.:]*)');

function createFragmentURL(baseUrl: any, serverUrl: any) {
  let fragment = 'me';
  const res = serverUrl.match(regexProtocolAndHostAndPort);
  if (res) fragment = res[2].replace('-', '_').replace('.', '_').replace(':', '_');

  return urlJoin(baseUrl, `#${fragment}`);
}

const isMirror = (resourceUri: any, baseUrl: any) => {
  return !urlJoin(resourceUri, '/').startsWith(baseUrl);
};

const buildBlankNodesQuery = (depth: any) => {
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

/**
 * SPARQL update deleting a resource with its blank nodes (on the same depth as ldp.resource.get), so that it
 * leaves no orphan blank nodes. This avoids triplestore.deleteOrphanBlankNodes, which scans the whole dataset.
 */
const buildDeleteResourceQuery = (resourceUri: string, graphName?: string, depth = 4) => {
  const { construct, where } = buildBlankNodesQuery(depth);
  const inGraph = (pattern: string) => (graphName ? `GRAPH <${graphName}> { ${pattern} }` : pattern);
  return `
    DELETE {
      ${inGraph(construct)}
    }
    WHERE {
      BIND(<${resourceUri}> AS ?s1) .
      ${inGraph(where)}
    }
  `;
};

const isURL = (value: any) => (typeof value === 'string' || value instanceof String) && value.startsWith('http');

/** If the value starts with `http` or `urn:` */
const isURI = (value: any) =>
  (typeof value === 'string' || value instanceof String) && (value.startsWith('http') || value.startsWith('urn:'));

const buildFiltersQuery = (filters: any) => {
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

// Prevent SPARQL injection when an IRI comes from the outside world (it is inserted between <>)
const isValidIri = (value: any) => typeof value === 'string' && /^[a-z][a-z0-9+.-]*:[^\s<>"{}|\\^`]+$/i.test(value);

// Escape a string to be used as a SPARQL literal (between double quotes)
const escapeSparqlString = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

const ACCENTS_CLASSES: Record<string, string> = {
  a: '[aàáâãäå]',
  c: '[cç]',
  e: '[eèéêë]',
  i: '[iìíîï]',
  n: '[nñ]',
  o: '[oòóôõöø]',
  u: '[uùúûü]',
  y: '[yýÿ]'
};

/**
 * Build a SPARQL filter keeping the resources (?s1) with a literal containing the given keywords,
 * case-insensitive and accent-insensitive (SPARQL has no function to remove accents, so we use a regex).
 * The predicates must be full URIs, which have been validated with isValidIri.
 */
const buildSearchQuery = (keywords?: string, predicates?: string[]) => {
  if (!keywords) return '';
  const pattern = keywords
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special characters
    .replace(/[a-z]/g, letter => ACCENTS_CLASSES[letter] || letter);
  return `
    FILTER EXISTS {
      ${predicates?.length ? `VALUES ?searchPredicate { ${predicates.map(p => `<${p}>`).join(' ')} }` : ''}
      ?s1 ?searchPredicate ?searchValue .
      FILTER(isLiteral(?searchValue) && REGEX(STR(?searchValue), "${escapeSparqlString(pattern)}", "i"))
    }
  `;
};

/**
 * Build a SPARQL filter keeping the resources (?s1) located at less than `radius` km of the given point,
 * using the vcard:hasGeo/vcard:latitude/vcard:longitude predicates. Resources without location are kept.
 * The distance is computed with the haversine formula, using the XPath math functions supported by Jena.
 */
const buildNearQuery = (near?: { latitude: number; longitude: number; radius: number }) => {
  if (!near) return '';
  if (![near.latitude, near.longitude, near.radius].every(n => typeof n === 'number' && Number.isFinite(n))) {
    throw new Error('The latitude, longitude and radius must be numbers');
  }
  // Use parenthesis so that negative numbers can be used in the expressions
  const [latitude, longitude, radius] = [near.latitude, near.longitude, near.radius].map(n => `(${n})`);
  const geoPattern = `
    ?s1 <http://www.w3.org/2006/vcard/ns#hasGeo> ?nearGeo .
    ?nearGeo <http://www.w3.org/2006/vcard/ns#latitude> ?nearLatitude ;
      <http://www.w3.org/2006/vcard/ns#longitude> ?nearLongitude .
  `;
  const math = (fn: string) => `<http://www.w3.org/2005/xpath-functions/math#${fn}>`;
  const rad = `${math('pi')}() / 180`;
  const lat = '<http://www.w3.org/2001/XMLSchema#double>(?nearLatitude)';
  const lon = '<http://www.w3.org/2001/XMLSchema#double>(?nearLongitude)';
  return `
    FILTER(
      NOT EXISTS { ${geoPattern} } ||
      EXISTS {
        ${geoPattern}
        BIND(${math('sin')}((${lat} - ${latitude}) * ${rad} / 2) AS ?nearSinLat)
        BIND(${math('sin')}((${lon} - ${longitude}) * ${rad} / 2) AS ?nearSinLon)
        FILTER(
          12742 * ${math('asin')}(${math('sqrt')}(
            ?nearSinLat * ?nearSinLat +
            ${math('cos')}(${latitude} * ${rad}) * ${math('cos')}(${lat} * ${rad}) * ?nearSinLon * ?nearSinLon
          )) <= ${radius}
        )
      }
    )
  `;
};

/**
 * Delete the keys cached by an action for a given URI, whatever the other key params.
 * With the SemApps CacherMiddleware, an index is used, which avoids scanning the whole cache.
 */
const cleanCacheByUri = async (cacher: any, actionName: string, uri: string) => {
  if (!cacher) return;
  if (typeof cacher.cleanByUri === 'function') {
    await cacher.cleanByUri(actionName, uri);
  } else {
    await cacher.clean([`${actionName}:${uri}`, `${actionName}:${uri}|**`]);
  }
};

const isObject = (value: any) => typeof value === 'object' && !Array.isArray(value) && value !== null;
const getSlugFromUri = (uri: any) => uri.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
const getContainerFromUri = (uri: any) => uri.match(new RegExp(`(.*)/.*`))[1];

const getParentContainerUri = (uri: any) => uri.match(new RegExp(`(.*)/.*`))[1];
const getParentContainerPath = (path: any) => path.match(new RegExp(`(.*)/.*`))[1];

const getPathFromUri = (uri: any) => {
  try {
    const urlObject = new URL(uri);
    return urlObject.pathname;
  } catch (e) {
    return false;
  }
};

// Transforms "http://localhost:3000/alice/data" to "alice"
const getDatasetFromUri = (uri: any) => {
  const path = getPathFromUri(uri);
  if (path) {
    const parts = path.split('/');
    if (parts.length > 1) return parts[1];
  } else {
    throw new Error(`${uri} is not a valid URL`);
  }
};

// Transforms "http://localhost:3000/alice/data" to "http://localhost:3000/alice"
const getWebIdFromUri = (uri: any) => {
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

const getId = (resource: any) => resource.id || resource['@id'];
const getType = (resource: any) => resource.type || resource['@type'];

const hasType = (resource: any, type: any) => {
  const resourceType = getType(resource);
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const isContainer = (resource: any) => hasType(resource, 'ldp:Container');

/** @deprecated Use arrayOf instead */
const defaultToArray = (value: any) => (!value ? undefined : Array.isArray(value) ? value : [value]);

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

// Remove undefined values from object
const cleanUndefined = (obj: any) =>
  Object.keys(obj).reduce((acc, key) => (obj[key] === undefined ? acc : { ...acc, [key]: obj[key] }), {});

const parseJson = (json: any) => {
  try {
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    // Ignore parse error. Assume it is a simple string.
  }
  return json;
};

const arrayOf = (value: any) => {
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
const waitForResource = async (delayMs: any, fieldNames: any, maxTries: any, callback: any) => {
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
  buildDeleteResourceQuery,
  buildFiltersQuery,
  buildSearchQuery,
  buildNearQuery,
  cleanCacheByUri,
  isValidIri,
  escapeSparqlString,
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
