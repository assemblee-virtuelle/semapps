const leftPad =
  (nb = 2) =>
  (value) =>
    ('0'.repeat(nb) + value).slice(-nb);
const leftPad4 = leftPad(4);
const leftPad2 = leftPad(2);

// yyyy-MM-ddThh:mm
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/**
 * @param {Date} value value to convert
 * @returns {string} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */
const convertDateToString = (value) => {
  if (!(value instanceof Date) || isNaN(value.getDate())) {
    return '';
  }

  const yy = leftPad4(value.getFullYear());
  const MM = leftPad2(value.getMonth() + 1);
  const dd = leftPad2(value.getDate());
  const hh = leftPad2(value.getHours());
  const mm = leftPad2(value.getMinutes());
  return `${yy}-${MM}-${dd}T${hh}:${mm}`;
};

/**
 * Converts a date from the Redux store, with timezone, to a date string
 * without timezone for use in an <input type="datetime-local" />.
 * @param {Date | string} value date string or object
 */
export const dateTimeFormatter = (value) => {
  // null, undefined and empty string values should not go through convertDateToString
  // otherwise, it returns undefined and will make the input an uncontrolled one.
  if (value == null || value === '') {
    return '';
  }

  if (value instanceof Date) {
    return convertDateToString(value);
  }

  // valid dates should not be converted
  if (dateTimeRegex.test(value)) {
    return value;
  }

  return convertDateToString(new Date(value));
};

/**
 * Converts a datetime string without timezone to a date object
 * with timezone, using the browser timezone.
 * @param {string} value Date string, formatted as yyyy-MM-ddThh:mm
 * @returns {Date}
 */
export const dateTimeParser = (value) => (value ? new Date(value) : '');
