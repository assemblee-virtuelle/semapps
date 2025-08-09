import rdf from '@rdfjs/data-model';

const buildAutoDetectBlankNodesQuery = (depth: any, baseQuery: any) => {
  const construct = [...baseQuery.construct];
  let where = {};
  if (depth > 0) {
    const whereQueries = [];
    whereQueries.push([baseQuery.where]);
    for (let i = 1; i <= depth; i++) {
      construct.push(rdf.quad(rdf.variable(`o${i}`), rdf.variable(`p${i + 1}`), rdf.variable(`o${i + 1}`)));
      whereQueries.push([
        ...whereQueries[whereQueries.length - 1],
        {
          type: 'filter',
          expression: {
            type: 'operation',
            operator: 'isblank',
            args: [rdf.variable(`o${i}`)]
          }
        },
        rdf.quad(rdf.variable(`o${i}`), rdf.variable(`p${i + 1}`), rdf.variable(`o${i + 1}`))
      ]);
    }
    where = {
      type: 'union',
      patterns: whereQueries
    };
  } else if (depth === 0) {
    where = baseQuery.where;
  } else {
    throw new Error('The depth of buildAutoDetectBlankNodesQuery should be 0 or more');
  }

  return { construct, where };
};

export default buildAutoDetectBlankNodesQuery;
