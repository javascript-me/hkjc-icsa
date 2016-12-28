import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import PageBase from './pageBase'
import config from './config'
import Login from './login/login'
import LoginService from './login/login-service'
import Dashboard from './dashboard/dashboard'
import ContextMenu from './context-menu'
import ContextMenuService from './context-menu/context-menu-service'
import Popup, { PopupService } from './popup'
import Audit from './auditlog/auditlog'
// import ActionMonitor from './action-monitor/action-monitor'
import ActionMonitor from './action-monitor'
import UserList from './userlist/userlist'
import UserProfile from './userprofile/userprofile'
import MyProfile from './myprofile/myprofile'
import Broadcast from './broadcast'
import Noticeboard from './notice-board/notice-board'
import ContigencyControl from './contigency-control/contigency-control'

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
		ContextMenuService.init(this.refs.globalContextMenu)
	},
	render () {
		return (
			<div className='container-fluid'>
				<Router history={hashHistory}>
					<Route path='/' component={Login} />
					<Route path='/page' component={PageBase} onEnter={hasAuth}>
						<IndexRoute component={Dashboard} />
						<Route path='audit' component={Audit} />
						<Route path='actionmonitor' component={ActionMonitor} />
						<Route path='userlist' component={UserList} />
						<Route path='userprofile/:userId' component={UserProfile} />
						<Route path='myprofile' component={MyProfile} />
						<Route path='noticeboard' component={Noticeboard} />
						<Route path='broadcast' component={Broadcast} />
						<Route path='contigency' component={ContigencyControl} />
					</Route>
				</Router>

				<Popup hideOnOverlayClicked ref='globalPopup' />
				<ContextMenu ref='globalContextMenu' />
			</div>
		)
	}
})

export default (target) => {
	ReactDOM.render((<AppContainer />), target)
	$.get(config.url('/api/config')).then(configOverride)
}
