import produce from 'immer';

const isResourcesList = (data, type) => {
  if (type === 'graph' && data['@graph'] !== undefined) {
    return true;
  } else {
    return (
      data['@type'] === type ||
      data['type'] === type ||
      (Array.isArray(data['@type']) && data['@type'].includes(type)) ||
      (Array.isArray(data['type']) && data['type'].includes(type))
    );
  }
};

const extractItems = (data, predicate) => {
  if (!data[predicate]) {
    return null;
  } else {
    let items = {};
    data[predicate].forEach(item => {
      items[item['@id'] || item['id']] = { data: item, loading: false, error: null };
    });
    return items;
  }
};

const apiReducer = (state = { queries: {} }, action) =>
  produce(state, newState => {
    switch (action.type) {
      case 'QUERY_TRIGGER':
        newState.queries[action.uri] = {
          data: null,
          loading: true,
          error: null,
          body: action.body
        };
        break;
      case 'QUERY_SUCCESS': {
        if (isResourcesList(action.data, 'ldp:Container')) {
          const items = extractItems(action.data, 'ldp:contains');
          newState.queries = {
            ...newState.queries,
            ...items,
            [action.uri]: {
              data: Object.keys(items),
              loading: false,
              error: null,
              body: action.body
            }
          };
        } else if (isResourcesList(action.data, 'Collection')) {
          const items = extractItems(action.data, 'items');
          newState.queries = {
            ...newState.queries,
            ...items,
            [action.uri]: {
              data: Object.keys(items),
              loading: false,
              error: null,
              body: action.body
            }
          };
        } else if (isResourcesList(action.data, 'OrderedCollection')) {
          const items = extractItems(action.data, 'orderedItems');
          newState.queries = {
            ...newState.queries,
            ...items,
            [action.uri]: {
              data: Object.keys(items),
              loading: false,
              error: null,
              body: action.body
            }
          };
        } else if (isResourcesList(action.data, 'graph')) {
          const items = extractItems(action.data, '@graph');
          newState.queries = {
            ...newState.queries,
            ...items,
            [action.uri]: {
              data: Object.keys(items),
              loading: false,
              error: null,
              body: action.body
            }
          };
        } else {
          newState.queries[action.uri] = {
            data: action.onlyArray ? [action.data['@id']] : action.data,
            loading: false,
            error: null,
            body: action.body
          };
        }
        break;
      }

      case 'QUERY_FAILURE':
        newState.queries[action.uri] = {
          data: null,
          loading: false,
          error: action.error,
          body: action.body
        };
        break;

      case 'ADD_RESOURCE':
        newState.queries[action.resourceUri] = {
          loading: false,
          error: null,
          data: action.data
        };
        break;

      case 'EDIT_RESOURCE':
        newState.queries[action.resourceUri] = {
          data: action.data
        };
        break;

      case 'DELETE_RESOURCE':
        delete newState.queries[action.resourceUri];
        break;

      case 'ADD_TO_CONTAINER':
        // If container hasn't been cached yet, ignore
        if (newState.queries[action.containerUri]) {
          newState.queries[action.containerUri].data.push(action.resourceUri);
        }
        break;

      case 'REMOVE_FROM_CONTAINER':
        // If container hasn't been cached yet, ignore
        if (newState.queries[action.containerUri]) {
          newState.queries[action.containerUri].data = newState.queries[action.containerUri].data.filter(
            uri => uri !== action.resourceUri
          );
        }
        break;

      default:
        break;
    }
  });

export default apiReducer;
