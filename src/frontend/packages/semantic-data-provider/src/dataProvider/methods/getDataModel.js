const getDataModel = config => resourceId => {
  return config.resources[resourceId];
};

export default getDataModel;
