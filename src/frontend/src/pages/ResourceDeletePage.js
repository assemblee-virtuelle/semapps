import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CONTAINER_URI } from '../config';
import { deleteResource, removeFromContainer } from '../api/actions';
import useAuth from '../auth/useAuth';
import { addFlash } from '../app/actions';

const ResourceDeletePage = ({ resourceId, navigate }) => {
  useAuth({ force: true });
  const resourceUri = `${CONTAINER_URI}/${resourceId}`;
  const dispatch = useDispatch();

  const remove = async () => {
    await fetch(resourceUri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    await dispatch(deleteResource(resourceUri));
    await dispatch(removeFromContainer(CONTAINER_URI, resourceUri));

    await dispatch(addFlash('La ressource a bien été effacée'));

    navigate('/');
  };

  useEffect(() => {
    remove();
  });

  return null;
};

export default ResourceDeletePage;
