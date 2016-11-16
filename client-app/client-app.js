import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Login from './login/login'
import LoginService from './login/login-service'
import Dashboard from './dashboard/dashboard'
import Audit from './auditlog/auditlog'
import BetType from './auditlog/betType'
import FilterBlock from './auditlog/filterBlock'
import Navigation from './navigation/navigation'
import config from './config'
import SearchEnquiryPanel from './searchEnquiryPanel/searchEnquiryPanel'

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
			<Navigation />
			<Router history={hashHistory}>
				<Route path='/' component={Login} />
				<Route path='/dashboard' component={Dashboard} onEnter={hasAuth} />
				<Route path='/audit' component={Audit} onEnter={hasAuth} />
			</Router>
		</div>
		), target)

	$.get(config.url('/api/config')).then(configOverride)
}
