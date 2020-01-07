import React from 'react';
import { Value } from '@solid/react';
import './App.css';

import { MIDDLEWARE_URL } from './constants';

const Profile = ({ userId }) => {
  // const [ldpUrl, setLdpUrl] = useState(`${ldpServer}/subject/id/`);
  // const [ldpContainerUrl, setLdpContainerUrl] = useState(`${ldpServer}/container/as:Note`);

  // const sendNote = async () => {
  //   const note = {
  //     '@context': 'https://www.w3.org/ns/activitystreams',
  //     type: 'Note',
  //     name: title,
  //     content: content,
  //     published: '2019-05-28T12:12:12Z'
  //   };
  //
  //   const response = await fetch(`${ldpServer}/activitypub/outbox`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(note)
  //   });
  //
  //   const activity = await response.json();
  //
  //   alert('Activity created with ID : ' + activity.id);
  //
  //   window.location.reload();
  // };
  // {/*<div className="App-form">*/}
  // {/*  <input value={title} onChange={e => setTitle(e.target.value)} />*/}
  // {/*  <textarea rows="7" value={content} onChange={e => setContent(e.target.value)} />*/}
  // {/*  <button onClick={sendNote}>Envoyer le message</button>*/}
  // {/*</div>*/}

  return (
    <div className="App-form">
      <Value src={`[${MIDDLEWARE_URL}/ldp/schema:Person/${userId}].schema_name`} />
    </div>
  );
};

export default Profile;
