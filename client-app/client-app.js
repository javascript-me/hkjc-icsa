import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import config from './config'
// import Login from './login/login.js'
import LoginService from './login/login-service.js'
// import Dashboard from './dashboard/dashboard.js'
// import Navigation from './navigation/navigation.js'
import MenuBar from './menu-bar'

const hasAuth = (nextState, replace) => {
	if (!LoginService.hasProfile()) {
		replace('/')
	}
}

const configOverride = (overrides) => {
	config.override(overrides)
}

export default (target) => {
	ReactDOM.render((
		<div className='container-fluid'>

			<Router history={hashHistory}>
				<Route path='/' component={MenuBar} />
				<Route path='/dashboard' component={MenuBar} onEnter={hasAuth} />
			</Router>
		</div>
		), target)

	$.get(config.url('/api/config')).then(configOverride)
}
