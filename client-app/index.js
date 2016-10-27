import 'babel-polyfill'
import 'isomorphic-fetch'
// Fix for jQuery and Bootstrap shim
// https://github.com/twbs/bootstrap/issues/17201
window.$ = window.jQuery = require('jquery')
var Bootstrap = require('bootstrap')
Bootstrap.$ = $
// End of fix
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

const root = document.getElementById('root')

ReactDOM.render((
	<div className='pages'>
		<Navigation />
		<Router history={hashHistory}>
			<Route path='/' component={Login} />
			<Route path='/dashboard' component={Dashboard} onEnter={hasAuth} />
		</Router>
	</div>
	), root)
