import React from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import useQuery from '../api/useQuery';
import { editResource } from '../api/actions';
import useAuth from '../auth/useAuth';
import Page from '../Page';
import { addFlash } from '../app/actions';
import resourcesTypes from '../resourcesTypes';
import ResourceField from '../ResourceField';
import { getInitialValues } from '../utils';

const ResourceEditPage = ({ type, resourceId, navigate }) => {
  useAuth({ force: true });
  const resourceConfig = resourcesTypes[type];
  const resourceUri = `${resourceConfig.container}/${resourceId}`;
  const { data } = useQuery(resourceUri);
  const dispatch = useDispatch();

  const edit = async values => {
    const resource = {
      '@context': { '@vocab': resourceConfig.ontology },
      '@type': resourceConfig.class,
      ...values
    };

    await fetch(resourceUri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(resource)
    });

    await dispatch(editResource(resourceUri, resource));
    await dispatch(addFlash('La ressource a bien été éditée'));

    navigate(`/resources/${type}/${resourceId}`);
  };

  return (
    <Page>
      {data ? (
        <>
          <h2>{resourceConfig.name} > Modifier</h2>
          <Form
            onSubmit={edit}
            initialValues={getInitialValues(resourceConfig.fields, data)}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {resourceConfig.fields.map((field, i) => {
                  return <ResourceField field={field} key={i} />;
                })}
                <button type="submit" className="btn btn-primary w-100">
                  Modifier
                </button>
              </form>
            )}
          />
        </>
      ) : null}
    </Page>
  );
};

export default ResourceEditPage;
