import getOneMethod from './methods/getOne';
import getListMethod from './methods/getList';
import getManyMethod from './methods/getMany';
import getManyReferenceMethod from './methods/getManyReference';
import createMethod from './methods/create';
import updateMethod from './methods/update';
import deleteMethod from './methods/delete';
import deleteManyMethod from './methods/deleteMany';

const dataProvider = config => {
  // TODO verify all data provider config + data models

  if (!config.jsonContext) config.jsonContext = Object.fromEntries(config.ontologies.map(o => [o.prefix, o.url]));
  if (!config.returnFailedResources) config.returnFailedResources = false;

  return {
    getList: getListMethod(config),
    getOne: getOneMethod(config),
    getMany: getManyMethod(config),
    getManyReference: getManyReferenceMethod(config),
    create: createMethod(config),
    update: updateMethod(config),
    updateMany: () => {
      throw new Error('updateMany is not implemented yet');
    },
    delete: deleteMethod(config),
    deleteMany: deleteManyMethod(config)
  };
};

export default dataProvider;
