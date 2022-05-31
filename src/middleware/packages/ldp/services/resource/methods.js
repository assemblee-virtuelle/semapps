const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const { variable } = require('rdf-data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const fs = require('fs');

const { defaultToArray } = require('../../utils');

const cleanDisassemblyPerdicate = v => {
  if (typeof v.origin === 'string' || v.origin instanceof String) {
    return {
      origin: v,
      clean: {
        '@id': v,
        '@type': '@id'
      }
    };
  } else {
    if (v.id != undefined) {
      const out = {
        origin: v,
        clean: {
          ...v,
          '@id': v.id
        }
      };

      delete out.clean.id;
      return out;
    } else {
      return {
        origin: v,
        clean: v
      };
    }
  }
};

// TODO put each method in a different file (problems with "this" not working)
module.exports = {
  async streamToFile(inputStream, filePath) {
    return new Promise((resolve, reject) => {
      const fileWriteStream = fs.createWriteStream(filePath);
      inputStream
        .pipe(fileWriteStream)
        .on('finish', resolve)
        .on('error', reject);
    });
  },

  async bodyToTriples(body, contentType) {
    return new Promise((resolve, reject) => {
      if (contentType === 'application/ld+json' && typeof body === 'object') body = JSON.stringify(body);
      const textStream = streamifyString(body);
      let res = [];
      rdfParser
        .parse(textStream, {
          contentType
        })
        .on('data', quad => res.push(quad))
        .on('error', error => reject(error))
        .on('end', () => resolve(res));
    });
  },
  // Filter out triples whose subject is not the resource itself
  // We don't want to update or delete resources with IDs
  filterOtherNamedNodes(triples, resourceUri) {
    return triples.filter(triple => !(triple.subject.termType === 'NamedNode' && triple.subject.value !== resourceUri));
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
  async createDisassembly(ctx, disassembly, newData) {
    for (let disassemblyConfig of disassembly) {
      if (newData[disassemblyConfig.path]) {
        let disassemblyValue = newData[disassemblyConfig.path];
        if (!Array.isArray(disassemblyValue)) {
          disassemblyValue = [disassemblyValue];
        }
        const uriAdded = [];
        for (let resource of disassemblyValue) {
          let { id, ...resourceWithoutId } = resource;
          const newResourceUri = await ctx.call('ldp.resource.post', {
            containerUri: disassemblyConfig.container,
            resource: {
              '@context': newData['@context'],
              ...resourceWithoutId
            },
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          });
          uriAdded.push({
            '@id': newResourceUri,
            '@type': '@id'
          });
        }
        newData[disassemblyConfig.path] = uriAdded;
      }
    }
  },
  async updateDisassembly(ctx, disassembly, newData, oldData, method) {
    for (let disassemblyConfig of disassembly) {
      let uriAdded = [],
        uriRemoved = [],
        uriKept = [];

      let oldDisassemblyValue = defaultToArray(oldData[disassemblyConfig.path]) || [];
      let newDisassemblyValue = defaultToArray(newData[disassemblyConfig.path]) || [];
      oldDisassemblyValue = oldDisassemblyValue.map(v => cleanDisassemblyPerdicate(v));
      newDisassemblyValue = newDisassemblyValue.map(v => cleanDisassemblyPerdicate(v));

      let resourcesToAdd = newDisassemblyValue.filter(
        t1 => !oldDisassemblyValue.some(t2 => t1.clean['@id'] === t2.clean['@id'])
      );
      let resourcesToRemove = oldDisassemblyValue.filter(
        t1 => !newDisassemblyValue.some(t2 => t1.clean['@id'] === t2.clean['@id'])
      );

      let resourcesToKeep = newDisassemblyValue.filter(t1 =>
        oldDisassemblyValue.some(t2 => t1.clean['@id'] === t2.clean['@id'])
      );

      if (resourcesToAdd) {
        for (let resource of resourcesToAdd) {
          if (!(typeof resource.origin === 'string' || resource.origin instanceof String)) {
            const newResourceUri = await ctx.call('ldp.resource.post', {
              containerUri: disassemblyConfig.container,
              resource: {
                '@context': newData['@context'],
                ...resource.clean
              },
              contentType: MIME_TYPES.JSON,
              webId: 'system'
            });
            uriAdded.push({
              '@id': newResourceUri,
              '@type': '@id'
            });
          } else {
            throw new Error('disassembly can not create resource from string');
          }
        }
      }

      if (method === 'PUT' || (method === 'PATCH' && newData[disassemblyConfig.path] != undefined)) {
        if (resourcesToRemove) {
          for (let resource of resourcesToRemove) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: resource.clean['@id'],
              webId: 'system'
            });
            uriRemoved.push({
              '@id': resource.clean['@id'],
              '@type': '@id'
            });
          }
        }

        if (resourcesToKeep) {
          for (let resource of resourcesToKeep) {
            if (resource.origin['@id'] != undefined || resource.origin.id != undefined) {
              await ctx.call('ldp.resource.put', {
                resourceUri: resource.clean['@id'],
                resource: {
                  '@context': newData['@context'],
                  ...resource.clean
                },
                contentType: MIME_TYPES.JSON,
                webId: 'system'
              });
              uriRemoved.push({
                '@id': resource.clean['@id'],
                '@type': '@id'
              });
            } else {
              //Nothing to do resource because resource is only uri and not antity to update
            }
          }
          uriKept = resourcesToKeep.map(r => ({
            '@id': r.clean['@id'],
            '@type': '@id'
          }));
        }
      } else if (method === 'PATCH' && newData[disassemblyConfig.path] == undefined) {
        uriKept = oldDisassemblyValue.map(r => ({
          '@id': r.clean['@id'],
          '@type': '@id'
        }));
      } else {
        throw new Error('Unknown method ' + method);
      }

      oldData[disassemblyConfig.path] = [...uriRemoved, ...uriKept];
      newData[disassemblyConfig.path] = [...uriKept, ...uriAdded];
    }
  },
  async deleteDisassembly(ctx, disassembly, resource) {
    for (let disassemblyConfig of disassembly) {
      if (resource[disassemblyConfig.path]) {
        let disassemblyValue = resource[disassemblyConfig.path];
        if (!Array.isArray(disassemblyValue)) {
          disassemblyValue = [disassemblyValue];
        }
        for (let resource of disassemblyValue) {
          await ctx.call('ldp.resource.delete', {
            resourceUri: resource['@id'] || resource['id'] || resource,
            webId: 'system'
          });
        }
      }
    }
  }
};
