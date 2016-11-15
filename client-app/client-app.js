import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import PageBase from './pageBase';
import config from './config'
//import MenuBar from './menu-bar'



import Login from './login/login'
import LoginService from './login/login-service'
import Systembar from './systembar/systembar.js'
import Dashboard from './dashboard/dashboard'

// import Navigation from './navigation/navigation'

import Audit from './auditlog/auditlog'
import BetType from './auditlog/betType'
import FilterBlock from './auditlog/filterBlock'
import Navigation from './navigation/navigation'

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

			<Systembar />
			
			<Router history={hashHistory}>
				<Route path='/' component={Login} />
				<Route path='/page' component={PageBase} onEnter={hasAuth}>
					<IndexRoute component={Dashboard} />
					<Route path='audit' component={Audit} onEnter={hasAuth} />
				</Route>
                <Route path='/dashboard' component={Dashboard} onEnter={hasAuth} />
                <Route path='/audit' component={Audit} onEnter={hasAuth} />
			</Router>
		</div>
		), target)

	$.get(config.url('/api/config')).then(configOverride)
}
