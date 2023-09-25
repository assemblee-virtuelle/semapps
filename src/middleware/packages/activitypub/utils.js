const { ACTIVITY_TYPES } = require('./constants');

const objectCurrentToId = (activityJson) => {
  if (activityJson.object && typeof activityJson.object === 'object' && activityJson.object.current) {
    const { current, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        id: current,
        ...objectCurrentToId(object),
      },
    };
  }
  return activityJson;
};

const objectIdToCurrent = (activityJson) => {
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
        ...objectIdToCurrent(object),
      },
    };
  }
  return activityJson;
};

const collectionPermissionsWithAnonRead = (webId) => {
  const permissions = {
    anon: {
      read: true,
    },
  };

  if (webId !== 'anon' && webId !== 'system') {
    permissions.user = {
      uri: webId,
      read: true,
      write: true,
      control: true,
    };
  }

  return permissions;
};

// Items or recipients may be string or array, so default to array for easier handling
const defaultToArray = (value) => {
  return !value ? undefined : Array.isArray(value) ? value : [value];
};

const getSlugFromUri = (str) => str.match(new RegExp(`.*/(.*)`))[1];

/** @deprecated Use the ldp.resource.getContainers action instead */
const getContainerFromUri = (str) => str.match(new RegExp(`(.*)/.*`))[1];

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

module.exports = {
  objectCurrentToId,
  objectIdToCurrent,
  collectionPermissionsWithAnonRead,
  defaultToArray,
  getSlugFromUri,
  getContainerFromUri,
  delay,
};
