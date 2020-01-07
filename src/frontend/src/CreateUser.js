import React from 'react';
import { Form, Field } from 'react-final-form';
import { MIDDLEWARE_URL } from './constants';
import { getUserId } from './utils';

const CreateUser = ({ navigate }) => {
  const createUser = async values => {
    const user = {
      '@context': 'http://schema.org/',
      type: 'Person',
      ...values
    };

    const response = await fetch(`${MIDDLEWARE_URL}/ldp/schema:Person`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const userUri = response.headers.get('Location');

    navigate(`users/${getUserId(userUri)}`);
  };

  return (
    <div className="container">
      <h2>Créer un utilisateur</h2>
      <Form
        onSubmit={createUser}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="givenName">Prénom</label>
              <Field name="givenName" component="input" class="form-control" id="givenName" />
            </div>
            <div className="form-group">
              <label htmlFor="familyName">Nom de famille</label>
              <Field name="familyName" component="input" class="form-control" id="familyName" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <Field name="email" component="input" class="form-control" id="email" />
            </div>
            <button type="submit" class="btn btn-warning w-100">
              Créer utilisateur
            </button>
          </form>
        )}
      />
    </div>
  );
};

export default CreateUser;
