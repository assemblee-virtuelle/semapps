import urlJoin from 'url-join';
import { Configuration } from '../types';
import arrayOf from './arrayOf';
import expandTypes from './expandTypes';
import getTypesFromShapeTree from './getTypesFromShapeTree';

const normalizeConfig = async (config: Configuration) => {
  const newConfig: Configuration = { ...config };

  // Add server and uri key to servers' containers
  Object.keys(newConfig.dataServers).forEach(serverKey => {
    newConfig.dataServers[serverKey].containers = newConfig.dataServers[serverKey].containers?.map(container => ({
      ...container,
      server: serverKey,
      uri: urlJoin(config.dataServers[serverKey].baseUrl, container.path)
    }));
  });

  // Expand types in data models
  for (const resourceId of Object.keys(newConfig.resources)) {
    if (!newConfig.resources[resourceId].types && newConfig.resources[resourceId].shapeTreeUri) {
      newConfig.resources[resourceId].types = await getTypesFromShapeTree(newConfig.resources[resourceId].shapeTreeUri);
    }

    newConfig.resources[resourceId].types = await expandTypes(
      arrayOf(newConfig.resources[resourceId].types),
      config.jsonContext
    );
  }

  return newConfig;
};

export default normalizeConfig;
