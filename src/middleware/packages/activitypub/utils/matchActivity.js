const { defaultToArray } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');

const defaultFetcher = (ctx, resourceUri) =>
  ctx.call('ldp.resource.get', {
    resourceUri,
    accept: MIME_TYPES.JSON
  });

/**
 * Match an activity against a pattern
 * If there is a match, return the activity dereferenced according to the pattern
 * @param {object} ctx The moleculer context
 * @param {object | (ctx, dereferencedActivity) => Promise<boolean>} matcher An activity object pattern or an async function that returns true upon match.
 * @param {object} activityOrObject The activity to match for.
 * @param {(ctx, resourceUri) => Promise<object>} fetcher Fetch the resources and return it in JSON-LD format.
 * @returns {object} The dereferenced activity / object.
 */
const matchActivity = async (ctx, matcher, activityOrObject, fetcher = defaultFetcher) => {
  if (!matcher) return false;

  // If the matcher is a function, call it
  if (typeof matcher === 'function') {
    return await matcher(ctx, activityOrObject);
  }

  // Check if we need to dereference the activity or object
  let dereferencedActivityOrObject;
  if (typeof activityOrObject === 'string') {
    try {
      dereferencedActivityOrObject = await fetcher(ctx, activityOrObject);
    } catch (e) {
      if (e.code === 404) {
        // Ignore 404 errors as they may happen when objects are deleted in side effects
        console.warn(`Could not dereference ${activityOrObject} as it is not found`);
        dereferencedActivityOrObject = { error: e.message };
      } else {
        throw new Error(e);
      }
    }
  } else {
    // Copy the object to a new object
    dereferencedActivityOrObject = { ...activityOrObject };
  }

  for (const key of Object.keys(matcher)) {
    if (typeof matcher[key] === 'object' && !Array.isArray(matcher[key])) {
      dereferencedActivityOrObject[key] = await matchActivity(
        ctx,
        matcher[key],
        dereferencedActivityOrObject[key],
        fetcher
      );
      if (!dereferencedActivityOrObject[key]) return false;
    } else if (
      !dereferencedActivityOrObject[key] ||
      !defaultToArray(dereferencedActivityOrObject[key]).some(v => defaultToArray(matcher[key]).includes(v))
    )
      return false;
  }

  // We have a match ! Return the dereferenced object
  return dereferencedActivityOrObject;
};

module.exports = matchActivity;
