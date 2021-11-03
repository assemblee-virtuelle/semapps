const { PUBLIC_URI } = require('./constants');

const objectCurrentToId = activityJson => {
  if (activityJson.object && typeof activityJson.object === 'object') {
    const { current, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        id: current,
        ...objectCurrentToId(object)
      }
    };
  } else {
    return activityJson;
  }
};

const objectIdToCurrent = activityJson => {
  if (activityJson.object && typeof activityJson.object === 'object') {
    const { id, '@id': arobaseId, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        current: id || arobaseId,
        ...objectIdToCurrent(object)
      }
    };
  } else {
    return activityJson;
  }
};

// Items or recipients may be string or array, so default to array for easier handling
const defaultToArray = value => {
  return !value ? undefined : Array.isArray(value) ? value : [value];
};

const getSlugFromUri = str => str.match(new RegExp(`.*/(.*)`))[1];

const getContainerFromUri = str => str.match(new RegExp(`(.*)/.*`))[1];

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const isPublicActivity = activity => {
  // We accept all three representations https://www.w3.org/TR/activitypub/#public-addressing
  const publicRepresentations = [PUBLIC_URI, 'Public', 'as:Public'];
  return defaultToArray(activity.to) ? defaultToArray(activity.to).some(r => publicRepresentations.includes(r)) : false;
};

module.exports = {
  objectCurrentToId,
  objectIdToCurrent,
  defaultToArray,
  getSlugFromUri,
  getContainerFromUri,
  delay,
  isPublicActivity
};
