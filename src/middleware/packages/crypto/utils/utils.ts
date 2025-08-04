import assert from 'node:assert';

/**
 * Converts a value to an array. If the value is undefined or null, returns an empty array.
 * If the value is already an array, returns it as is. Otherwise, returns an array containing the value.
 *
 * @param {any} value The value to convert to an array.
 * @returns {Array} The resulting array.
 */
const arrayOf = value => {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

/**
 * Uses the Node.js assert.deepStrictEqual method to compare two objects.
 *
 * > Tests for deep equality between the actual and expected parameters. "Deep" equality means that the enumerable "own" properties of child objects are recursively evaluated also by the following rules.
 *
 * @param {any} object1 First object to compare
 * @param {any} object2 Second object to compare
 * @returns  {boolean} True if the objects are deeply equal, false otherwise.
 */
const deepStrictEqual = (object1, object2) => {
  try {
    assert.deepStrictEqual(object1, object2);
  } catch (error) {
    return false;
  }
  return true;
};

export { arrayOf, deepStrictEqual };
