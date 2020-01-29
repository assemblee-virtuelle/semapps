import React from 'react';
import { Link } from '@reach/router';
import useQuery from './api/useQuery';
import { getResourceId, nl2br } from './utils';

const Inbox = ({ userUri, inboxUri }) => {
  const { data } = useQuery(inboxUri);
  return (
    <>
      <h2 className="mt-3">
        Messages reçus
        {userUri && (
          <Link to={`/messages/?recipientUri=${encodeURI(userUri)}`}>
            <button className="btn btn-secondary pull-right">
              <i className="fa fa-envelope" />
              &nbsp; Envoyer un message
            </button>
          </Link>
        )}
      </h2>
      <ul className="list-group">
        {data &&
          data.orderedItems.map((item, i) => {
            if (item.type === 'Create' && item.object) {
              const username = getResourceId(item.actor, 'users');
              const published = new Date(Date.parse(item.published));
              return (
                <div className="list-group-item" key={i}>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{item.object.name}</h5>
                    <small>{published.toLocaleString('fr-FR')}</small>
                  </div>
                  <p className="mb-1">{nl2br(item.object.content)}</p>
                  <small>
                    Envoyé par <Link to={`/resources/users/${username}`}>{username}</Link>
                  </small>
                </div>
              );
            } else {
              return null;
            }
          })}
        {data && data.totalItems === 0 && <span>Aucun message n'a été reçu pour le moment.</span>}
      </ul>
    </>
  );
};

export default Inbox;
