import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sign from './views/sign/Sign'
import Chat from './views/chat/Chat'
import Search from './views/search/Search'
import Account from './views/account/Account'


export interface IRoute {}

function App() {
	const isLogged = localStorage.getItem('accessToken') ? true : false

	function PublicRoute({ component: Component, ...rest }: any) {
		return (
			<Route {...rest} render={props => {
				if (isLogged) return <Redirect to={{ pathname: "/chat", state: { from: props.location } }} />
				return  <Component {...rest} />
			}}/>
		)
	}

	function PrivateRoute({ component: Component, ...rest }: any) {
		return (
			<Route {...rest} render={props => {
				if (!isLogged) return <Redirect to={{ pathname: "/", state: { from: props.location } }}	/>
				return <Component {...rest} />
			}}/>
		)
	}

	return (
		<Router>
				<Switch>
					<PublicRoute path="/" exact component={Sign}/>
					<PublicRoute path="/sign" component={Sign}/>
					<PrivateRoute path="/chat" component={Chat}/>
					<PrivateRoute path="/search" component={Search}/>
					<PrivateRoute path="/account" component={Account}/>
				</Switch>
		</Router>
	);
}

export default App;
