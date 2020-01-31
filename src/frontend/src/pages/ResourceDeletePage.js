import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteResource, removeFromContainer } from '../api/actions';
import useAuth from '../auth/useAuth';
import { addFlash } from '../app/actions';
import resourcesTypes from '../resourcesTypes';

const ResourceDeletePage = ({ type, resourceId, navigate }) => {
  useAuth({ force: true });
  const resourceConfig = resourcesTypes[type];
  const resourceUri = `${resourceConfig.container}/${resourceId}`;
  const dispatch = useDispatch();

  const remove = useCallback(async () => {
    await fetch(resourceUri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    await dispatch(deleteResource(resourceUri));
    await dispatch(removeFromContainer(resourceConfig.container, resourceUri));

    await dispatch(addFlash('La ressource a bien été effacée'));

    navigate(`/resources/${type}`);
  }, [dispatch, navigate, resourceConfig, resourceUri, type]);

  useEffect(() => {
    remove();
  }, [remove]);

  return null;
};

export default ResourceDeletePage;
