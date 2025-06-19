import fs from 'fs';
import bytes from 'bytes';
import rdfparseModule from 'rdf-parse';
const rdfParser = rdfparseModule.default;
import streamifyString from 'streamify-string';
import { variable } from '@rdfjs/data-model';
import { MIME_TYPES } from '@semapps/mime-types';
const { MoleculerError } = require('moleculer').Errors;

// TODO put each method in a different file (problems with "this" not working)
module.exports = {
  streamToFile(inputStream, filePath, maxSize) {
    return new Promise((resolve, reject) => {
      const fileWriteStream = fs.createWriteStream(filePath);
      const maxSizeInBytes = maxSize && bytes.parse(maxSize);
      let fileSize = 0;
      inputStream
        .on('data', chunk => {
          if (maxSizeInBytes) {
            fileSize += chunk.length;
            if (fileSize > maxSizeInBytes) {
              fileWriteStream.destroy(); // Stop persisting the file
              reject(new MoleculerError(`The file size is limited to ${maxSize}`, 413, 'CONTENT TOO LARGE'));
            }
          }
        })
        .pipe(fileWriteStream)
        .on('finish', resolve)
        .on('error', reject);
    });
  },
  async bodyToTriples(body, contentType) {
    if (contentType === MIME_TYPES.JSON) {
      return await this.broker.call('jsonld.parser.toQuads', { input: body });
    }
    if (!(typeof body === 'string')) throw new MoleculerError('no body provided', 400, 'BAD_REQUEST');
    return new Promise((resolve, reject) => {
      const textStream = streamifyString(body);
      const res = [];
      rdfParser
        .parse(textStream, { contentType })
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
        triple.subject = variable(triple.subject.value);
      }
      if (triple.object.termType === 'BlankNode') {
        triple.object = variable(triple.object.value);
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
          return `'''${node.value?.replace(/'/g, "\\'")}'''`;
        } else if (node.datatype.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString') {
          return `'''${node.value}'''@${node.language}`;
        } else {
          return `"${node.value}"^^<${node.datatype.value}>`;
        }

      default:
        throw new Error(`Unknown node type: ${node.termType}`);
    }
  },
  buildJsonVariable(identifier, triples) {
    const blankVariables = triples.filter(t => t.subject.value.localeCompare(identifier) === 0);
    const json = {};
    let allIdentifiers = [identifier];
    for (const blankVariable of blankVariables) {
      if (blankVariable.object.termType === 'Variable') {
        const jsonVariable = this.buildJsonVariable(blankVariable.object.value, triples);
        json[blankVariable.predicate.value] = jsonVariable.json;
        allIdentifiers = allIdentifiers.concat(jsonVariable.allIdentifiers);
      } else {
        json[blankVariable.predicate.value] = blankVariable.object.value;
      }
    }
    return { json, allIdentifiers };
  },
  removeDuplicatedVariables(triples) {
    const roots = triples.filter(n => n.object.termType === 'Variable' && n.subject.termType !== 'Variable');
    const rootsIdentifiers = roots.reduce((previousValue, currentValue) => {
      const result = previousValue;
      if (!result.find(i => i.localeCompare(currentValue.object.value) === 0)) {
        result.push(currentValue.object.value);
      }
      return result;
    }, []);
    const rootsJson = [];
    for (const rootIdentifier of rootsIdentifiers) {
      const jsonVariable = this.buildJsonVariable(rootIdentifier, triples);
      rootsJson.push({
        rootIdentifier,
        stringified: JSON.stringify(jsonVariable.json),
        allIdentifiers: jsonVariable.allIdentifiers
      });
    }
    const keepVariables = [];
    const duplicatedVariables = [];
    for (var rootJson of rootsJson) {
      if (keepVariables.find(kp => kp.stringified.localeCompare(rootJson.stringified) === 0)) {
        duplicatedVariables.push(rootJson);
      } else {
        keepVariables.push(rootJson);
      }
    }
    const allRemovedIdentifiers = duplicatedVariables.map(dv => dv.allIdentifiers).flat();
    const removedDuplicatedVariables = triples.filter(
      t => !allRemovedIdentifiers.includes(t.object.value) && !allRemovedIdentifiers.includes(t.subject.value)
    );
    return removedDuplicatedVariables;
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
  }
};
