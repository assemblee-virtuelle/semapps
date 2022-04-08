const { ACTIVITY_TYPES } = require('../constants');
const { defaultToArray } = require('@semapps/ldp');

/*
 * Match an activity against a pattern
 * If there is a match, return the activity dereferenced according to the pattern
 */
const matchActivity = async (broker, pattern, activityOrObject) => {
  let dereferencedActivityOrObject = { ...activityOrObject };

  // Check if we need to dereference the activity or object
  if (typeof activityOrObject === 'string') {
    if (pattern.type && Object.values(ACTIVITY_TYPES).includes(pattern.type)) {
      dereferencedActivityOrObject = await broker.call('activitypub.activity.get', {
        resourceUri: activityOrObject,
        webId: 'system'
      });
    } else {
      dereferencedActivityOrObject = await broker.call('activitypub.object.get', {
        objectUri: activityOrObject,
        actorUri: 'system'
      });
    }
  }

  for (let key of Object.keys(pattern)) {
    if (typeof pattern[key] === 'object' && !Array.isArray(pattern[key])) {
      dereferencedActivityOrObject[key] = await matchActivity(broker, pattern[key], dereferencedActivityOrObject[key]);
      if (!dereferencedActivityOrObject[key]) return false;
    } else {
      if (
        !dereferencedActivityOrObject[key] ||
        !defaultToArray(dereferencedActivityOrObject[key]).some(v => defaultToArray(pattern[key]).includes(v))
      )
        return false;
    }
  }

  // We have a match ! Return the dereferenced object
  return dereferencedActivityOrObject;
};

module.exports = matchActivity;
