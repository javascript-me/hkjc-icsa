import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import config from './config'
import MenuBar from './menu-bar'
import Login from './login/login'
import LoginService from './login/login-service'
import Systembar from './systembar/systembar.js'
import Dashboard from './dashboard/dashboard'
// import Navigation from './navigation/navigation'

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

			<Systembar />
			<MenuBar />
			<Router history={hashHistory}>
				<Route path='/' component={Login} />
				<Route path='/dashboard' component={Dashboard} onEnter={hasAuth} />
			</Router>
		</div>
		), target)

	$.get(config.url('/api/config')).then(configOverride)
}
