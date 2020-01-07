import React from 'react';
import { Form, Field } from 'react-final-form';
import './App.css';

import { MIDDLEWARE_URL } from './constants';

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
    const matches = userUri.match(/schema:Person\/(.*)/);
    const userId = matches[1];

    navigate(`users/${userId}`);
  };

  return (
    <div className="App-form">
      <Form
        onSubmit={createUser}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="givenName" component="input" placeholder="Prénom" />
            <Field name="familyName" component="input" placeholder="Nom de famille" />
            <Field name="email" component="input" placeholder="Adresse email" />
            <button type="submit">Créer utilisateur</button>
          </form>
        )}
      />
    </div>
  );
};

export default CreateUser;
