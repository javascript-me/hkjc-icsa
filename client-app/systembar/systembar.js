import React from 'react'
import LoginService from '../login/login-service'
import classNames from 'classnames'
import PubSub from '../pubsub'

let token = null

export default React.createClass({
	displayName: 'Systembar',
	getCurrentState () {
		return {
			show: LoginService.hasProfile()
		}
	},
	getInitialState () {
		return this.getCurrentState()
	},
	componentDidMount () {
		token = PubSub.subscribe(PubSub.LOGIN_CHANGE, () => {
			this.setState(this.getCurrentState())
		})
	},
	componentWillUnmount () {
		PubSub.unsubscribe(token)
	},
	showClock () {

	},
	render () {
		const classes = classNames('row row-systembar', {hidden: !this.state.show})
		return (
			<div className={classes}>
				<a className='logo'><img src='HKJC_Logo.svg' /> <span><strong className=''>HKJC</strong> SPORTS BETTING</span></a>
				<span onClick={this.showClock}><strong>10:40am,</strong> Sep 19</span>
			</div>
			)
	}
})
