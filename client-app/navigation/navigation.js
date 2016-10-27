import React from 'react'
import LoginService from '../login/login-service'
import classNames from 'classnames'
import PubSub from '../pubsub'

export default React.createClass({
	getCurrentState () {
		return {
			show: LoginService.hasProfile()
		}
	},
	token: undefined,
	getInitialState () {
		return this.getCurrentState()
	},
	componentDidMount () {
		this.token = PubSub.subscribe(PubSub.LOGIN_CHANGE, () => {
			this.setState(this.getCurrentState())
		})
	},
	componentWillUnmount () {
		PubSub.unsubscribe(this.token)
	},
	render () {
		const classes = classNames('navigation', {hidden: !this.state.show})
		return (
			<div className={classes}>
				<span><a href='#/' className='pull-right' onClick={LoginService.logout}>Logout</a></span>
			</div>
			)
	}
})
