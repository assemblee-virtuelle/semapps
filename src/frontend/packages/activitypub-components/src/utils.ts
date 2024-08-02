export const arrayOf = <T>(value: T | T[]) => {
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

export default {
  arrayOf
};

export const filterDuplicates = <T>(iterable: T[], predicate: (item: T) => string) => {
  const seen = new Set<string>();
  return iterable.filter(item => {
    const key = predicate(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
