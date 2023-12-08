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

module.exports = {
  isURL,
  isObject,
  mergeObjectInArray,
  arrayOf
};
