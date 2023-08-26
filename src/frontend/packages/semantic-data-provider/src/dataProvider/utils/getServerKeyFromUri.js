// Return the first server matching with the baseUrl
const getServerKeyFromUri = (uri, dataServers) => {
  return Object.keys(dataServers).find(key => {
    if (dataServers[key].pod) {
      // The baseUrl ends with /data so remove this part to match with the webId and webId-related URLs (/inbox, /outbox...)
      return dataServers[key].baseUrl && uri.startsWith(dataServers[key].baseUrl.replace('/data', ''));
    }
    return uri.startsWith(dataServers[key].baseUrl);
  });
};

export default getServerKeyFromUri;
