import React, { PropTypes } from 'react'

import Popup from '../popup'

export default React.createClass({
	displayName: 'UserDelegation',
	propTypes: {
		userDelegation: PropTypes.array
	},
	getDefaultProps () {
		return {
			userDelegation: null
		}
	},
	// getInitialState () {
	// 	return {
	// 	}
	// },
	// componentDidMount () {
	// },
	onAddDelegation (popupCmp) {
		popupCmp.show()
	},
	render () {
		if (!this.props.userDelegation) {
			return this.renderNone()
		} else {
			return this.renderTable()
		}
	},
	renderNone () {
		return (
			<div ref='root' className='user-delegation' />
		)
	},
	renderTable () {
		return (
			<div ref='root' className='user-delegation'>
				<div className='header'>
					<h2>User Delegation</h2>
					<div className='action' onClick={() => { this.onAddDelegation(this.refs.addDelegation) }}>
						+ Add Delegation
					</div>
					<Popup hideOnOverlayClicked ref='addDelegation' title='Add Delegation' onConfirm={() => {}} confirmBtn='Add'>
						<div>come soon</div>
					</Popup>
				</div>
				<div className='content' />
			</div>
		)
	}
})
