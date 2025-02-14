const arrayOf = value => {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

/**
 * Order objects based on their depth in a linear graph / linked list.
 * @param objects Object with `id` and `nextId` fields.
 * @returns The objects sorted, the one without `nextId` first.
 *  Returns `null`, if objects are not a linear graph (e.g. DAG or loops)
 */
let orderLinearGraph = objects => {
  // Build a graph from the objects
  const graph = {};
  for (const node of objects) {
    graph[node.id] = node.nextId;
  }

  // Sort elements in here. Add the element first with no next field.
  let nodesSorted = [];

  // Build a reverse graph
  const graphRev = {};
  for (const node of objects) {
    if (node.nextId) graphRev[node.nextId] = node.id;
    else nodesSorted.push(node.id);
  }

  // If the graph is not a line...
  if (nodesSorted.length !== 1) return null;
  // Reverse graph has item less because one nextId must be is null.
  if (Object.keys(graph).length !== objects.length || Object.keys(graphRev).length !== objects.length - 1) {
    return null;
  }

  // Walk through linked list (the reverse graph).
  for (let i = 1; i < objects.length; i += 1) {
    nodesSorted.push(graphRev[nodesSorted[i - 1]]);
  }

  // Return objects not ids.
  const idToObj = {};
  for (const obj of objects) {
    idToObj[obj.id] = obj;
  }

  return nodesSorted.map(nodeId => idToObj[nodeId]);
};

module.exports = { arrayOf, orderLinearGraph };
