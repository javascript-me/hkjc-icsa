import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import PageBase from './pageBase'
import config from './config'
import Login from './login/login'
import LoginService from './login/login-service'
import Dashboard from './dashboard/dashboard'
import Popup, { PopupService } from './popup'
import Audit from './auditlog/auditlog'
import UserList from './userlist/userlist'
import UserProfile from './userprofile/userprofile'
import MyProfile from './myprofile/myprofile'

import Noticeboard from './notice-board/notice-board'

const hasAuth = (nextState, replace) => {
	if (!LoginService.hasProfile()) {
		replace('/')
	}
}

const configOverride = (overrides) => {
	config.override(overrides)
}

const AppContainer = React.createClass({
	displayName: 'AppContainer',
	componentDidMount () {
		PopupService.init(this.refs.globalPopup)
	},
	render () {
		return (
			<div className='container-fluid'>
				<Router history={hashHistory}>
					<Route path='/' component={Login} />
					<Route path='/page' component={PageBase} onEnter={hasAuth}>
						<IndexRoute component={Dashboard} />
						<Route path='audit' component={Audit} />
						<Route path='userlist' component={UserList} />
						<Route path='userprofile/:userId' component={UserProfile} />
						<Route path='myprofile' component={MyProfile} />
						<Route path='noticeboard' component={Noticeboard} />
					</Route>
				</Router>

				<Popup hideOnOverlayClicked ref='globalPopup' />
			</div>
		)
	}
})

export default (target) => {
	ReactDOM.render((<AppContainer />), target)
	$.get(config.url('/api/config')).then(configOverride)
}
