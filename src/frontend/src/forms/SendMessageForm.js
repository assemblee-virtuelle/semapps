import React from 'react';
import { Form, Field } from 'react-final-form';
import { CONTAINER_URI } from '../config';
import useQuery from '../api/useQuery';
import Page from '../Page';

const SendMessageForm = ({ userId }) => {
  const { data: usersUris } = useQuery(CONTAINER_URI);

  const submit = async values => {
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: values.title,
      content: values.content
    };

    const response = await fetch(CONTAINER_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });

    const userUri = response.headers.get('Location');
  };

  return (
    <Page>
      <h2>Envoyer un message</h2>
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
    </Page>
  );
};

export default SendMessageForm;
