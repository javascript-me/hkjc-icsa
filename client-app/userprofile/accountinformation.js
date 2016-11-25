import React, { PropTypes } from 'react'
import Moment from 'moment'

export default React.createClass({
	displayName: 'AccountInformation',
	propTypes: {
		userAccount: PropTypes.object.isRequired
	},
	formatTime (time) {
		return Moment(time, 'DD-MM-YYYY').format('MMM DD,YYYY')
	},
	getAccountDescription () {
		let retStr = ''
		if (this.props.userAccount.status === 'Active') {
			retStr = 'Active since ' + this.formatTime(this.props.userAccount.activationDate)
		} else {
			retStr = 'Inactive'
		}
		return retStr
	},
	render () {
		return (
			<div ref='root' className='account-information'>
				<div className='header'>
					<h2>account-information</h2>
				</div>
				<div className='content'>
					<div className='row name'>
						<div className='col col-xs-6'>User Display Name</div>
						<div className='col col-xs-6'>Account:</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-6'>{this.props.userAccount.displayName}</div>
						<div className='col col-xs-6'>{this.getAccountDescription()}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6'>Assigned User Role / Privilege</div>
						<div className='col col-xs-6'>Activation Date</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>{this.formatTime(this.props.userAccount.activationDate)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Deactivation Date</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>{this.formatTime(this.props.userAccount.deactivationDate)}</div>
					</div>
				</div>
			</div>
		)
	}
})
