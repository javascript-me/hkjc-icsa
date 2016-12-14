import React, { PropTypes } from 'react'
import classNames from 'classnames'
import _ from 'underscore'
import Moment from 'moment'
import Calendar from '../calendar'
import Popup from '../popup'
import RolesContainer from './rolescontainer'
import RolesPermission from './rolespermission'

function isValidDateTime (str) {
	let bRet = Moment(str, 'DD MMM YYYY HH:mm', true).isValid()
	return bRet
}

function formatDateTime (time, inverse) {
	if (!time) {
		return ''
	}

	if (inverse) {
		return Moment(time, 'DD MMM YYYY HH:mm').format('DD/MM/YYYY')
	} else {
		return Moment(time, 'DD/MM/YYYY').format('DD MMM YYYY HH:mm')
	}
}

function formatTime (time) {
	if (!time) {
		return ''
	}

	return Moment(time, 'DD/MM/YYYY').format('DD MMM, YYYY')
}

export default React.createClass({
	displayName: 'AccountInformation',
	propTypes: {
		userAccount: PropTypes.object.isRequired,
		showDate: PropTypes.bool,
		updateMode: PropTypes.bool
	},
	getDefaultProps () {
		return {
			showDate: true,
			updateMode: false
		}
	},
	getInitialState () {
		this._cloneData(this.props.userAccount)
		return {}
	},
	_cloneData (userAccount) {
		this.userAccount = _.clone(userAccount)
		this.userAccountEx = {
			activationDate: formatDateTime(this.userAccount.activationDate),
			deactivationDate: formatDateTime(this.userAccount.deactivationDate)
		}
		this.resetDataHighlight()
	},
	resetDataHighlight () {
		this.highlightIndex = 100000
	},
	resetData () {
		this._cloneData(this.props.userAccount)
		this.forceUpdate()
	},
	getData () {
		this.userAccount.activationDate = formatDateTime(this.userAccountEx.activationDate, true)
		this.userAccount.deactivationDate = formatDateTime(this.userAccountEx.deactivationDate, true)
		return this.userAccount
	},
	hasDataError (userAccount) {
		return !userAccount.displayName || !isValidDateTime(this.userAccountEx.activationDate) || !isValidDateTime(this.userAccountEx.deactivationDate)
	},
	verifyData () {
		let hasDataError = this.hasDataError(this.userAccount)
		if (hasDataError) {
			return false
		}
		return true
	},
	getAccountDescription (userAccount) {
		let retStr = ''
		if (userAccount.status === 'Active') {
			retStr = 'Active since ' + formatTime(userAccount.activationDate)
		} else {
			retStr = 'Inactive'
		}
		return retStr
	},
	onEditRoleClick (editRole) {
		editRole.show()
	},
	onRoleShowClick (roleDetail) {
		roleDetail.show()
	},
	onEditRoleUpdate (userAccount, rolesCmp) {
		const roles = rolesCmp.getUpdateRoles()
		const oldUserRoles = this.props.userAccount.assignedUserRoles.filter((item) => {
			let bRet = true
			let found = -1

			for (let i = 0; i < roles.length; i++) {
				if (roles[i] === item.assignedUserRole) {
					found = i
					break
				}
			}

			if (found > -1) {
				roles.splice(found, 1)
			} else {
				bRet = false
			}

			return bRet
		})

		this.highlightIndex = oldUserRoles.length

		const highlightRoles = []
		roles.forEach((roleName) => {
			highlightRoles.push({
				assignedUserRole: roleName
			})
		})

		userAccount.assignedUserRoles = oldUserRoles.concat(highlightRoles)

		this.forceUpdate()
	},
	onDisplayNameChange (event) {
		this.userAccount.displayName = event.target.value
		this.forceUpdate()
	},
	onAccountStatusChange (event) {
		this.userAccount.status = event.target.value
		this.forceUpdate()
	},
	onActivationDateChange (date) {
		this.userAccountEx.activationDate = date.format('DD MMM YYYY HH:mm')
		this.forceUpdate()
	},
	onDeactivationDateChange (date) {
		this.userAccountEx.deactivationDate = date.format('DD MMM YYYY HH:mm')
		this.forceUpdate()
	},
	renderTipsText () {
		let hasDataError = this.hasDataError(this.userAccount)
		if (hasDataError) {
			return <div className='color-red'>Invalid fields are highlighted in red</div>
		} else {
			return ''
		}
	},
	renderUserRoles (userAccount) {
		if (!userAccount.assignedUserRoles || userAccount.assignedUserRoles.length === 0) {
			return <div />
		} else {
			return (
				<div className='role-wrapper'>
					{userAccount.assignedUserRoles && userAccount.assignedUserRoles.map((role, index) => (
						<div key={index} className={classNames('role', {'highlight': index >= this.highlightIndex})} onClick={() => { this.onRoleShowClick(this.refs.rolesDetail) }}>{role.assignedUserRole}</div>
					))}
					<Popup hideOnOverlayClicked className='permission' ref='rolesDetail' title='Admin Roles & Permission' showCancel={false} confirmBtn='Close'>
						<RolesPermission ref='rolesShow' inputSelected={userAccount.assignedUserRoles} />
					</Popup>
				</div>
			)
		}
	},
	render () {
		if (this.props.updateMode) {
			return this.renderUpdate(this.userAccount)
		} else if (!this.props.showDate) {
			return this.renderNoDate(this.props.userAccount)
		} else {
			return this.renderNormal(this.props.userAccount)
		}
	},
	renderUpdate (userAccount) {
		return (
			<div ref='root' className='account-information'>
				<div className='header'>
					<h2>Account Information</h2>
					<div className='action' onClick={() => { this.onEditRoleClick(this.refs.editRole) }}>
						<span className='icon pull-left' /> Edit User Role
					</div>
					<Popup hideOnOverlayClicked ref='editRole' title='Edit User Role / Privilege' onConfirm={() => { this.onEditRoleUpdate(userAccount, this.refs.rolesCmp) }} confirmBtn='Update'>
						<RolesContainer ref='rolesCmp' inputSelected={userAccount.assignedUserRoles} />
					</Popup>
				</div>
				<div className='content'>
					<div className='row name'>
						<div className='col col-xs-6'>User Display Name</div>
						<div className='col col-xs-6'>Account Status</div>
					</div>
					<div className='row value'>
						<div className={classNames('col col-xs-6', {'has-error': !userAccount.displayName})}>
							<input type='text' maxLength='100' className='form-control display-name' placeholder='Type in display name' value={userAccount.displayName} onChange={this.onDisplayNameChange} />
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
						<div className='col col-xs-6'>Date of Activation</div>
					</div>
					<div className='row value roles-detail'>
						<div className='col col-xs-6 roles'>
							{this.renderUserRoles(userAccount)}
						</div>
						<div className='col col-xs-6'>
							<Calendar
								disabled={userAccount.status !== 'Active'}
								value={this.userAccountEx.activationDate}
								warning={!isValidDateTime(this.userAccountEx.activationDate)}
								onChange={this.onActivationDateChange} />
						</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Date of Inactivation</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>
							<Calendar
								value={this.userAccountEx.deactivationDate}
								warning={!isValidDateTime(this.userAccountEx.deactivationDate)}
								onChange={this.onDeactivationDateChange} />
						</div>
					</div>

					{this.renderTipsText()}
				</div>
			</div>
		)
	},
	renderNormal (userAccount) {
		return (
			<div ref='root' className='account-information'>
				<div className='header'>
					<h2>Account Information</h2>
				</div>
				<div className='content'>
					<div className='row name'>
						<div className='col col-xs-6'>User Display Name</div>
						<div className='col col-xs-6'>Account Status</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-6'>{userAccount.displayName}</div>
						<div className='col col-xs-6'>{this.getAccountDescription(userAccount)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6'>Assigned User Role / Privilege</div>
						<div className='col col-xs-6'>Date of Activation</div>
					</div>
					<div className='row value roles-detail'>
						<div className='col col-xs-6 roles '>
							{this.renderUserRoles(userAccount)}
						</div>
						<div className='col col-xs-6'>{formatTime(userAccount.activationDate)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Date of Inactivation</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>{formatTime(userAccount.deactivationDate)}</div>
					</div>
				</div>
			</div>
		)
	},
	renderNoDate (userAccount) {
		return (
			<div ref='root' className='account-information'>
				<div className='header'>
					<h2>Account Information</h2>
				</div>
				<div className='content'>
					<div className='row name'>
						<div className='col col-xs-6'>User Display Name</div>
						<div className='col col-xs-6'>Account Status</div>
					</div>
					<div className='row value'>
						<div className='col col-xs-6'>{userAccount.displayName}</div>
						<div className='col col-xs-6'>{this.getAccountDescription(userAccount)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-12'>Assigned User Role / Privilege</div>
					</div>
					<div className='row value roles-detail'>
						<div className='col col-xs-12 roles'>
							{this.renderUserRoles(userAccount)}
						</div>
					</div>
				</div>
			</div>
		)
	}
})
