const urlJoin = require('url-join');
const crypto = require('crypto');

function getAclUriFromResourceUri(baseUrl, resourceUri) {
  return urlJoin(baseUrl, resourceUri.replace(baseUrl, '_acl/'));
}

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

// Transform ['ont:predicate1/ont:predicate2'] to ['ont:predicate1', 'ont:predicate1/ont:predicate2']
const extractNodes = predicates => {
  let nodes = [];
  for (let predicate of predicates) {
    if (predicate.includes('/')) {
      const nodeNames = predicate.split('/');
      for (let i = 1; i <= nodeNames.length; i++) {
        nodes.push(nodeNames.slice(0, i).join('/'));
      }
    } else {
      nodes.push(predicate);
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
  let queries = [];
  const nodes = extractNodes(predicates);

  if (nodes) {
    for (let node of nodes) {
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
  } else {
    return {
      construct: '',
      where: ''
    };
  }
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

const getSlugFromUri = str => str.match(new RegExp(`.*/(.*)`))[1];

const getContainerFromUri = str => str.match(new RegExp(`(.*)/.*`))[1];

const hasType = (resource, type) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

const isContainer = resource => hasType(resource, 'ldp:Container');

const defaultToArray = value => (!value ? undefined : Array.isArray(value) ? value : [value]);

const delay = t => new Promise(resolve => setTimeout(resolve, t));

module.exports = {
  buildBlankNodesQuery,
  buildDereferenceQuery,
  buildFiltersQuery,
  getPrefixRdf,
  getPrefixJSON,
  getSlugFromUri,
  getContainerFromUri,
  hasType,
  isContainer,
  defaultToArray,
  delay,
  getAclUriFromResourceUri
};
