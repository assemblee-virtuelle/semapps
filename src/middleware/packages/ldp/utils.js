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
      if (filters[predicate]) {
        where += `
          FILTER EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} ${
            filters[predicate].startsWith('http') ? `<${filters[predicate]}>` : `"${filters[predicate]}"`
          } } .
        `;
      } else {
        where += `
          FILTER NOT EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} ?unwanted${i} } .
        `;
      }
    });
  }
  return { where };
};

const getPrefixRdf = ontologies => {
  return ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
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

module.exports = {
  buildBlankNodesQuery,
  buildFiltersQuery,
  getPrefixRdf,
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
  getAclUriFromResourceUri,
  isMirror,
  createFragmentURL,
  regexPrefix,
  regexProtocolAndHostAndPort
};
