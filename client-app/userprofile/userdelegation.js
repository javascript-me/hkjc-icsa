import React, { PropTypes } from 'react'
import classNames from 'classnames'
import MutiSelect from '../muti-select'
import Calendar from '../calendar'
import _ from 'lodash'
import moment from 'moment'

import Popup from '../popup'
import {TableComponent, TableHeaderColumn} from '../table'
// import UserProfileService from '../userprofile/userprofile-service'
import AddDelegation from './adddelegation'

const roleVeiw = (cell, row, enumObject, index) => {
	let text = cell && cell.map((item) => (item.delegatedRole)).join(', ')
	return text
}
export default React.createClass({
	displayName: 'UserDelegation',
	propTypes: {
		userDelegation: PropTypes.array,
		delegationUpdate: PropTypes.bool,
		myAccountProfile: PropTypes.object
	},
	getDefaultProps () {
		return {
			userDelegation: null,
			delegationUpdate: false
		}
	},
	getInitialState () {
		this.tableOptions = {
			// defaultSortName: 'userName',  // default sort column name
			// defaultSortOrder: 'desc' // default sort order
		}
		this.selectRowProp = {
			mode: 'checkbox'
		}
		const editUserDelegation = _.cloneDeep(this.props.userDelegation)
		return {userDelegation: this.props.userDelegation, editUserDelegation}
	},
	getCheckboxFormat (cell, row) {
		return (
			<input type='checkbox' value={row.checkbox} onClick={() => { row.checkbox = !row.checkbox }} />
		)
	},
	getCalendarFormat (field) {
		const calendarFormat = (cell, row, enumObject, index) => {
			let time = cell

			if (cell.indexOf('/') > 0) {
				time = moment(cell, 'DD/MM/YYYY').format('D MMM, YYYY')
			}
			const handleChang = (value) => {
				if (typeof (value) !== 'string') {
					time = moment(value).format('DD/MM/YYYY')
				}
				const next = _.cloneDeep(this.state.editUserDelegation)
				next[index][field] = time
				next[index].changeFlag = true
				this.setState({editUserDelegation: next})
			}
			return (<Calendar value={time} onChange={handleChang} />)
		}

		return calendarFormat
	},
	geterrClassNameFormat (colField) {
		const errClassNameFormat = (cell, row, rowIdx, colIdx) => {
			switch (colField) {
			case ('userRole') : { return row.roleErr ? 'errCell' : '' }
			case ('delegationTo') : { return (row.delegationToErr || row.smallDateErr) ? 'errCell' : '' }
			case ('delegationFrom') : { return (row.delegationFromErr || row.smallDateErr) ? 'errCell' : '' }
			default : return ''
			}
		}
		return errClassNameFormat
	},

	roleFormat  (cell, row, enumObject, index) {
		let userRoles = this.props.myAccountProfile && this.props.myAccountProfile.assignedUserRoles || []
		let placeHolder = 'Select Role'
		let selectedOption

		let options = userRoles && userRoles.map((item, idx) => ({label: item.assignedUserRole, value: item.assignedUserRole}))

		options = options.length && options.filter((item) => {
			if (item.value.toLowerCase().indexOf('admin') > -1) {
				return false
			}
			return true
		})

		if (cell && (cell.length > 0)) {
			selectedOption = options.map(selectItem => {
				let isIn = false
				cell.forEach((cellItem) => {
					if (cellItem.delegatedRole === selectItem.value) {
						isIn = selectItem
					}
				})
				return isIn
			}).filter(item => item)
		} else {
			selectedOption = []
		}
		const style = {
			position: 'absulute',
			width: '90%',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			margin: 'auto',
			height: '30px'
			// backgroundColor: row.roleErr ? 'red' : '#FFF'
		}
		const next = _.cloneDeep(this.state.editUserDelegation)
		const updateRoleInfo = (value) => {
			let newRoles = _.map(value, (item) => ({delegatedRole: item.value}))
			next[index].delegatedRoles = newRoles
			next[index].changeFlag = true
			this.setState({editUserDelegation: next})
		}
		return (<MutiSelect placeHolder={placeHolder} selectedOptions={selectedOption} options={options} style={style} onChange={updateRoleInfo} />)
	},
	getLastData () {
		return this.props.delegationUpdate ? this.state.editUserDelegation : this.state.userDelegation
	},
	onAddClick (popupCmp) {
		popupCmp.show()
	},
	addNewRecord (user) {
		let newUser = user || {userName: 'New User', position: 'new position'}
		let newDelegationID = 'Delegate' + Math.floor((Math.random() * 1000000))
		const newDelegate = Object.assign({}, newUser, {userName: newUser.displayName}, {delegateStatus: 'pedding', secondaryApprover: 'please select', delegationID: newDelegationID, changeFlag: true})
		const next = _.cloneDeep(this.state.editUserDelegation)
		newDelegate.isNewRecord = true
		next.unshift(newDelegate)
		this.setState({editUserDelegation: next})
	},
	checkVaild () {
		checkDataVaild(this.state.editUserDelegation)
		this.forceUpdate()
	},
	getDeleteData () {
		if (this.refs.updateTableCmp) {
			const selected = this.refs.updateTableCmp.store.getSelectedRowKeys()
			return selected
		}
		return []
	},
	componentWillReceiveProps (nextProps) {
		if (nextProps.userDelegation !== this.state.userDelegation) {
			this.setState({userDelegation: nextProps.userDelegation, editUserDelegation: _.cloneDeep(nextProps.userDelegation)})
		}
	},

	getChangeResult () {
		const changeResult = _.filter(this.getLastData(), (item) => (item.changeFlag))
		return changeResult
		// pass data to server
	},
	resetDelegtionData () {
		const newEditDelegationData = _.cloneDeep(this.state.userDelegation)
		this.setState({editUserDelegation: newEditDelegationData})
	},

	onAddDelegation (delegationShow) {
		const delegation = delegationShow.getDelegation()
		if (delegation) {
			this.addNewRecord(delegation)
		}
	},
	render () {
		if (!this.props.userDelegation) {
			return this.renderNone()
		} else {
			if (this.props.delegationUpdate) {
				return this.renderNormal(this.state.editUserDelegation)
			} else {
				return this.renderNormal(this.state.userDelegation)
			}
		}
	},
	highLightNew (row, rowIndex) {
		let result = row.isNewRecord ? 'new-record' : ''
		return result
	},
	renderNone () {
		return (
			<div ref='root' className='user-delegation' />
		)
	},
	renderNormal (tableData) {
		const { delegationUpdate } = this.props
		return (
			<div ref='root' className='user-delegation mid-overlay' style={{width: '600px'}}>
				<div className='header'>
					<h2>User Delegation</h2>
					<div className={classNames('action', {hidden: !this.props.delegationUpdate})} onClick={() => { this.onAddClick(this.refs.addDelegation) }}>
						+ Add Delegation
					</div>
					<Popup hideOnOverlayClicked ref='addDelegation' title='Add Delegation' onConfirm={() => { this.onAddDelegation(this.refs.delegationShow) }} confirmBtn='Add'>
						<AddDelegation ref='delegationShow' />
					</Popup>
				</div>
				<div className='tableComponent-container content user-delegation-table' >
					{delegationUpdate
					? <TableComponent
						ref='updateTableCmp'
						striped
						keyField='delegationID'
						tableHeaderClass='table-header'
						tableContainerClass='base-table'
						selectRow={this.selectRowProp}
						data={tableData}
						options={this.tableOptions}
						trClassName={this.highLightNew}

					>
						<TableHeaderColumn dataField='userName' dataSort>Username</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='delegatedRoles' width='250' className='column-header' dataFormat={this.roleFormat} columnClassName={this.geterrClassNameFormat('userRole')}>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' width='250' className='column-header' dataFormat={this.getCalendarFormat('delegationFrom')} columnClassName={this.geterrClassNameFormat('delegationFrom')}>Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' width='250' className='column-header' dataFormat={this.getCalendarFormat('delegationTo')} columnClassName={this.geterrClassNameFormat('delegationTo')}>Date of Delegation To</TableHeaderColumn>
						<TableHeaderColumn dataField='delegateStatus' className='column-header'>Delegation Status</TableHeaderColumn>
					</TableComponent>
					: <TableComponent
						striped
						keyField='delegationID'
						tableHeaderClass='table-header'
						tableContainerClass='base-table'
						data={tableData}
						options={this.tableOptions}
					>
						<TableHeaderColumn dataField='userName' dataSort>Username</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='delegatedRoles' dataSort dataFormat={roleVeiw}>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' dataSort>Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' dataSort>Date of Delegation To</TableHeaderColumn>
						<TableHeaderColumn dataField='delegateStatus' dataSort>Delegation Status</TableHeaderColumn>
					</TableComponent>}
				</div>
			</div>
		)
	}
})

const checkDataVaild = (nextState) => {
	nextState.forEach((item) => {
		if (item.changeFlag && (!item.delegatedRoles || (item.delegatedRoles.length === 0))) {
			item.roleErr = true
		} else {
			item.roleErr = null
		}
		if (!item.delegationTo) {
			item.delegationToErr = true
		} else {
			item.delegationToErr = null
		}
		if (!item.delegationFrom) {
			item.delegationFromErr = true
		} else {
			item.delegationFromErr = null
		}
		if (item.delegationTo && item.delegationFrom && (campareTime(item.delegationTo, item.delegationFrom) < 0)) {
			item.smallDateErr = true
		} else {
			item.smallDateErr = null
		}
	})
}

export function campareTime (v1, v2) {
	let s1 = v1.split('/')
	let s2 = v2.split('/')
	let t1 = new Date()
	let t2 = new Date()
	t1.setFullYear(s1[2], +s1[1] - 1, s1[0])
	t2.setFullYear(s2[2], +s2[1] - 1, s2[0])
	return (t1.getTime() - t2.getTime())
}

