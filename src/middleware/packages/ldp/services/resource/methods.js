const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const { variable } = require('rdf-data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { MoleculerError } = require('moleculer').Errors;
const fs = require('fs');

const { defaultToArray } = require('../../utils');

// TODO put each method in a different file (problems with "this" not working)
module.exports = {
  async updateSingleMirroredResources() {
    this.logger.info('updateSingleMirroredResources');
    let singles = await this.broker.call('triplestore.query', {
      query: `SELECT DISTINCT ?s WHERE { GRAPH <${this.settings.mirrorGraphName}> { ?s <http://semapps.org/ns/core#singleMirroredResource> ?o } }`
    });
    for (const single of singles) {
      try {
        const resourceUri = single.s.value;

        const response = await fetch(resourceUri, { headers: { Accept: MIME_TYPES.JSON } });
        if (response.status == 403 || response.status == 404 || response.status == 401) {
          // remove the resource from cache and from its containers
          await this.broker.call(
            'ldp.resource.delete',
            { resourceUri, webId: 'system' },
            { meta: { forceMirror: true } }
          );
          // get the list of all the containers that contain this mirrored resource we are removing
          const containers = await this.broker.call('triplestore.query', {
            query: `SELECT ?container WHERE { ?container <http://www.w3.org/ns/ldp#contains> <${resourceUri}> }`
          });
          for (let containerUri of containers.map(c => c.container.value)) {
            await this.broker.call(
              'ldp.container.detach',
              { containerUri, resourceUri, webId: 'system' },
              { meta: { forceMirror: true } }
            );
          }
        } else {
          // update the local cache
          let resource = await response.json();
          resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;

          await this.broker.call('ldp.resource.put', { resource, contentType: MIME_TYPES.JSON });
        }
      } catch (e) {
        // connection errors are not counted as errors that indicate the resource is gone.
        // those error just indicate that the remote server is not responding. can be temporary.
        this.logger.warn('Failed to update single mirrored resource' + single.s.value);
        console.error(e);
      }
    }
  },
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
    if (contentType === MIME_TYPES.JSON) {
      return await this.broker.call('jsonld.toQuads', { input: body });
    } else {
      if (!(typeof body == 'string')) throw new MoleculerError('no body provided', 400, 'BAD_REQUEST');
      return new Promise((resolve, reject) => {
        const textStream = streamifyString(body);
        let res = [];
        rdfParser
          .parse(textStream, { contentType })
          .on('data', quad => res.push(quad))
          .on('error', error => reject(error))
          .on('end', () => resolve(res));
      });
    }
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
          const newResourceUri = await ctx.call('ldp.container.post', {
            containerUri: disassemblyConfig.container,
            resource: {
              '@context': newData['@context'],
              ...resourceWithoutId
            },
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          });
          uriAdded.push({ '@id': newResourceUri, '@type': '@id' });
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

      let resourcesToAdd = newDisassemblyValue.filter(
        t1 => !oldDisassemblyValue.some(t2 => (t1.id || t1['@id']) === (t2.id || t2['@id']))
      );
      let resourcesToRemove = oldDisassemblyValue.filter(
        t1 => !newDisassemblyValue.some(t2 => (t1.id || t1['@id']) === (t2.id || t2['@id']))
      );
      let resourcesToKeep = oldDisassemblyValue.filter(t1 =>
        newDisassemblyValue.some(t2 => (t1.id || t1['@id']) === (t2.id || t2['@id']))
      );

      if (resourcesToAdd) {
        for (let resource of resourcesToAdd) {
          delete resource.id;

          const newResourceUri = await ctx.call('ldp.container.post', {
            containerUri: disassemblyConfig.container,
            resource: {
              '@context': newData['@context'],
              ...resource
            },
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          });
          uriAdded.push({ '@id': newResourceUri, '@type': '@id' });
        }
      }

      if (method === 'PUT') {
        if (resourcesToRemove) {
          for (let resource of resourcesToRemove) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: resource['@id'] || resource['id'] || resource,
              webId: 'system'
            });
            uriRemoved.push({ '@id': resource['@id'] || resource['id'] || resource, '@type': '@id' });
          }
        }

        if (resourcesToKeep) {
          uriKept = resourcesToKeep.map(r => ({ '@id': r['@id'] || r.id || r, '@type': '@id' }));
        }
      } else if (method === 'PATCH') {
        uriKept = oldDisassemblyValue.map(r => ({ '@id': r['@id'] || r.id || r, '@type': '@id' }));
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
