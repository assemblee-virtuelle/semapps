import { Configuration, Container } from '../types';
import getServerKeyFromType from './getServerKeyFromType';
import fetchContainerFromDataRegistration from './fetchContainerFromDataRegistration';

const getContainerFromDataRegistration = async (dataRegistrationUri: string, config: Configuration) => {
  const { uri, ...container } = await fetchContainerFromDataRegistration(dataRegistrationUri, config.httpClient);

  const userStorage = getServerKeyFromType('default', config.dataServers);
  const { baseUrl } = config.dataServers[userStorage];

  return { ...container, path: uri!.replace(baseUrl, '') } as Container;
};

export default getContainerFromDataRegistration;
