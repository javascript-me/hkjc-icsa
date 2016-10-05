import 'babel-polyfill'
// window.$ = window.jQuery = require('jquery')
// import 'bootstrap/dist/js/bootstrap.min.js'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Login from './login/login.js'
import Dashboard from './dashboard/dashboard.js'

const root = document.getElementById('root')

ReactDOM.render((
	<Router history={hashHistory}>
		<Route path='/' component={Login} />
		<Route path='/dashboard' component={Dashboard} />
	</Router>
	), root)
