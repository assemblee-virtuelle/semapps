const buildBlankNodesQuery = depth => {
  const BASE_QUERY = '?s1 ?p1 ?o1 .';
  let construct = BASE_QUERY;
  let where = '';
  if (depth > 0) {
    let whereQueries = [];
    whereQueries.push([BASE_QUERY]);
    for (let i = 1; i <= depth; i++) {
      construct += `\r\n?o${i} ?p${i + 1} ?o${i + 1} .`;
      whereQueries.push([
        ...whereQueries[whereQueries.length - 1],
        `FILTER((isBLANK(?o${i}))) .`,
        `?o${i} ?p${i + 1} ?o${i + 1} .`
      ]);
    }
    where = `{\r\n${whereQueries.map(q1 => q1.join('\r\n')).join('\r\n} UNION {\r\n')}\r\n}`;
  } else if (depth === 0) {
    where = BASE_QUERY;
  } else {
    throw new Error('The depth of buildBlankNodesQuery should be 0 or more');
  }
  return { construct, where };
};

const objectCurrentToId = activityJson => {
  if (activityJson.object && typeof activityJson.object === 'object' && activityJson.object.current) {
    const { current, ...object } = activityJson.object;
    return {
      ...activityJson,
      object: {
        id: current,
        ...objectCurrentToId(object)
      }
    };
  }
  return activityJson;
};

module.exports = {
  buildBlankNodesQuery,
  objectCurrentToId
};
