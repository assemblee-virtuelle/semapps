import type { Quad } from '@rdfjs/types';
// import SHACLValidator from '@rdf-ext/shacl';
import rdf from 'rdf-ext';
import { Validator } from 'shacl-engine';
import { ActivityStreamsShape } from '@activitypods/shape-definitions';
import { parseJsonLd } from '../utils';
import { parseTurtle } from './streamUtils';
import { LdoBase, LdoDataset, ShapeType } from '@ldo/ldo';

// Cache of SHACL validators
const validatorCache: Record<string, Validator> = {};

const getActivityStreamsValidator = async (): Promise<Validator> => {
  // Check if the validator is already cached
  if (validatorCache.activityStreams) {
    return validatorCache.activityStreams;
  }

  const shapeDataset = await parseTurtle(ActivityStreamsShape);

  // Create and cache the SHACL validator using the dataset
  validatorCache.activityStreams = new Validator(shapeDataset, { factory: rdf, debug: true });

  return validatorCache.activitystreams;
};

// Helper function to load a SHACL shape and return a validator
const getShaclValidator = async (shapeUri: string): Promise<Validator> => {
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
  shaclValidator: Validator,
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

const getAndValidateLdoSubject = async <T extends LdoBase>(
  subjectUri: string,
  dataset: LdoDataset,
  shapeTypes: ShapeType<T>[],
  validator: Validator
): Promise<T | null> => {
  const validationReport = await validator.validate(
    // Terms means the entry point from which should be validated, in our case the current item.
    { dataset: dataset, terms: [rdf.namedNode(subjectUri)] },
    // Here, terms means the shapes to validate against.
    { terms: shapeTypes.map(shapeType => rdf.namedNode(shapeType.shape)) }
  );

  if (!validationReport.conforms) return [];
  const results = validationReport.results;

  // Find the shape that matched the item in the report results.
  const shapeType = shapeTypes.find(st => results.find(res => res.focusNode === subjectUri && res.shape === st.shape));

  if (!shapeType) return null;

  const typedItem = dataset.usingType(shapeType).fromSubject(subjectUri);
  return typedItem;
};

export { getShaclValidator, validateItems, getActivityStreamsValidator, getAndValidateLdoSubject };
