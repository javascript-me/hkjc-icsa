import React, { PropTypes } from 'react'
import _ from 'underscore'
import Moment from 'moment'
import DateTime from '../dateTime/dateTime'

export default React.createClass({
	displayName: 'AccountInformation',
	propTypes: {
		userAccount: PropTypes.object.isRequired,
		updateMode: PropTypes.bool
	},
	getDefaultProps () {
		return {
			updateMode: false
		}
	},
	resetData (noUpdate) {
		this.userAccount = _.clone(this.props.userAccount)
		if (!noUpdate) {
			this.forceUpdate()
		}
	},
	getData () {
		return this.userAccount
	},
	verifyData () {
		return false
	},
	formatTime (time) {
		return Moment(time, 'DD-MM-YYYY').format('MMM DD,YYYY')
	},
	getAccountDescription (userAccount) {
		let retStr = ''
		if (userAccount.status === 'Active') {
			retStr = 'Active since ' + this.formatTime(userAccount.activationDate)
		} else {
			retStr = 'Inactive'
		}
		return retStr
	},
	onDisplayNameChange (event) {
		this.userAccount.displayName = event.target.value
		this.forceUpdate()
	},
	onAccountStatusChange (event) {
		this.userAccount.status = event.target.value
		this.forceUpdate()
	},
	onActivationDateChange (event) {
	},
	onDeactivationDateChange (event) {
	},
	render () {
		if (this.props.updateMode) {
			if (!this.userAccount) {
				this.resetData(true)
			}
			return this.renderUpdate(this.userAccount)
		} else {
			return this.renderNormal(this.props.userAccount)
		}
	},
	renderUpdate (userAccount) {
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
						<div className='col col-xs-6'>
							<input type='text' maxLength='40' className='form-control display-name' placeholder='Type in display name' value={userAccount.displayName} onChange={this.onDisplayNameChange} />
						</div>
						<div className='col col-xs-6'>
							<label className='radio-inline'>
								<input type='radio' name='accountRadio' value='Active' checked={userAccount.status === 'Active'} onChange={this.onAccountStatusChange} /> Active
							</label>
							<label className='radio-inline'>
								<input type='radio' name='accountRadio' value='Inactive' checked={userAccount.status !== 'Active'} onChange={this.onAccountStatusChange} /> Inactive
							</label>
						</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6'>Assigned User Role / Privilege</div>
						<div className='col col-xs-6'>Activation Date</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-6 roles'>
							{userAccount.assignedUserRoles && userAccount.assignedUserRoles.map((role, index) => (
								<div key={index} className='role'>{role.assignedUserRole}</div>
							))}
						</div>
						<div className='col col-xs-6'>
							<DateTime inputFor='' dateTime={this.formatTime(userAccount.activationDate)} handleVal={this.onActivationDateChange} />
						</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Deactivation Date</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>
							<DateTime inputFor='' dateTime={this.formatTime(userAccount.deactivationDate)} handleVal={this.onDeactivationDateChange} />
						</div>
					</div>
				</div>
			</div>
		)
	},
	renderNormal (userAccount) {
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
						<div className='col col-xs-6'>{userAccount.displayName}</div>
						<div className='col col-xs-6'>{this.getAccountDescription(userAccount)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6'>Assigned User Role / Privilege</div>
						<div className='col col-xs-6'>Activation Date</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-6 roles'>
							{userAccount.assignedUserRoles && userAccount.assignedUserRoles.map((role, index) => (
								<div key={index} className='role'>{role.assignedUserRole}</div>
							))}
						</div>
						<div className='col col-xs-6'>{this.formatTime(userAccount.activationDate)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Deactivation Date</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>{this.formatTime(userAccount.deactivationDate)}</div>
					</div>
				</div>
			</div>
		)
	}
})
