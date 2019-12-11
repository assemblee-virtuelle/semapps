import React, { useState } from 'react';
import { List } from '@solid/react';
import './App.css';

const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const sendNote = async () => {
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Note',
      name: title,
      content: content,
      published: '2019-05-28T12:12:12Z'
    };

    const response = await fetch('http://localhost:3000/activitypub/outbox', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });

    const activity = await response.json();

    alert('Activity created with ID : ' + activity.id);

    window.location.reload();
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
      <p className="App-section">Messages already posted</p>
      <div className="App-form">
        <List src="[http://localhost:3000/container/as:Note].ldp_contains.as_name" container={items => <div>{items}</div>}>
          {(item, index) => <p key={index}>{`${item}`} </p>}
        </List>
      </div>
    </div>
  );
};

export default App;
