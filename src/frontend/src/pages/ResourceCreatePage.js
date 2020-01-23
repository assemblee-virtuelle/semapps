import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { CONTAINER_URI } from '../config';
import { getResourceId } from '../utils';
import { addResource, addToContainer } from '../api/actions';
import useAuth from '../auth/useAuth';
import Page from '../Page';
import { addFlash } from '../app/actions';

const ResourceCreatePage = ({ navigate }) => {
  useAuth({ force: true });
  const dispatch = useDispatch();

  const create = async values => {
    const resource = {
      '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
      '@type': 'Project',
      ...values
    };

    const response = await fetch(CONTAINER_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(resource)
    });

    const resourceUri = response.headers.get('Location');

    await dispatch(addResource(resourceUri, resource));
    await dispatch(addToContainer(CONTAINER_URI, resourceUri));

    await dispatch(addFlash('La ressource a bien été ajoutée'));

    navigate(`/resources/${getResourceId(resourceUri)}`);
  };

  return (
    <Page>
      <h2>Ajouter un projet</h2>
      <Form
        onSubmit={create}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="label">Titre</label>
              <Field name="label" component="input" className="form-control" id="label" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field name="description" component="textarea" className="form-control" rows={5} id="description" />
            </div>
            <div className="form-group">
              <label htmlFor="webPage">Site web</label>
              <Field name="webPage" component="input" className="form-control" id="webPage" />
            </div>
            <button type="submit" className="btn btn-warning w-100">
              Ajouter
            </button>
          </form>
        )}
      />
    </Page>
  );
};

export default ResourceCreatePage;
