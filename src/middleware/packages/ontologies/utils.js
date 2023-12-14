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

const isURL = value => (typeof value === 'string' || value instanceof String) && value.startsWith('http');

module.exports = {
  arrayOf,
  isURL
};
