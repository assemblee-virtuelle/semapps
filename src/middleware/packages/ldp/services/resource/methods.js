const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const { variable } = require('rdf-data-model');
const { MIME_TYPES } = require('@semapps/mime-types');

// TODO put each method in a different file (problems with "this" not working)
module.exports = {
  async bodyToTriples(body, contentType) {
    return new Promise((resolve, reject) => {
      if (contentType === 'application/ld+json' && typeof body === 'object') body = JSON.stringify(body);
      const textStream = streamifyString(body);
      let res = [];
      rdfParser
        .parse(textStream, { contentType })
        .on('data', quad => res.push(quad))
        .on('error', error => reject(error))
        .on('end', () => resolve(res));
    });
  },
  convertBlankNodesToVars(triples, blankNodesVarsMap) {
    return triples.map(triple => {
      if (triple.subject.termType === 'BlankNode') {
        triple.subject = variable(blankNodesVarsMap[triple.subject.value]);
      }
      if (triple.object.termType === 'BlankNode') {
        triple.object = variable(blankNodesVarsMap[triple.object.value]);
      }
      return triple;
    });
  },
  // Exclude from triples1 the triples which also exist in triples2
  getTriplesDifference(triples1, triples2) {
    return triples1.filter(t1 => !triples2.some(t2 => t1.equals(t2)));
  },
  nodeToString(node) {
    switch (node.termType) {
      case 'Variable':
        return `?${node.value}`;
      case 'NamedNode':
        return `<${node.value}>`;
      case 'Literal':
        if (node.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
          // Use triple quotes SPARQL notation to allow new lines and double quotes
          // See https://www.w3.org/TR/sparql11-query/#QSynLiterals
          return `'''${node.value}'''`;
        } else {
          return `"${node.value}"^^<${node.datatype.value}>`;
        }
      default:
        throw new Error('Unknown node type: ' + node.termType);
    }
  },
  /*
   * Go through all blank nodes in the provided triples, and map them using the last part of the predicate
   * http://virtual-assembly.org/ontologies/pair#hasLocation -> ?hasLocation
   * TODO: make it work with /
   */
  mapBlankNodesOnVars(triples) {
    let blankNodesVars = {};
    triples
      .filter(triple => triple.object.termType === 'BlankNode')
      .forEach(triple => (blankNodesVars[triple.object.value] = triple.predicate.value.split('#')[1]));
    return blankNodesVars;
  },
  triplesToString(triples) {
    return triples
      .map(
        triple =>
          `${this.nodeToString(triple.subject)} <${triple.predicate.value}> ${this.nodeToString(triple.object)} .`
      )
      .join('\n');
  },
  bindNewBlankNodes(triples) {
    return triples.map(triple => `BIND (BNODE() AS ?${triple.object.value}) .`).join('\n');
  },
  async createDisassemblyAndUpdateResource(ctx, resource, disassembly, webId) {
    for (let disassemblyItem of disassembly) {
      if (resource[disassemblyItem.path]) {
        let rawDisassemblyValue = resource[disassemblyItem.path];
        if (!Array.isArray(rawDisassemblyValue)) {
          rawDisassemblyValue = [rawDisassemblyValue];
        }
        const uriInserted = [];
        for (let disassemblyValue of rawDisassemblyValue) {
          let { id, ...usableValue } = disassemblyValue;
          usableValue = {
            '@context': resource['@context'],
            ...usableValue
          };

          const disassemblyResourceUri = await ctx.call('ldp.resource.post', {
            containerUri: disassemblyItem.container,
            resource: usableValue,
            contentType: MIME_TYPES.JSON,
            webId
          });
          uriInserted.push({ '@id': disassemblyResourceUri, '@type': '@id' });
        }
        resource[disassemblyItem.path] = uriInserted;
      }
    }
    return resource;
  },
  async deleteDisassembly(ctx, resource, disassembly, webId) {
    for (let disassemblyItem of disassembly) {
      if (resource[disassemblyItem.path]) {
        let rawDisassemblyValue = resource[disassemblyItem.path];
        if (!Array.isArray(rawDisassemblyValue)) {
          rawDisassemblyValue = [rawDisassemblyValue];
        }
        for (let disassemblyValue of rawDisassemblyValue) {
          const idToDelete = disassemblyValue['@id'] || disassemblyValue['id'] || disassemblyValue;
          await ctx.call('ldp.resource.delete', {
            resourceUri: idToDelete,
            webId
          });
        }
      }
    }
  }
};
