import fs from 'fs';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'byte... Remove this comment to see the full error message
import bytes from 'bytes';
import rdfparseModule from 'rdf-parse';
import streamifyString from 'streamify-string';
import { variable } from '@rdfjs/data-model';
import { MIME_TYPES } from '@semapps/mime-types';
import { Errors } from 'moleculer';

const rdfParser = rdfparseModule.default;

const { MoleculerError } = Errors;

// TODO put each method in a different file (problems with "this" not working)
export default {
  streamToFile(inputStream: any, filePath: any, maxSize: any) {
    return new Promise((resolve, reject) => {
      const fileWriteStream = fs.createWriteStream(filePath);
      const maxSizeInBytes = maxSize && bytes.parse(maxSize);
      let fileSize = 0;
      inputStream
        .on('data', (chunk: any) => {
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
  // @ts-expect-error
  async bodyToTriples(body, contentType) {
    if (contentType === MIME_TYPES.JSON) {
      // @ts-expect-error
      return await this.broker.call('jsonld.parser.toQuads', { input: body });
    }
    if (!(typeof body === 'string')) throw new MoleculerError('no body provided', 400, 'BAD_REQUEST');
    return new Promise((resolve, reject) => {
      const textStream = streamifyString(body);
      // @ts-expect-error
      const res = [];
      rdfParser
        .parse(textStream, { contentType })
        .on('data', quad => res.push(quad))
        .on('error', error => reject(error))
        // @ts-expect-error
        .on('end', () => resolve(res));
    });
  },
  // Filter out triples whose subject is not the resource itself
  // We don't want to update or delete resources with IDs
  filterOtherNamedNodes(triples: any, resourceUri: any) {
    return triples.filter(
      (triple: any) => !(triple.subject.termType === 'NamedNode' && triple.subject.value !== resourceUri)
    );
  },
  convertBlankNodesToVars(triples: any) {
    return triples.map((triple: any) => {
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
  getTriplesDifference(triples1: any, triples2: any) {
    return triples1.filter((t1: any) => !triples2.some((t2: any) => t1.equals(t2)));
  },
  nodeToString(node: any) {
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
  buildJsonVariable(identifier: any, triples: any) {
    const blankVariables = triples.filter((t: any) => t.subject.value.localeCompare(identifier) === 0);
    const json = {};
    let allIdentifiers = [identifier];
    for (const blankVariable of blankVariables) {
      if (blankVariable.object.termType === 'Variable') {
        const jsonVariable = this.buildJsonVariable(blankVariable.object.value, triples);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        json[blankVariable.predicate.value] = jsonVariable.json;
        allIdentifiers = allIdentifiers.concat(jsonVariable.allIdentifiers);
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        json[blankVariable.predicate.value] = blankVariable.object.value;
      }
    }
    return { json, allIdentifiers };
  },
  removeDuplicatedVariables(triples: any) {
    const roots = triples.filter((n: any) => n.object.termType === 'Variable' && n.subject.termType !== 'Variable');
    const rootsIdentifiers = roots.reduce((previousValue: any, currentValue: any) => {
      const result = previousValue;
      if (!result.find((i: any) => i.localeCompare(currentValue.object.value) === 0)) {
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
    const keepVariables: any = [];
    const duplicatedVariables = [];
    for (var rootJson of rootsJson) {
      // @ts-expect-error TS(7006): Parameter 'kp' implicitly has an 'any' type.
      if (keepVariables.find(kp => kp.stringified.localeCompare(rootJson.stringified) === 0)) {
        duplicatedVariables.push(rootJson);
      } else {
        keepVariables.push(rootJson);
      }
    }
    const allRemovedIdentifiers = duplicatedVariables.map(dv => dv.allIdentifiers).flat();
    const removedDuplicatedVariables = triples.filter(
      (t: any) => !allRemovedIdentifiers.includes(t.object.value) && !allRemovedIdentifiers.includes(t.subject.value)
    );
    return removedDuplicatedVariables;
  },
  triplesToString(triples: any) {
    return triples
      .map(
        (triple: any) =>
          `${this.nodeToString(triple.subject)} <${triple.predicate.value}> ${this.nodeToString(triple.object)} .`
      )
      .join('\n');
  },
  bindNewBlankNodes(triples: any) {
    return triples.map((triple: any) => `BIND (BNODE() AS ?${triple.object.value}) .`).join('\n');
  }
};
