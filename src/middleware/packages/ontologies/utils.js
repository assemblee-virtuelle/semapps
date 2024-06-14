const arrayOf = value => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};

const isURL = value => (typeof value === 'string' || value instanceof String) && value.startsWith('http');

module.exports = {
  arrayOf,
  isURL
};
