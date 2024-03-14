const asArray = valueOrList => {
  if (Array.isArray(valueOrList)) {
    return valueOrList;
  } else {
    return [valueOrList];
  }
};

module.exports = { asArray };
