import rdf from 'rdf-ext';
import { Validator } from 'shacl-engine';
import { jsonld } from '@activitypods/shape-definitions';
import { LdoBase, LdoDataset, ShapeType } from '@ldo/ldo';
import { parseJsonLd } from '../utils';
import { parseTurtle } from './streamUtils';

const activitystreams = jsonld.activitystreams;

// Cache of SHACL validators
const validatorCache: Record<string, Validator> = {};

/**
 * Returns a SHACL validator for ActivityStreams shapes.
 *
 * This function creates a SHACL validator for ActivityStreams shapes using the
 * `@activitypods/shape-definitions` package. It caches the validator to avoid
 * creating it multiple times.
 *
 * @returns A Promise that resolves to a SHACL Validator instance.
 */
const getActivityStreamsValidator = async (): Promise<Validator> => {
  // Check if the validator is already cached
  if (validatorCache.activityStreams) {
    return validatorCache.activityStreams;
  }

  try {
    const shapeDataset = await parseTurtle(activitystreams);

    // Create and cache the SHACL validator using the dataset
    validatorCache.activityStreams = new Validator(shapeDataset, { factory: rdf, debug: true });

    return validatorCache.activityStreams;
  } catch (error) {
    throw new Error(
      `Failed to create ActivityStreams validator: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  const shapeDataset = await parseTurtle(activitystreams);

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

  try {
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
  } catch (error) {
    throw new Error(
      `Failed to create SHACL validator for ${shapeUri}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Validates an array of items against a SHACL shape and returns the validation results.
 *
 * @param items The items to validate
 * @param shaclValidator The SHACL validator to use
 * @param context The context to use for the items
 *
 * @returns An array of objects containing the item and its validation result
 */
const validateItems = async (
  items: Array<object>,
  shaclValidator: Validator,
  context: string | string[] | Record<string, string>
): Promise<Array<{ item: object; isValid: boolean }>> => {
  if (!shaclValidator) {
    throw new Error('validateItems: shaclValidator is required');
  }
  return Promise.all(
    items.map(async (item: any) => {
      try {
        if (!item['@context']) item['@context'] = context;
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

/**
 * Validates a subject against a set of SHACL shapes and returns the typed item if valid.
 *
 * @param subjectUri The subject to validate
 * @param dataset The dataset containing the subject
 * @param shapeTypes The shape types to validate against
 * @param validator The SHACL validator to use
 *
 * @returns A typed item if valid, or null if not valid
 */
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

  if (!validationReport.conforms) return null;
  const { results } = validationReport;

  // Find the shape that matched the item in the report results.
  const shapeType = shapeTypes.find(st =>
    results.find((res: any) => res.focusNode === subjectUri && res.shape === st.shape)
  );

  if (!shapeType) return null;

  const typedItem = dataset.usingType(shapeType).fromSubject(subjectUri);
  return typedItem;
};

export { getShaclValidator, validateItems, getActivityStreamsValidator, getAndValidateLdoSubject };
