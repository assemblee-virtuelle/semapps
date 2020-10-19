const defaultToArray = value => {
  return !value ? undefined : Array.isArray(value) ? value : [value];
};

module.exports = {
  defaultToArray
};
