const { defaultToArray } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');

/*
 * Match an activity against a pattern
 * If there is a match, return the activity dereferenced according to the pattern
 */
const matchActivity = async (ctx, pattern, activityOrObject) => {
  let dereferencedActivityOrObject;

  // Check if we need to dereference the activity or object
  if (typeof activityOrObject === 'string') {
    try {
      dereferencedActivityOrObject = await ctx.call('ldp.resource.get', {
        resourceUri: activityOrObject,
        accept: MIME_TYPES.JSON
      });
    } catch (e) {
      if (e.code === 404) {
        // Ignore 404 errors as they may happen when objects are deleted in side effects
        this.logger.warn(`Could not dereference ${activityOrObject} as it is not found`);
        dereferencedActivityOrObject = { error: e.message };
      } else {
        throw new Error(e);
      }
    }
  } else {
    // Copy the object to a new object
    dereferencedActivityOrObject = { ...activityOrObject };
  }

  for (const key of Object.keys(pattern)) {
    if (typeof pattern[key] === 'object' && !Array.isArray(pattern[key])) {
      dereferencedActivityOrObject[key] = await matchActivity(ctx, pattern[key], dereferencedActivityOrObject[key]);
      if (!dereferencedActivityOrObject[key]) return false;
    } else if (
      !dereferencedActivityOrObject[key] ||
      !defaultToArray(dereferencedActivityOrObject[key]).some(v => defaultToArray(pattern[key]).includes(v))
    )
      return false;
  }

  // We have a match ! Return the dereferenced object
  return dereferencedActivityOrObject;
};

module.exports = matchActivity;
