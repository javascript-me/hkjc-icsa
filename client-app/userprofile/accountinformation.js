import React, { PropTypes } from 'react'
import classNames from 'classnames'
import _ from 'underscore'
import Moment from 'moment'
import DateTime from '../dateTime/dateTime'
import Popup from '../popup'
import RolesContainer from './rolescontainer'

function isValidDateTime (str) {
	let bRet = Moment(str, 'DD MMM YYYY', true).isValid()
	return bRet
}

function formatDateTime (time, inverse) {
	if (!time) {
		return ''
	}

	if (inverse) {
		return Moment(time, 'DD MMM YYYY').format('DD/MM/YYYY')
	} else {
		return Moment(time, 'DD/MM/YYYY').format('DD MMM YYYY')
	}
}

function formatTime (time) {
	if (!time) {
		return ''
	}

	return Moment(time, 'DD/MM/YYYY').format('MMM DD,YYYY')
}

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
	getInitialState () {
		this._cloneData(this.props.userAccount)
		return {}
	},
	componentWillReceiveProps (nextProps) {
		this._cloneData(nextProps.userAccount)
	},
	_cloneData (userAccount) {
		this.userAccount = _.clone(userAccount)
		this.userAccountEx = {
			activationDate: formatDateTime(this.userAccount.activationDate),
			deactivationDate: formatDateTime(this.userAccount.deactivationDate)
		}
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
	onEditRoleClick () {
		this.refs.editRole.show()
	},
	onEditRoleUpdate (userAccount) {
		const roles = this.refs.rolesCmp.getUpdateRoles()
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
	onActivationDateChange (event) {
		this.userAccountEx.activationDate = event.target.value
		this.forceUpdate()
	},
	onDeactivationDateChange (event) {
		this.userAccountEx.deactivationDate = event.target.value
		this.forceUpdate()
	},
	renderTipsText () {
		let hasDataError = this.hasDataError(this.userAccount)
		if (hasDataError) {
			return <div className='color-red'>Invalid fields are highlighted in red</div>
		} else {
			return <div />
		}
	},
	renderUserRoles (userAccount) {
		if (!userAccount.assignedUserRoles || userAccount.assignedUserRoles.length === 0) {
			return <div />
		} else {
			return (
				<div className='role-wrapper'>
					{userAccount.assignedUserRoles && userAccount.assignedUserRoles.map((role, index) => (
						<div key={index} className={classNames('role', {'highlight': index >= this.highlightIndex})}>{role.assignedUserRole}</div>
					))}
				</div>
			)
		}
	},
	render () {
		if (this.props.updateMode) {
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
					<div className='action' onClick={this.onEditRoleClick}>
						<span className='icon pull-left' /> Edit User Role
					</div>
					<Popup hideOnOverlayClicked ref='editRole' title='Edit User Role / Privilege' onConfirm={() => { this.onEditRoleUpdate(userAccount) }} confirmBtn='Update'>
						<RolesContainer ref='rolesCmp' inputSelected={userAccount.assignedUserRoles} />
					</Popup>
				</div>
				<div className='content'>
					<div className='row name'>
						<div className='col col-xs-6'>User Display Name</div>
						<div className='col col-xs-6'>Account:</div>
					</div>
					<div className='row value'>
						<div className={classNames('col col-xs-6', {'has-error': !userAccount.displayName})}>
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
							{this.renderUserRoles(userAccount)}
						</div>
						<div className={classNames('col col-xs-6', {'has-error': !isValidDateTime(this.userAccountEx.activationDate)})}>
							<DateTime inputFor='' dateTime={this.userAccountEx.activationDate} handleVal={this.onActivationDateChange} />
						</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Deactivation Date</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6'>
							{this.renderTipsText()}
						</div>
						<div className={classNames('col col-xs-6', {'has-error': !isValidDateTime(this.userAccountEx.deactivationDate)})}>
							<DateTime inputFor='' dateTime={this.userAccountEx.deactivationDate} handleVal={this.onDeactivationDateChange} />
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
							{this.renderUserRoles(userAccount)}
						</div>
						<div className='col col-xs-6'>{formatTime(userAccount.activationDate)}</div>
					</div>

					<div className='row name'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>Deactivation Date</div>
					</div>
					<div className='row value margin0'>
						<div className='col col-xs-6' />
						<div className='col col-xs-6'>{formatTime(userAccount.deactivationDate)}</div>
					</div>
				</div>
			</div>
		)
	}
})
