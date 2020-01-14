import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { CONTAINER_URI } from '../config';
import { getUserId } from '../utils';
import { addResource, addToContainer } from '../api/actions';

const CreateUserForm = ({ navigate }) => {
  const dispatch = useDispatch();

  const createUser = async values => {
    const user = {
      '@context': 'http://schema.org/',
      type: 'Person',
      ...values
    };

    const response = await fetch(CONTAINER_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const userUri = response.headers.get('Location');

    await dispatch(addResource(userUri, user));
    await dispatch(addToContainer(CONTAINER_URI, userUri));

    navigate(`users/${getUserId(userUri)}`);
  };

  return (
    <>
      <h2>Créer un utilisateur</h2>
      <Form
        onSubmit={createUser}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="givenName">Prénom</label>
              <Field name="givenName" component="input" className="form-control" id="givenName" />
            </div>
            <div className="form-group">
              <label htmlFor="familyName">Nom de famille</label>
              <Field name="familyName" component="input" className="form-control" id="familyName" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <Field name="email" component="input" className="form-control" id="email" />
            </div>
            <button type="submit" className="btn btn-warning w-100">
              Créer utilisateur
            </button>
          </form>
        )}
      />
    </>
  );
};

export default CreateUserForm;
