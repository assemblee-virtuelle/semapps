import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '@reach/router';
import { CONTAINER_URI } from '../config';
import useQuery from '../api/useQuery';
import { deleteResource, removeFromContainer } from '../api/actions';
import useAuth from '../auth/useAuth';
import Page from '../Page';

const ResourceDeletePage = ({ resourceId, navigate }) => {
  useAuth({ force: true });
  const resourceUri = `${CONTAINER_URI}/${resourceId}`;
  const dispatch = useDispatch();

  useEffect(async () => {
    await fetch(resourceUri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    await dispatch(deleteResource(resourceUri));
    await dispatch(removeFromContainer(CONTAINER_URI, resourceUri));

    navigate('/resources');
  });

  return null;
};

export default ResourceDeletePage;
