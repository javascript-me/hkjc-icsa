import React from 'react'
import LoginService from '../login/login-service'
import classNames from 'classnames'
import PubSub from '../pubsub'

let token = null

export default React.createClass({
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
	render () {
		const classes = classNames('row row-navigation', {hidden: !this.state.show})
		return (
			<div className={classes}>
				<div className='col-lg-2'><a href='#/' className='pullRight' onClick={LoginService.logout}>Logout</a></div>
			</div>
			)
	}
})
