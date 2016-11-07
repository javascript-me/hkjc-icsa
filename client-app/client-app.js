import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Login from './login/login.js'
import LoginService from './login/login-service.js'
import Dashboard from './dashboard/dashboard.js'
import Navigation from './navigation/navigation.js'

const hasAuth = (nextState, replace) => {
	if (!LoginService.hasProfile()) {
		replace('/')
	}
}

export default (target) => {
	ReactDOM.render((
		<div className='container-fluid'>
			<Navigation />
			<Router history={hashHistory}>
				<Route path='/' component={Login} />
				<Route path='/dashboard' component={Dashboard} onEnter={hasAuth} />
			</Router>
		</div>
		), target)
}
