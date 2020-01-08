import React from 'react';
import { Form, Field } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { CONTAINER_URI } from '../constants';
import useQuery from '../api/useQuery';
import { editResource } from '../api/actions';

const EditUserForm = ({ userId, navigate }) => {
  const userUri = `${CONTAINER_URI}/${userId}`;
  const { data: user } = useQuery(userUri);
  const dispatch = useDispatch();

  const editUser = async values => {
    const user = {
      '@context': 'http://schema.org/',
      type: 'Person',
      ...values
    };

    await fetch(userUri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    await dispatch(editResource(userUri, user));

    navigate(`/users/${userId}`);
  };

  return (
    user && (
      <>
        <h2>Modifier le profil de {user.givenName || user['schema:givenName']}</h2>
        <Form
          onSubmit={editUser}
          initialValues={{
            givenName: user.givenName || user['schema:givenName'],
            familyName: user.familyName || user['schema:familyName'],
            email: user.email || user['schema:email']
          }}
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
                Modifier le profil
              </button>
            </form>
          )}
        />
      </>
    )
  );
};

export default EditUserForm;
