const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');

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
  // Exclude from triples1 the triples which also exist in triples2
  getTriplesDifference(triples1, triples2) {
    return triples1.filter(t1 => !triples2.some(t2 => t1.equals(t2)));
  },
  getNodeForQuery(node, blankNodesVars) {
    switch (node.termType) {
      case 'BlankNode':
        // Blank nodes are considered as SPARQL variables
        return blankNodesVars[node.value];
      case 'NamedNode':
        return `<${node.value}>`;
      case 'Literal':
        // Use triple quotes SPARQL notation to allow new lines and double quotes
        // See https://www.w3.org/TR/sparql11-query/#QSynLiterals
        return `'''${node.value}'''`;
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
      .forEach(triple => (blankNodesVars[triple.object.value] = '?' + triple.predicate.value.split('#')[1]));
    return blankNodesVars;
  },
  triplesToString(triples, blankNodesVars) {
    return triples
      .map(
        triple =>
          `${this.getNodeForQuery(triple.subject, blankNodesVars)} <${triple.predicate.value}> ${this.getNodeForQuery(
            triple.object,
            blankNodesVars
          )} .`
      )
      .join('\n');
  },
  async createDisassemblyAndUpdateResource(ctx, resource, contentType, disassembly, webId) {
    if (disassembly && contentType == MIME_TYPES.JSON) {
      for (const disassemblyItem of disassembly) {
        if (resource[disassemblyItem.path]) {
          let rawDisassemblyValue = resource[disassemblyItem.path];
          if (!Array.isArray(rawDisassemblyValue)) {
            rawDisassemblyValue = [rawDisassemblyValue];
          }
          const uriInserted = [];
          for (let disassemblyValue of rawDisassemblyValue) {
            // id is extract to not interfer whith @id if set
            let { id, ...usableValue } = disassemblyValue;
            usableValue = {
              '@context': resource['@context'],
              ...usableValue
            };

            disassemblyResourceUri = await ctx.call('ldp.resource.post', {
              containerUri: disassemblyItem.container,
              resource: usableValue,
              contentType: MIME_TYPES.JSON,
              accept: MIME_TYPES.JSON,
              webId: webId
            });
            uriInserted.push({ '@id': disassemblyResourceUri, '@type': '@id' });
          }
          resource[disassemblyItem.path] = uriInserted;
        }
      }
    }
    return resource;
  },
  async deleteDisassembly(ctx, resource, contentType, disassembly, webId) {
    if (disassembly) {
      for (disassemblyItem of disassembly) {
        if (resource[disassemblyItem.path]) {
          let rawDisassemblyValue = resource[disassemblyItem.path];
          if (!Array.isArray(rawDisassemblyValue)) {
            rawDisassemblyValue = [rawDisassemblyValue];
          }
          for (let disassemblyValue of rawDisassemblyValue) {
            const idToDelete = disassemblyValue['@id'] || disassemblyValue['id'] || disassemblyValue;
            await ctx.call('ldp.resource.delete', {
              resourceUri: idToDelete,
              webId: webId
            });
          }
        }
      }
    }
    // resource[disassemblyItem.path]==undefined;
    return resource;
  }
};
