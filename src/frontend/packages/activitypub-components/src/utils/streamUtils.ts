import ParserN3 from '@rdfjs/parser-n3';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import rdf from 'rdf-ext';

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
const parseTurtle = async (turtleData: string): Promise<DatasetExt> => {
  // Convert Turtle data to a stream
  const textStream = stringToStream(turtleData);

  // Use ParserN3 which outputs rdf-ext compatible quads directly
  const parser: ParserN3 = new ParserN3({ factory: rdf });
  const quadStream = parser.import(textStream);
  const dataset = await rdf.dataset().import(quadStream);
  return dataset;
};

export { parseTurtle, stringToStream };
