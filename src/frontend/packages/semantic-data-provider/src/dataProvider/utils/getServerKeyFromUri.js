// Return the first server matching with the baseUrl
const getServerKeyFromUri = (uri, dataServers) => {
  return Object.keys(dataServers).find(key => {
    return uri.startsWith(dataServers[key].baseUrl);
  });
};

export default getServerKeyFromUri;
