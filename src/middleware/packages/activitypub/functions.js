const objectCurrentToId = activityJson => {
  if (activityJson.object && typeof activityJson.object === 'object') {
    const { current, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        id: current,
        ...object
      }
    };
  } else {
    return activityJson;
  }
};

const objectIdToCurrent = activityJson => {
  if (activityJson.object && typeof activityJson.object === 'object') {
    const { id, '@id': arobaseId, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        current: id || arobaseId,
        ...object
      }
    };
  } else {
    return activityJson;
  }
};

module.exports = {
  objectCurrentToId,
  objectIdToCurrent
};
