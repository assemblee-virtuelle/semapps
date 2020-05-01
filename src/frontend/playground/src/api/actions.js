export const addResource = (resourceUri, data) => ({
  type: 'ADD_RESOURCE',
  resourceUri,
  data
});

export const editResource = (resourceUri, data) => ({
  type: 'EDIT_RESOURCE',
  resourceUri,
  data
});

export const deleteResource = resourceUri => ({
  type: 'DELETE_RESOURCE',
  resourceUri
});

export const addToContainer = (containerUri, resourceUri) => ({
  type: 'ADD_TO_CONTAINER',
  containerUri,
  resourceUri
});

export const removeFromContainer = (containerUri, resourceUri) => ({
  type: 'REMOVE_FROM_CONTAINER',
  containerUri,
  resourceUri
});
