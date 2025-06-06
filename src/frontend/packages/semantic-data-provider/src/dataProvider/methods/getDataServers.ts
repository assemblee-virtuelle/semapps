import { Configuration } from '../types';

const getDataServers = (config: Configuration) => () => {
  return config.dataServers;
};

export default getDataServers;
