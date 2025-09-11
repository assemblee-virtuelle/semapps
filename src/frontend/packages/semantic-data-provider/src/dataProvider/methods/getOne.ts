import { GetOneParams, RaRecord } from 'react-admin';
import { RuntimeConfiguration } from '../types';
import fetchResource from '../utils/fetchResource';

const getOneMethod = (config: RuntimeConfiguration) => async (resourceId: string, params: GetOneParams<RaRecord>) => {
  const { resources } = config;
  const dataModel = resources[resourceId];

  if (!dataModel) throw new Error(`Resource ${resourceId} is not mapped in resources file`);

  const data = await fetchResource(params.id, config);

  // Transform single value into array if forceArray is set
  if (dataModel.list?.forceArray) {
    for (const forceArrayItem of dataModel.list?.forceArray || []) {
      if (data[forceArrayItem] && !Array.isArray(data[forceArrayItem])) {
        data[forceArrayItem] = [data[forceArrayItem]];
      }
    }
  }

  // TODO activate defaultFetchPlan option
  // if (dataModel.list?.defaultFetchPlan) {
  //   for (const node of dataModel.list?.defaultFetchPlan) {
  //     if (
  //       data[node] &&
  //       typeof data[node] === 'string' &&
  //       data[node].startsWith('http')
  //     ) {
  //       try {
  //         const dataToEmbed = await fetchResource(data[node], config);
  //         delete dataToEmbed['@context'];
  //         data[node] = dataToEmbed;
  //       } catch (e) {
  //         // Ignore errors (this may happen if user does not have rights to see the resource)
  //       }
  //     }
  //   }
  // }

  return { data };
};

export default getOneMethod;
