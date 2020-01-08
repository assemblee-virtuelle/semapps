const rootReducer = (state = { queries: [] }, action) => {
  switch (action.type) {
    case 'QUERY_TRIGGER': {
      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: {
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
            [action.endpoint]: {
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
            [action.endpoint]: {
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
          [action.endpoint]: {
            data: null,
            loading: false,
            error: action.error
          }
        }
      };
    }

    case 'ADD_TO_DATA_LIST': {
      let query = state.queries[action.endpoint];
      if (query && query.data) query.data.push(action.value);

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: query
        }
      };
    }

    case 'REMOVE_FROM_DATA_LIST': {
      let query = state.queries[action.endpoint];
      if (query && query.data) query.data = query.data.filter(value => value !== action.value);

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: query
        }
      };
    }

    default:
      return state;
  }
};

export default rootReducer;
