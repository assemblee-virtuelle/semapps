// Based on the dataServers config, returns the blank nodes for the given containers
const getBlankNodesFromDataServers = (containers, dataServers) => {
  const blankNodes = [];
  for (let serverKey of Object.keys(dataServers)) {
    if (dataServers[serverKey].blankNodes) {
      for (let containerUri of Object.keys(dataServers[serverKey].blankNodes)) {
        if (containers.includes(containerUri)) {
          blankNodes.push(...dataServers[serverKey].blankNodes[containerUri]);
        }
      }
    }
  }
  // Remove duplicates
  return [...new Set(blankNodes)];
};

export default getBlankNodesFromDataServers;
