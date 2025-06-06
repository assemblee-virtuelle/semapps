import { RuntimeConfiguration } from '../types';

const getDataModels = (config: RuntimeConfiguration) => () => {
  return config.resources;
};

export default getDataModels;
