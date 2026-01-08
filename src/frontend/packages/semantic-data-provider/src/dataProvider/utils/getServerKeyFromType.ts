import { DataServersConfig } from '../types';

const getServerKeyFromType = (type: string, dataServers: DataServersConfig) => {
  return (
    dataServers &&
    Object.keys(dataServers).find(key => {
      return dataServers[key][type];
    })
  );
};

export default getServerKeyFromType;
