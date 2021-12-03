const getServerKeyFromType = (type, dataServers) => {
  return Object.keys(dataServers).find(key => {
    return dataServers[key][type];
  });
};

export default getServerKeyFromType;
