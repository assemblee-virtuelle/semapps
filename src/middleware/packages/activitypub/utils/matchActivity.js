const { defaultToArray } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');

/**
 * Match an activity against a pattern
 * If there is a match, return the activity dereferenced according to the pattern
 * @param {object | (dereferencedActivity, fetcher) => Promise<boolean>} matcher An activity object pattern or an async function that returns true upon match.
 * @param {object} activity The activity to match for.
 * @param {(resourceUri) => Promise<object>} fetcher Fetch the resources and return it in JSON-LD format, or false if the fetch failed
 * @returns {object} The dereferenced activity / object.
 */
const matchActivity = async (matcher, activity, fetcher) => {
  if (!matcher) return { match: false, dereferencedActivity: activity };
  if (matcher === '*') return { match: true, dereferencedActivity: activity };

  // If the matcher is a function, call it
  if (typeof matcher === 'function') {
    return await matcher(activity, fetcher);
  }

  // Check if we need to dereference the activity or object
  let dereferencedActivity;
  if (typeof activity === 'string') {
    dereferencedActivity = await fetcher(activity);
    if (!dereferencedActivity) return { match: false, dereferencedActivity: activity };
  } else {
    // Copy the object to a new object
    dereferencedActivity = { ...activity };
  }

  for (const key of Object.keys(matcher)) {
    if (typeof matcher[key] === 'object' && !Array.isArray(matcher[key])) {
      const matchResults = await matchActivity(matcher[key], dereferencedActivity[key], fetcher);
      if (matchResults.match) {
        dereferencedActivity[key] = matchResults.dereferencedActivity;
      } else {
        return { match: false, dereferencedActivity };
      }
    } else if (
      !dereferencedActivity[key] ||
      !defaultToArray(dereferencedActivity[key]).some(v => defaultToArray(matcher[key]).includes(v))
    ) {
      return { match: false, dereferencedActivity };
    }
  }

  // We have a match !
  return { match: true, dereferencedActivity };
};

module.exports = matchActivity;
