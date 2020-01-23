import React from 'react';
import { Form, Field } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { CONTAINER_URI } from '../config';
import useQuery from '../api/useQuery';
import { editResource } from '../api/actions';
import useAuth from '../auth/useAuth';
import Page from '../Page';

const ResourceEditPage = ({ resourceId, navigate }) => {
  useAuth({ force: true });
  const resourceUri = `${CONTAINER_URI}/${resourceId}`;
  const { data: resource } = useQuery(resourceUri);
  const dispatch = useDispatch();

  const edit = async values => {
    const resource = {
      '@context': 'http://virtual-assembly.org/ontologies/pair',
      type: 'Project',
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

    navigate(`/resources/${resourceId}`);
  };

  return (
    <Page>
      {resource && (
        <>
          <h2>Modifier le projet</h2>
          <Form
            onSubmit={edit}
            initialValues={{
              label: resource.label || resource['pair:label'],
              description: resource.description || resource['pair:description'],
              webPage: resource.webPage || resource['pair:webPage']
            }}
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
                  Modifier
                </button>
              </form>
            )}
          />
        </>
      )}
    </Page>
  );
};

export default ResourceEditPage;
