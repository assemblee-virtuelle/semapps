const getServerKeyFromType = (type: any, dataServers: any) => {
  return (
    dataServers &&
    Object.keys(dataServers).find(key => {
      return dataServers[key][type];
    })
  );
};

export default getServerKeyFromType;
