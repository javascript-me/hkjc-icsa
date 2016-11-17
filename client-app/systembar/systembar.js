import React from 'react'
import LoginService from '../login/login-service'
import classNames from 'classnames'
import PubSub from '../pubsub'
import Popup from './popup/popup'
import _ from 'underscore'
import Moment from 'moment'

import SystembarService from './systembar-service'

let token = null

const getClock = async () => {
	const time = await SystembarService.getClock()
	return time
}

export default React.createClass({
	displayName: 'Systembar',
	getCurrentState () {
		let currentState = _.clone(this.state)
		currentState.show = LoginService.hasProfile()
		return currentState
	},
	tick (preState) {
		let preStateCopy = _.clone(preState)
		preStateCopy.date = preStateCopy.date + 1000
		return preStateCopy
	},
	getInitialState () {
		return {
			show: LoginService.hasProfile(),
			date: new Date().getTime(),
			showPopup: false
		}
	},
	componentDidMount () {
		token = PubSub.subscribe(PubSub.LOGIN_CHANGE, () => {
			this.setState(this.getCurrentState())
			getClock().then((data) => { this.setState({date: data}) },
				() => { this.setState({date: NaN}) })
			this.interval = setInterval(() => {
				this.setState((preState) => { return this.tick(preState) })
			}, 1000)
		})
	},
	componentWillUnmount () {
		PubSub.unsubscribe(token)
		this.interval = clearInterval(this.interval)
	},
	showClock () {
		this.setState((preState) => {
			let preStateCopy = _.clone(preState)
			preStateCopy.showPopup = true
			return preStateCopy
		})
	},
	hideClock () {
		this.setState((preState) => {
			let preStateCopy = _.clone(preState)
			preStateCopy.showPopup = false
			return preStateCopy
		})
	},
	render () {
		const classes = classNames('row row-systembar', {hidden: !this.state.show})
		return (
			<div className={classes}>
				<span className='logo'><img src='HKJC_Logo.svg' /> <span><strong className=''>HKJC</strong> SPORTS BETTING</span></span>
				<a onClick={this.showClock}><strong>{Moment(Date(this.state.date)).format('hh:mma')},</strong> {Moment(Date(this.state.date)).format('D MMM, YYYY')}</a>
				{ this.state.showPopup ? <Popup date={this.state.date} hideClock={this.hideClock} /> : null }
			</div>
			)
	}
})
