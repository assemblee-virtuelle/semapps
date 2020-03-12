import React from 'react';
import { Link } from '@reach/router';
import useQuery from './api/useQuery';
import { getResourceId, nl2br } from './utils';

const Activity = ({ activityUri }) => {
  const { data } = useQuery(activityUri);
  if (data.type === 'Create' && data.object) {
    const username = getResourceId(data.actor, 'users');
    const published = new Date(Date.parse(data.published));
    return (
      <div className="list-group-item">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{data.object.name}</h5>
          <small>{published.toLocaleString('fr-FR')}</small>
        </div>
        <p className="mb-1">{nl2br(data.object.content)}</p>
        <small>
          Envoyé par <Link to={`/resources/users/${username}`}>{username}</Link>
        </small>
      </div>
    );
  } else {
    return null;
  }
};

const Inbox = ({ inboxUri }) => {
  const { data } = useQuery(inboxUri);
  return (
    <>
      <h2 className="mt-3">Messages reçus</h2>
      <ul className="list-group">
        {data && data.map((item, i) => <Activity activityUri={item} key={i} />)}
        {data && data.length === 0 && <span>Aucun message n'a été reçu pour le moment.</span>}
      </ul>
    </>
  );
};

export default Inbox;
