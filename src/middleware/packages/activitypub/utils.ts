import { ACTIVITY_TYPES } from './constants.ts';

// @ts-expect-error TS(7023): 'objectCurrentToId' implicitly has return type 'an... Remove this comment to see the full error message
const objectCurrentToId = (activityJson: any) => {
  if (activityJson.object && typeof activityJson.object === 'object' && activityJson.object.current) {
    const { current, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        id: current,
        ...objectCurrentToId(object)
      }
    };
  }
  return activityJson;
};

// @ts-expect-error TS(7023): 'objectIdToCurrent' implicitly has return type 'an... Remove this comment to see the full error message
const objectIdToCurrent = (activityJson: any) => {
  // If the activity has an object predicate, and this object is not an activity
  if (
    activityJson.object &&
    typeof activityJson.object === 'object' &&
    !Object.values(ACTIVITY_TYPES).includes(activityJson.object.type)
  ) {
    const { id, '@id': arobaseId, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        current: id || arobaseId,
        ...objectIdToCurrent(object)
      }
    };
  }
  return activityJson;
};

const collectionPermissionsWithAnonRead = (webId: any) => {
  const permissions = {
    anon: {
      read: true
    }
  };

  if (webId !== 'anon' && webId !== 'system') {
    // @ts-expect-error TS(2339): Property 'user' does not exist on type '{ anon: { ... Remove this comment to see the full error message
    permissions.user = {
      uri: webId,
      read: true,
      write: true,
      control: true
    };
  }

  return permissions;
};

const getSlugFromUri = (str: any) => str.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
const getContainerFromUri = (str: any) => str.match(new RegExp(`(.*)/.*`))[1];

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

const arrayOf = (value: any) => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};

/*
 * Call a callback and expect the result object to have all properties in `fieldNames`.
 * If not, try again after `delayMs` until `maxTries` is reached.
 * If `fieldNames` is `undefined`, the return value of `callback` is expected to not be
 * `undefined`.
 * @type {import("./utilTypes").waitForResource}
 */
const waitForResource = async (delayMs: any, fieldNames: any, maxTries: any, callback: any) => {
  let result: any;
  for (let i = 0; i < maxTries; i += 1) {
    result = await callback();
    // If a result (and the expected field, if required) is present, return.
    if (result !== undefined && arrayOf(fieldNames).every(fieldName => Object.keys(result).includes(fieldName))) {
      return result;
    }
    await delay(delayMs);
  }

  const missingProperties = result && fieldNames.filter((fieldName: any) => !Object.keys(result).includes(fieldName));

  throw new Error(
    `Waiting for resource failed. No results after ${maxTries} tries. The resource is ${
      result === undefined ? 'undefined' : `missing the following properties: ${JSON.stringify(missingProperties)}`
    }.`
  );
};

const getValueFromDataType = (result: any) => {
  switch (result.datatype?.value) {
    case 'http://www.w3.org/2001/XMLSchema#boolean':
      return result.value === 'true';

    case 'http://www.w3.org/2001/XMLSchema#integer':
      return parseInt(result.value, 10);

    default:
      return result.value;
  }
};

export {
  objectCurrentToId,
  objectIdToCurrent,
  collectionPermissionsWithAnonRead,
  getSlugFromUri,
  getContainerFromUri,
  delay,
  arrayOf,
  waitForResource,
  getValueFromDataType
};
