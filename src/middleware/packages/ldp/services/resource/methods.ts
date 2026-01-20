import rdfParser from 'rdf-parse';
import streamifyString from 'streamify-string';
import rdf from '@rdfjs/data-model';
import { NamedNode, Quad, Variable, Literal } from '@rdfjs/types';
import { MIME_TYPES } from '@semapps/mime-types';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

// TODO put each method in a different file (problems with "this" not working)
export default {
  async bodyToTriples(body: any, contentType: string) {
    if (contentType === MIME_TYPES.JSON) {
      // @ts-expect-error
      return await this.broker.call('jsonld.parser.toQuads', { input: body });
    }
    if (!(typeof body === 'string')) throw new MoleculerError('no body provided', 400, 'BAD_REQUEST');
    return new Promise((resolve, reject) => {
      const textStream = streamifyString(body);
      const res: Quad[] = [];
      rdfParser
        // @ts-expect-error
        .parse(textStream, { contentType })
        .on('data', (quad: Quad) => res.push(quad))
        .on('error', (error: Error) => reject(error))
        .on('end', () => resolve(res));
    });
  },
  convertBlankNodesToVars(triples: Quad[]) {
    return triples.map(triple => {
      if (triple.subject.termType === 'BlankNode') {
        triple.subject = rdf.variable(triple.subject.value);
      }
      if (triple.object.termType === 'BlankNode') {
        triple.object = rdf.variable(triple.object.value);
      }
      return triple;
    });
  },
  // Exclude from triples1 the triples which also exist in triples2
  getTriplesDifference(triples1: Quad[], triples2: Quad[]) {
    return triples1.filter(t1 => !triples2.some(t2 => t1.equals(t2)));
  },
  nodeToString(node: NamedNode | Variable | Literal | any) {
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
  buildJsonVariable(identifier: any, triples: Quad[]) {
    const blankVariables = triples.filter(t => t.subject.value.localeCompare(identifier) === 0);
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
  removeDuplicatedVariables(triples: Quad[]) {
    const roots = triples.filter(t => t.object.termType === 'Variable' && t.subject.termType !== 'Variable');
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
      t => !allRemovedIdentifiers.includes(t.object.value) && !allRemovedIdentifiers.includes(t.subject.value)
    );
    return removedDuplicatedVariables;
  },
  triplesToString(triples: Quad[]) {
    return triples
      .map(
        triple =>
          `${this.nodeToString(triple.subject)} <${triple.predicate.value}> ${this.nodeToString(triple.object)} .`
      )
      .join('\n');
  },
  bindNewBlankNodes(triples: Quad[]) {
    return triples.map(triple => `BIND (BNODE() AS ?${triple.object.value}) .`).join('\n');
  }
};
