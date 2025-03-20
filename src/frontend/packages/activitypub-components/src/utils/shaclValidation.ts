import SHACLValidator from 'rdf-validate-shacl';
import rdf from 'rdf-ext';
import JsonLdParser from '@rdfjs/parser-jsonld';
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import ParserN3 from '@rdfjs/parser-n3';

// Cache of SHACL validators
const validatorCache: Record<string, SHACLValidator> = {};

// Helper function to convert a string to a Node.js Readable stream
const stringToStream = (str: string): ReadableWebToNodeStream => {
  // Create a TextEncoder to convert string to Uint8Array
  const encoder: TextEncoder = new TextEncoder();
  const uint8Array: Uint8Array = encoder.encode(str);

  // Create a ReadableStream from the Uint8Array
  const readableStream: ReadableStream = new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      controller.enqueue(uint8Array);
      controller.close();
    }
  });

  // Convert the web ReadableStream to a Node.js Readable stream
  return new ReadableWebToNodeStream(readableStream);
};

// Helper function to parse JSON-LD and convert to RDF-ext quads
const parseJsonLd = async (jsonLdObj: object, context: string[]) => {
  try {
    // Add context to the JSON-LD object if needed
    const jsonLdWithContext = {
      ...jsonLdObj,
      '@context': context
    };

    // Convert JSON-LD object to string
    const jsonString: string = JSON.stringify(jsonLdWithContext);

    // Convert string to stream using the helper function
    const textStream: ReadableWebToNodeStream = stringToStream(jsonString);

    // Use the JsonLdParser that outputs rdf-ext compatible quads directly
    const parser: JsonLdParser = new JsonLdParser({ factory: rdf });
    const quadStream: any = parser.import(textStream);

    // Collect quads into a dataset
    const dataset: any = rdf.dataset();
    for await (const quad of quadStream) {
      dataset.add(quad);
    }

    return dataset;
  } catch (error) {
    console.error('Error parsing JSON-LD:', error);
    throw error;
  }
};

// Helper function to load a SHACL shape and return a validator
const getShaclValidator = async (shapeUri: string): Promise<SHACLValidator> => {
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

  // Convert text to stream using the helper function
  const textStream: ReadableWebToNodeStream = stringToStream(turtleData);

  // Use ParserN3 which outputs rdf-ext compatible quads directly
  const parser: ParserN3 = new ParserN3({ factory: rdf });
  const quadStream: any = parser.import(textStream);

  // Collect quads into a dataset
  const shapeDataset = rdf.dataset();
  for await (const quad of quadStream) {
    shapeDataset.add(quad);
  }

  // Create and cache the SHACL validator using the dataset
  validatorCache[shapeUri] = new SHACLValidator(shapeDataset, { factory: rdf });
  return validatorCache[shapeUri];
};

const validateItems = async (
  items: Array<object>,
  shaclValidator: SHACLValidator,
  context: string[]
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
        const itemDataset = await parseJsonLd(item, context);

        // Validate against the SHACL shape
        const report = shaclValidator?.validate(itemDataset);

        return {
          item: item,
          isValid: report?.conforms
        };
      } catch (error) {
        console.error(`Error validating item ${item.id}:`, error);
        return {
          item: item,
          isValid: false
        };
      }
    })
  );
};

export { getShaclValidator, validateItems, parseJsonLd };
