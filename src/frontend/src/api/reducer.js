const apiReducer = (state = { queries: [] }, action) => {
  switch (action.type) {
    case 'QUERY_TRIGGER': {
      return {
        ...state,
        queries: {
          ...state.queries,
          [action.uri]: {
            data: null,
            loading: true,
            error: null
          }
        }
      };
    }

    case 'QUERY_SUCCESS': {
      if (
        action.data['@type'] === 'ldp:Container' ||
        (Array.isArray(action.data['@type']) && action.data['@type'].includes('ldp:Container'))
      ) {
        let entities;
        const itemsIds = action.data['ldp:contains']
          ? action.data['ldp:contains'].map(item => {
              entities = { ...entities, [item['@id']]: { data: item, loading: false, error: null } };
              return item['@id'];
            })
          : null;
        return {
          ...state,
          queries: {
            ...state.queries,
            ...entities,
            [action.uri]: {
              data: itemsIds,
              loading: false,
              error: null
            }
          }
        };
      } else {
        return {
          ...state,
          queries: {
            ...state.queries,
            [action.uri]: {
              data: action.data,
              loading: false,
              error: null
            }
          }
        };
      }
    }

    case 'QUERY_FAILURE': {
      return {
        ...state,
        queries: {
          ...state.queries,
          [action.uri]: {
            data: null,
            loading: false,
            error: action.error
          }
        }
      };
    }

    case 'ADD_RESOURCE': {
      return {
        ...state,
        queries: {
          ...state.queries,
          [action.resourceUri]: {
            loading: false,
            error: null,
            data: {
              ...action.data
            }
          }
        }
      };
    }

    case 'EDIT_RESOURCE': {
      const query = state.queries[action.resourceUri];

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.resourceUri]: {
            ...query,
            data: {
              ...query.data,
              ...action.data
            }
          }
        }
      };
    }

    case 'DELETE_RESOURCE': {
      const { [action.resourceUri]: resourceQuery, ...otherQueries } = state.queries;
      return {
        ...state,
        queries: otherQueries
      };
    }

    case 'ADD_TO_CONTAINER': {
      const query = state.queries[action.containerUri];
      const queryData = (query && query.data) || [];

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.containerUri]: {
            ...query,
            data: [...queryData, action.resourceUri]
          }
        }
      };
    }

    case 'REMOVE_FROM_CONTAINER': {
      let query = state.queries[action.containerUri],
        queryData = [];
      if (query && query.data) queryData = query.data.filter(value => value !== action.resourceUri);

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.containerUri]: {
            ...query,
            data: queryData
          }
        }
      };
    }

    default:
      return state;
  }
};

export default apiReducer;
