import getServerKeyFromType from './getServerKeyFromType';

const parseServerKey = (serverKey, dataServers) => {
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
const parseServerKeys = (serverKeys, dataServers) => {
  if (Array.isArray(serverKeys)) {
    if (serverKeys.includes('@all')) {
      return Object.keys(dataServers);
    }
    return serverKeys.map(serverKey => parseServerKey(serverKey, dataServers));
  }
  if (typeof serverKeys === 'string') {
    if (serverKeys === '@all') {
      return Object.keys(dataServers);
    }
    if (serverKeys === '@remote') {
      const defaultServerKey = getServerKeyFromType('default', dataServers);
      return Object.keys(dataServers).filter(serverKey => serverKey !== defaultServerKey);
    }
    return [parseServerKey(serverKeys, dataServers)];
  }
  // If server key is empty
  return false;
};

export default parseServerKeys;
