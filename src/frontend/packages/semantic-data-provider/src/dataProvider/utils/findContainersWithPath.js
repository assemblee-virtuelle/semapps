import urlJoin from 'url-join';

const findContainersWithPaths = (paths, dataServers) => {
  const containers = {};
  Object.keys(paths).forEach(serverKey => {
    if (dataServers[serverKey]) {
      containers[serverKey] = [];
      paths[serverKey].forEach(path => {
        containers[serverKey].push(urlJoin(dataServers[serverKey].baseUrl, path));
      });
    } else {
      throw new Error(`No server found with key ${serverKey}`);
    }
  });
  return containers;
};

export default findContainersWithPaths;
