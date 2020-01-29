import React from 'react';
import { Form, Field } from 'react-final-form';
import Page from '../Page';
import useAuth from '../auth/useAuth';
import resourcesTypes from '../resourcesTypes';
import useQuery from '../api/useQuery';
import { getResourceId } from '../utils';
import { addFlash } from '../app/actions';
import { useDispatch } from 'react-redux';
import Inbox from '../Inbox';

const MessagesPage = ({ location }) => {
  const { webId, user } = useAuth({ force: true });
  const dispatch = useDispatch();

  const resourceConfig = resourcesTypes['users'];
  const { data: usersUris } = useQuery(resourceConfig.container);

  const queryParams = new URLSearchParams(location.search);

  const sendNote = async values => {
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: values.title,
      content: values.content,
      attributedTo: webId,
      to: [values.recipient]
    };

    await fetch(user.outbox, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(note)
    });

    await dispatch(addFlash('Votre message a bien été envoyé'));
  };

  return (
    <Page>
      <h2>Envoyer un message</h2>
      <Form
        onSubmit={sendNote}
        initialValues={{
          recipient: queryParams.get('recipientUri')
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="recipient">Utilisateur</label>
              <Field id="recipient" name="recipient" component="select" className="form-control">
                <option />
                {usersUris &&
                  user &&
                  usersUris
                    .filter(userUri => userUri !== webId)
                    .map(userUri => {
                      const username = getResourceId(userUri, 'users');
                      return (
                        <option value={userUri} key={userUri}>
                          {username}
                        </option>
                      );
                    })}
              </Field>
            </div>
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <Field name="title" component="input" className="form-control" id="title" />
            </div>
            <div className="form-group">
              <label htmlFor="content">Message</label>
              <Field name="content" component="textarea" className="form-control" rows={5} id="content" />
            </div>
            <button type="submit" className="btn btn-warning w-100">
              Envoyer
            </button>
          </form>
        )}
      />
      {user && (
        <>
          <br />
          <Inbox inboxUri={user.inbox} />
        </>
      )}
    </Page>
  );
};

export default MessagesPage;
