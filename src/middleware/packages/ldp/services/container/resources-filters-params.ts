// Params used to filter the resources of a container, shared by the get and count actions
const resourcesFiltersParams = {
  filters: { type: 'object', optional: true },
  // Keywords to search in the literals of the resources (case-insensitive and accent-insensitive)
  search: { type: 'string', optional: true, max: 200 },
  // If provided, only search in these predicates (full URIs or prefixed)
  searchPredicates: { type: 'array', items: 'string', optional: true },
  // Only keep resources whose vcard:hasGeo is less than `radius` km of the point (or without location)
  near: {
    type: 'object',
    optional: true,
    props: {
      latitude: { type: 'number', min: -90, max: 90 },
      longitude: { type: 'number', min: -180, max: 180 },
      radius: { type: 'number', min: 0 }
    }
  }
} as const;

export default resourcesFiltersParams;
