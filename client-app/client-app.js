import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import PageBase from './pageBase'
import config from './config'
// import MenuBar from './menu-bar'

import Login from './login/login'
import LoginService from './login/login-service'
import Dashboard from './dashboard/dashboard'

import Audit from './auditlog/auditlog'

import UserProfile from './userprofile/userprofile'
import AddAccount from './add-account'

import UserList from './userlist/userlist'

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
				<Route path='/' component={Login} />
				<Route path='/page' component={PageBase} onEnter={hasAuth}>
					<IndexRoute component={Dashboard} />
					<Route path='audit' component={Audit} />
					<Route path='userprofile/:userId' component={UserProfile} />
					<Route path='filter' component={AddAccount} />
					<Route path='userlist' component={UserList} />
					<Route path='userlist2' component={UserList} />

				</Route>
			</Router>
		</div>
		), target)

	$.get(config.url('/api/config')).then(configOverride)
}
