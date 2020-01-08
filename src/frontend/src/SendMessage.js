import React from 'react';
import { Form, Field } from 'react-final-form';
import { MIDDLEWARE_URL } from './constants';
import useQuery from './api/useQuery';

const SendMessage = ({ userId }) => {
  const { data: usersUris } = useQuery(`${MIDDLEWARE_URL}/ldp/schema:Person`);

  const submit = async values => {
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: values.title,
      content: values.content
    };

    const response = await fetch(`${MIDDLEWARE_URL}/ldp/schema:Person`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });

    const userUri = response.headers.get('Location');
  };

  return (
    <div className="App-form">
      <p>Envoyer un message</p>
      <Form
        onSubmit={submit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="favoriteColor" component="select">
              <option />
              {usersUris &&
                usersUris.map(uri => (
                  <option key={uri} value={uri}>
                    {uri}
                  </option>
                ))}
            </Field>
            <Field name="title" component="input" placeholder="Titre" />
            <Field name="content" component="textarea" numrows="5" placeholder="Contenu" />
            <button type="submit">Envoyer un message</button>
          </form>
        )}
      />
    </div>
  );
};

export default SendMessage;
