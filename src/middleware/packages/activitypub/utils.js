const { ACTIVITY_TYPES } = require('./constants');

const objectCurrentToId = activityJson => {
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

const objectIdToCurrent = activityJson => {
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

const collectionPermissionsWithAnonRead = webId => {
  const permissions = {
    anon: {
      read: true
    }
  };

  if (webId !== 'anon' && webId !== 'system') {
    permissions.user = {
      uri: webId,
      read: true,
      write: true,
      control: true
    };
  }

  return permissions;
};

// Items or recipients may be string or array, so default to array for easier handling
const defaultToArray = value => {
  return !value ? undefined : Array.isArray(value) ? value : [value];
};

const getSlugFromUri = str => str.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
const getContainerFromUri = str => str.match(new RegExp(`(.*)/.*`))[1];

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const arrayOf = value => {
  // If the field is null-ish, we suppose there are no values.
  if (!value) {
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
const waitForResource = async (delayMs, fieldNames, maxTries, callback) => {
  for (let i = 0; i < maxTries; i += 1) {
    const result = await callback();
    // If a result (and the expected field, if required) is present, return.
    if (result !== undefined && arrayOf(fieldNames).every(fieldName => Object.keys(result).includes(fieldName))) {
      return result;
    }
    await delay(delayMs);
  }
  throw new Error('Waiting for resource failed. No results after ' + maxTries + ' tries');
};

const objectDepth = o => (Object(o) === o ? 1 + Math.max(-1, ...Object.values(o).map(objectDepth)) : 0);

module.exports = {
  objectCurrentToId,
  objectIdToCurrent,
  collectionPermissionsWithAnonRead,
  defaultToArray,
  getSlugFromUri,
  getContainerFromUri,
  delay,
  arrayOf,
  waitForResource,
  objectDepth
};
