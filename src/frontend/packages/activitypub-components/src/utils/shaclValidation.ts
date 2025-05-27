import type { Quad } from '@rdfjs/types';
// import SHACLValidator from '@rdf-ext/shacl';
import rdf from 'rdf-ext';
import { Validator } from 'shacl-engine';
import ParserN3 from '@rdfjs/parser-n3';
import { ActivityStreamsShape } from '@activitypods/shape-definitions';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { parseJsonLd } from '../utils';

// Cache of SHACL validators
const validatorCache: Record<string, typeof Validator> = {};

const getActivityStreamsValidator = async (): Promise<typeof Validator> => {
  // Check if the validator is already cached
  if (validatorCache.activityStreams) {
    return validatorCache.activityStreams;
  }

  const shapeDataset = await parseTurtle(ActivityStreamsShape);

  // Create and cache the SHACL validator using the dataset
  validatorCache.activityStreams = new Validator(shapeDataset, { factory: rdf, debug: true });

  return validatorCache.activitystreams;
};

// Helper function to convert a string to a Node.js Readable stream
const stringToStream = (str: string) => {
  // Create a ReadableStream from the Uint8Array
  const readableStream: ReadableStream = new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      controller.enqueue(str);
      controller.close();
    }
  });
  return readableStream;
};

// Helper function to load a SHACL shape and return a validator
const getShaclValidator = async (shapeUri: string): Promise<typeof Validator> => {
  // Check if the validator is already cached
  if (validatorCache[shapeUri]) {
    return validatorCache[shapeUri];
  }

  const response = await fetch(shapeUri, {
    headers: {
      Accept: 'text/turtle'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to load shape: ${response.status} ${response.statusText}`);
  }

  // Get the Turtle data as text
  const turtleData: string = await response.text();
  const shapeDataset = await parseTurtle(turtleData);

  // Create and cache the SHACL validator using the dataset
  validatorCache[shapeUri] = new Validator(shapeDataset, { factory: rdf });
  return validatorCache[shapeUri];
};

const validateItems = async (
  items: Array<object>,
  shaclValidator: typeof Validator,
  context: string | string[] | Record<string, string>
): Promise<Array<{ item: object; isValid: boolean }>> => {
  if (!shaclValidator) {
    throw new Error('validateItems: shaclValidator is required');
  }
  if (!context) {
    throw new Error('validateItems: context is required');
  }
  return Promise.all(
    items.map(async (item: any) => {
      try {
        // Create a dataset from the item's JSON-LD
        const itemDataset = await parseJsonLd(item);

        // Validate against the SHACL shape
        const report = shaclValidator.validate({ dataset: itemDataset });

        return {
          item: item,
          isValid: report.conforms
        };
      } catch (error) {
        return {
          item,
          isValid: false,
          error
        };
      }
    })
  );
};

const parseTurtle = async (turtleData: string): Promise<DatasetExt> => {
  // Convert Turtle data to a stream
  const textStream: ReadableWebToNodeStream = stringToStream(turtleData);

  // Use ParserN3 which outputs rdf-ext compatible quads directly
  const parser: ParserN3 = new ParserN3({ factory: rdf });
  const quadStream: any = parser.import(textStream);
  const dataset = await rdf.dataset().import(quadStream);
  return dataset;
};

export { getShaclValidator, validateItems, getActivityStreamsValidator };
