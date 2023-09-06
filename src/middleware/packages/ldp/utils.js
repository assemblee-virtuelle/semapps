const urlJoin = require('url-join');

function getAclUriFromResourceUri(baseUrl, resourceUri) {
  return urlJoin(baseUrl, resourceUri.replace(baseUrl, baseUrl.endsWith('/') ? '_acl/' : '_acl'));
}

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

const regexProtocolAndHostAndPort = new RegExp('^http(s)?:\\/\\/([\\w-\\.:]*)');

function createFragmentURL(baseUrl, serverUrl) {
  let fragment = 'me';
  const res = serverUrl.match(regexProtocolAndHostAndPort);
  if (res)
    fragment = res[2]
      .replace('-', '_')
      .replace('.', '_')
      .replace(':', '_');

  return urlJoin(baseUrl, '#' + fragment);
}

const isMirror = (resourceUri, baseUrl) => {
  return !urlJoin(resourceUri, '/').startsWith(baseUrl);
};

const buildBlankNodesQuery = depth => {
  let construct = '',
    where = '';
  if (depth > 0) {
    for (let i = depth; i >= 1; i--) {
      construct += `
        ?o${i} ?p${i + 1} ?o${i + 1} .
      `;
      where = `
        OPTIONAL {
          FILTER((isBLANK(?o${i}))) .
          ?o${i} ?p${i + 1} ?o${i + 1} .
          ${where}
        }
      `;
    }
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
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  return pattern;
};

// Replace a full URI with a prefix
const usePrefix = (uri, ontologies) => {
  if (!uri.startsWith('http')) return uri; // If it is already prefixed
  const ontology = ontologies.find(o => uri.startsWith(o.url));
  return uri.replace(ontology.url, ontology.prefix + ':');
};

// Replace a full URI with a prefix
const useFullURI = (prefixedUri, ontologies) => {
  if (prefixedUri.startsWith('http')) return uri; // If it is already a full URI
  const [prefix] = prefixedUri.split(':');
  const ontology = ontologies.find(o => o.prefix === prefix);
  return prefixedUri.replace(ontology.prefix + ':', ontology.url);
};

const getSlugFromUri = uri => uri.match(new RegExp(`.*/(.*)`))[1];

const getContainerFromUri = uri => uri.match(new RegExp(`(.*)/.*`))[1];

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
