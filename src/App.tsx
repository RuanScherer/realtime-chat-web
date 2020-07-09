import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sign from './views/sign/Sign'
import Chat from './views/chat/Chat'

function App() {
  return (
    <Router>
			<Switch>
				<Route path="/" exact component={Sign}/>
				<Route path="/chat" component={Chat}/>
			</Switch>
    </Router>
  );
}

export default App;
