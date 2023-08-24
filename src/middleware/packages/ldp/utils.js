const urlJoin = require('url-join');
const crypto = require('crypto');

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

  return urlJoin(baseUrl, `#${fragment}`);
}

const isMirror = (resourceUri, baseUrl) => {
  return !urlJoin(resourceUri, '/').startsWith(baseUrl);
};

// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const extractNodes = predicates => {
  const nodes = [];
  if (predicates) {
    for (const predicate of predicates) {
      if (predicate.includes('/')) {
        const nodeNames = predicate.split('/');
        for (let i = 1; i <= nodeNames.length; i++) {
          nodes.push(nodeNames.slice(0, i).join('/'));
        }
      } else {
        nodes.push(predicate);
      }
    }
  }
  return nodes;
};

const generateSparqlVarName = node =>
  crypto
    .createHash('md5')
    .update(node)
    .digest('hex');

const getParentNode = node => node.includes('/') && node.split('/')[0];

const getPredicate = node => (node.includes('/') ? node.split('/')[1] : node);

const buildOptionalQuery = (queries, parentNode = false) =>
  queries
    .filter(q => q.parentNode === parentNode)
    .map(
      q => `
      OPTIONAL { 
        ${q.query}
        ${q.filter}
        ${buildOptionalQuery(queries, q.node)}
      }
    `
    )
    .join('\n');

const buildDereferenceQuery = predicates => {
  const queries = [];
  const nodes = extractNodes(predicates);

  if (nodes && nodes.length) {
    for (const node of nodes) {
      const parentNode = getParentNode(node);
      const predicate = getPredicate(node);
      const varName = generateSparqlVarName(node);
      const parentVarName = parentNode ? generateSparqlVarName(parentNode) : '1';

      queries.push({
        node,
        parentNode,
        query: `?s${parentVarName} ${predicate} ?s${varName} .\n?s${varName} ?p${varName} ?o${varName} .`,
        filter: `FILTER(isBLANK(?s${varName})) .`
      });
    }

    return {
      construct: queries.map(q => q.query).join('\n'),
      where: buildOptionalQuery(queries)
    };
  }
  return {
    construct: '',
    where: ''
  };
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

const delay = async t => new Promise(resolve => setTimeout(resolve, t));

module.exports = {
  buildDereferenceQuery,
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
