const isURL = value => (typeof value === 'string' || value instanceof String) && value.startsWith('http');
const isObject = value => typeof value === 'object' && !Array.isArray(value) && value !== null;

const mergeObjectInArray = (obj, arr) => {
  let result;
  // Check if there is already an object in the array
  const objectIndex = arr.findIndex(item => isObject(item));
  if (objectIndex === -1) {
    // No object in the array, append the object
    result = [...arr, obj];
  } else {
    result = [...arr];
    result[objectIndex] = { ...result[objectIndex], ...obj };
  }
  // Put URLs before the object
  return result.sort((a, b) => (isURL(a) ? (isURL(b) ? 0 : -1) : isURL(b) ? 1 : 0));
};

module.exports = {
  visibility: 'public',
  params: {
    a: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    b: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    }
  },
  async handler(ctx) {
    const { a, b } = ctx.params;

    if (!a) return b;
    if (!b) return a;

    if (Array.isArray(a)) {
      if (Array.isArray(b)) {
        return [...a, ...b];
      } else if (isURL(b)) {
        return [...a, b];
      } else if (isObject(b)) {
        return mergeObjectInArray(b, a);
      }
    } else if (isURL(a)) {
      if (Array.isArray(b)) {
        return [a, ...b];
      } else if (isURL(b)) {
        return [a, b];
      } else if (isObject(b)) {
        return [a, b];
      }
    } else if (isObject(a)) {
      if (Array.isArray(b)) {
        return mergeObjectInArray(a, b);
      } else if (isURL(b)) {
        return [b, a];
      } else if (isObject(b)) {
        return { ...a, ...b };
      }
    }

    throw new Error('Could not merge JSON-LD contexts');
  }
};
