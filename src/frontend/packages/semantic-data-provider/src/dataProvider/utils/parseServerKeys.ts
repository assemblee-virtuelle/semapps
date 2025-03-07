import getServerKeyFromType from './getServerKeyFromType';
import { DataServersConfig } from '../types';

const parseServerKey = (serverKey: string, dataServers: DataServersConfig) => {
  switch (serverKey) {
    case '@default':
      return getServerKeyFromType('default', dataServers);
    case '@pod':
      return getServerKeyFromType('pod', dataServers);
    case '@authServer':
      return getServerKeyFromType('authServer', dataServers);
    default:
      return serverKey;
  }
};

// Return the list of servers keys in an array
// parsing keywords like @all, @default, @pod and @authServer
const parseServerKeys = (serverKeys: string | string[], dataServers: DataServersConfig) => {
  if (Array.isArray(serverKeys)) {
    if (serverKeys.includes('@all')) {
      return Object.keys(dataServers);
    } else {
      return serverKeys.map(serverKey => parseServerKey(serverKey, dataServers));
    }
  } else if (typeof serverKeys === 'string') {
    if (serverKeys === '@all') {
      return Object.keys(dataServers);
    } else if (serverKeys === '@remote') {
      const defaultServerKey = getServerKeyFromType('default', dataServers);
      return Object.keys(dataServers).filter(serverKey => serverKey !== defaultServerKey);
    } else {
      return [parseServerKey(serverKeys, dataServers)];
    }
  } else {
    throw new Error(`The parseServerKeys expect a list of server keys, or keywords`);
  }
};

export default parseServerKeys;
