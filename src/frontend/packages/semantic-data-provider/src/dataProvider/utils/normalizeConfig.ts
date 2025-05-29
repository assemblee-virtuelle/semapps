import urlJoin from 'url-join';
import { Configuration } from '../types';
import arrayOf from './arrayOf';
import expandTypes from './expandTypes';
import getTypesFromShapeTree from './getTypesFromShapeTree';

/**
 * For data server containers, expands types and adds `uri` and `server` properties.
 * For resources, expands types (if applicable from shape tree information).
 */
const normalizeConfig = async (config: Configuration) => {
  const newConfig: Configuration = { ...config };

  // Add server and uri key to servers' containers
  for (const serverKey of Object.keys(newConfig.dataServers)) {
    if (newConfig.dataServers[serverKey].containers) {
      newConfig.dataServers[serverKey].containers = await Promise.all(
        newConfig.dataServers[serverKey].containers?.map(async container => {
          return {
            ...container,
            types: container.types && (await expandTypes(container.types, config.jsonContext)),
            server: serverKey,
            uri: urlJoin(config.dataServers[serverKey].baseUrl, container.path)
          };
        })
      );
    }
  }

  // Expand types in data models
  for (const resourceId of Object.keys(newConfig.resources)) {
    if (!newConfig.resources[resourceId].types && newConfig.resources[resourceId].shapeTreeUri) {
      newConfig.resources[resourceId].types = await getTypesFromShapeTree(
        newConfig.resources[resourceId].shapeTreeUri!
      );
    }

    newConfig.resources[resourceId].types = await expandTypes(
      arrayOf(newConfig.resources[resourceId].types),
      config.jsonContext
    );
  }

  return newConfig;
};

export default normalizeConfig;
