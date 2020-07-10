import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sign from './views/sign/Sign'
import Chat from './views/chat/Chat'


export interface IRoute {}

function App() {
	const isLogged = localStorage.getItem('accessToken') ? true : false

	function PublicRoute({ component: Component, ...rest}: any) {
		return (
			<Route {...rest} render={props => {
				if (isLogged) return <Redirect to={{ pathname: "/chat", state: { from: props.location }}} />
				return  <Component {...rest} />
			}}/>
		)
	}

  return (
    <Router>
			<Switch>
				<PublicRoute path="/" exact component={Sign}/>
				<PublicRoute path="/sign" component={Sign}/>
				<Route path="/chat" component={Chat}/>
			</Switch>
    </Router>
  );
}

export default App;
