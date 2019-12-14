import React, { useState } from 'react';
import { List, Value } from '@solid/react';
import './App.css';
import NoteService from './NoteService.js';

const App = () => {
  let ldpServer = `http://${window.location.hostname}:3000`;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [ldpUrl, setLdpUrl] = useState(`${ldpServer}/subject/id/`);
  const [ldpContainerUrl, setLdpContainerUrl] = useState(`${ldpServer}/container/as:Note`);

  const sendNote = async () => {
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: title,
      content: content,
      published: '2019-05-28T12:12:12Z'
    };

    const response = await fetch(`${ldpServer}/activitypub/outbox`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });

    const activity = await response.json();

    alert('Activity created with ID : ' + activity.id);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-logo">SemApps Playground</p>
      </header>
      <div className="App-form">
        <input value={title} onChange={e => setTitle(e.target.value)} />
        <textarea rows="7" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={sendNote}>Envoyer le message</button>
      </div>

      <div className="App-form">
        <label>uri</label>
        <input value={ldpUrl} onChange={e => setLdpUrl(e.target.value)} />
        <Value src={`[${ldpUrl}].as_content`} />
      </div>
      <hr />
      <div className="App-form">
        <label>container</label>
        <input value={ldpContainerUrl} onChange={e => setLdpContainerUrl(e.target.value)} />
        <List src={`[${ldpContainerUrl}].ldp_contains.as_content`} container={items => <div>{items}</div>}>
          {(item, index) => <p key={index}>{`${item}`} </p>}
        </List>
      </div>
      <hr />
      <Value src="[https://ruben.verborgh.org/profile/].label" />
      <p className="App-section">Ruben's friends</p>
      <div className="App-form">
        <List src="[https://ruben.verborgh.org/profile/#me].friends.firstName" container={items => <p>{items}</p>}>
          {item => <span>{`${item}`} </span>}
        </List>
      </div>
    </div>
  );
};

export default App;
