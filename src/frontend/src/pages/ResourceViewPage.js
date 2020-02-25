import React from 'react';
import { Link } from '@reach/router';
import { useDispatch } from 'react-redux';
import useQuery from '../api/useQuery';
import Page from '../Page';
import resourcesTypes from '../resourcesTypes';
import ResourceValue from '../ResourceValue';
import Inbox from '../Inbox';
import { addFlash } from '../app/actions';
import useAuth from '../auth/useAuth';
import { MIDDLEWARE_URL } from '../config';

const ResourceViewPage = ({ type, resourceId }) => {
  const { user, webId, isLogged } = useAuth();
  const dispatch = useDispatch();
  const resourceConfig = resourcesTypes[type];
  const resourceUri = `${MIDDLEWARE_URL}ldp/object/${resourceId}`;
  const { data } = useQuery(resourceUri);

  const follow = async () => {
    const followActivity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Follow',
      actor: webId,
      object: resourceUri
    };

    await fetch(user.outbox, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(followActivity)
    });

    await dispatch(addFlash('Vous suivez maintenant cet utilisateur'));
  };

  return (
    <Page>
      {data && (
        <>
          <h2>{resourceConfig.name} > Voir</h2>
          <ul className="list-group">
            {resourceConfig.fields.map((field, i) => {
              let value = data[field.type] || data[field.type.split(':')[1]];
              if (typeof value === 'object') value = value['@id'];
              if (value) {
                return (
                  <div className="list-group-item" key={i}>
                    <div>
                      <strong>{field.label}</strong>
                    </div>
                    <div>
                      <ResourceValue field={field}>{value}</ResourceValue>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </ul>
          {!resourceConfig.readOnly && (
            <>
              <br />
              <Link to={`/resources/${type}/${resourceId}/edit`}>
                <button className="btn btn-primary">Modifier</button>
              </Link>
              &nbsp; &nbsp;
              <Link to={`/resources/${type}/${resourceId}/delete`}>
                <button className="btn btn-danger">Effacer</button>
              </Link>
            </>
          )}
          {type === 'users' && isLogged && webId !== resourceUri && (
            <>
              <br />
              <button className="btn btn-primary" onClick={follow}>
                <i className="fa fa-forward" />
                &nbsp;Suivre cet utilisateur
              </button>
              &nbsp; &nbsp;
              <Link to={`/messages/?recipientUri=${encodeURI(resourceUri)}`}>
                <button className="btn btn-primary">
                  <i className="fa fa-envelope" />
                  &nbsp; Envoyer un message
                </button>
              </Link>
            </>
          )}
        </>
      )}
      {data && type === 'users' && (
        <>
          <br />
          <br />
          <Inbox userUri={resourceUri} inboxUri={data.inbox || data['as:inbox']['@id']} />
        </>
      )}
    </Page>
  );
};

export default ResourceViewPage;
