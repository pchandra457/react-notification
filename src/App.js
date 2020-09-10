import React from 'react';

import Notification from './components/Notification';
import logo from './logo.svg';
import './App.css';

function App() {
  const data = [
    {
      "message": "This is my first notification",
      "redirectTo": "#",
      "timestamp": 1
    },
    {
      "message": "This is my second notification",
      "redirectTo": "#",
      "timestamp": 2
    },
    {
      "message": "This is my third notification",
      "redirectTo": "#",
      "timestamp": 3
    }
  ]
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="top-corner">
          <Notification
            data={data}
            notific_key='timestamp'
            notific_value='message'
            notific_redirect='redirectTo'
            size={32}
            color="#ffffff" 
            bgcolor="#282c34"
          />
        </div>
      </header>
    </div>
  );
}

export default App;
