import React from 'react';
import { useDispatch } from 'react-redux';
import { Form } from 'react-final-form';
import { getResourceId } from '../utils';
import { addResource, addToContainer } from '../api/actions';
import useAuth from '../auth/useAuth';
import Page from '../Page';
import { addFlash } from '../app/actions';
import ResourceField from '../ResourceField';
import resourcesTypes from '../resourcesTypes';

const ResourceCreatePage = ({ type, navigate }) => {
  useAuth({ force: true });
  const dispatch = useDispatch();
  const resourceConfig = resourcesTypes[type];

  const create = async values => {
    const resource = {
      '@context': { '@vocab': resourceConfig.ontology },
      '@type': resourceConfig.class,
      ...values
    };

    const response = await fetch(resourceConfig.container, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(resource)
    });

    const resourceUri = response.headers.get('Location');

    await dispatch(addResource(resourceUri, resource));
    await dispatch(addToContainer(resourceConfig.container, resourceUri));

    await dispatch(addFlash('La ressource a bien été ajoutée'));

    navigate(`/resources/${type}/${getResourceId(resourceUri, type)}`);
  };

  return (
    <Page>
      <h2>{resourceConfig.name} > Ajouter</h2>
      <Form
        onSubmit={create}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {resourceConfig.fields.map((field, i) => {
              return <ResourceField field={field} key={i} />;
            })}
            <button type="submit" className="btn btn-primary w-100">
              Ajouter
            </button>
          </form>
        )}
      />
    </Page>
  );
};

export default ResourceCreatePage;
