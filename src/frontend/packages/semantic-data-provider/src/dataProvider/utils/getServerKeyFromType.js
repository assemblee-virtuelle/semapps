const getServerKeyFromType = (type, dataServers) => {
  return (
    dataServers &&
    Object.keys(dataServers).find(key => {
      return dataServers[key][type];
    })
  );
};

export default getServerKeyFromType;
