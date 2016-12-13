import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Calendar from '../calendar'
import _ from 'lodash'
// import moment from 'moment'

import Popup from '../popup'
import {TableComponent, TableHeaderColumn} from '../table'
// import UserProfileService from '../userprofile/userprofile-service'
import AddDelegation from './adddelegation'

const roleVeiw = (cell, row, enumObject, index) => {
	let text = cell && cell.map((item) => (item.delegatedRole)).join(' ')
	return text
}
export default React.createClass({
	displayName: 'UserDelegation',
	propTypes: {
		userDelegation: PropTypes.array,
		delegationUpdate: PropTypes.bool
	},
	getDefaultProps () {
		return {
			userDelegation: null,
			delegationUpdate: false
		}
	},
	getInitialState () {
		this.tableOptions = {
			defaultSortName: 'userName',  // default sort column name
			defaultSortOrder: 'desc' // default sort order
		}
		this.selectRowProp = {
			mode: 'checkbox'
			// clickToSelect: true,
			// selected: [], // default select on table
			// bgColor: 'rgb(238, 193, 213)',
			// onSelect: onRowSelect,
			// onSelectAll: onSelectAll
		}
		return {userDelegation: this.props.userDelegation}
	},
	getCheckboxFormat (cell, row) {
		return (
			<input type='checkbox' value={row.checkbox} onClick={() => { row.checkbox = !row.checkbox }} />
		)
	},
	getCalendarFormat (field) {
		const calendarFormat = (cell, row, enumObject, index) => {
			const handleChang = (value) => {
				let time = value
				if (typeof (value) !== 'string') {
					time = value.format('DD MM YYYY')
				}
				const next = _.cloneDeep(this.state.editUserDelegation)
				next[index][field] = time
				next[index].changeFlag = true
				this.setState({editUserDelegation: next})
			}
			return (<Calendar value={row[field]} onChange={handleChang} />)
		}

		return calendarFormat
	},
	onAddClick (popupCmp) {
		popupCmp.show()
	},
	getDeleteData () {
		let ids = this.state.userDelegation.filter((item) => {
			return item.checkbox
		}).map((item) => {
			return item.delegationID
		})

		return ids
	},
	componentWillReceiveProps (nextProps) {
		if (nextProps.userDelegation !== this.state.userDelegation) {
			this.setState({userDelegation: nextProps.userDelegation, editUserDelegation: _.cloneDeep(nextProps.userDelegation)})
		}
	},

	onUpdateClick () {
		const changeResult = _.filter(this.getLastData(), (item) => (item.changeFlag))
		return changeResult
		// pass data to server
	},
	onAddDelegation (delegationShow) {
		const delegation = delegationShow.getDelegation()
		this.addNewRecord(delegation)
	},
	render () {
		if (!this.props.userDelegation) {
			return this.renderNone()
		// } else if (this.props.delegationUpdate) {
		// 	return this.renderUpdate(this.props.userDelegation)
		} else {
			if (this.props.delegationUpdate) {
				return this.renderNormal(this.state.editUserDelegation)
			} else {
				return this.renderNormal(this.state.userDelegation)
			}
		}
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
						striped
						tableHeaderClass='table-header'
						tableContainerClass='base-table'
						selectRow={this.selectRowProp}
						data={tableData}
						options={this.tableOptions}
						bodyStyle={{height: 'calc(100% - 42px)'}}
					>
						<TableHeaderColumn dataField='userName' isKey dataSort dataAlign='center' >Username</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort dataAlign='center'>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='delegatedRoles' dataFormat={this.roleFormat} dataAlign={'center'}>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' dataAlign='center' dataFormat={this.getCalendarFormat('delegationFrom')} >Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' dataAlign='center' dataFormat={this.getCalendarFormat('delegationTo')}>Date of Delegation To</TableHeaderColumn>
						<TableHeaderColumn dataField='delegateStatus' dataAlign='center'>Delegation Status</TableHeaderColumn>
						<TableHeaderColumn dataField='secondaryApprover' dataAlign='center'>Secondary Approver</TableHeaderColumn>
					</TableComponent>
					: <TableComponent
						striped
						tableHeaderClass='table-header'
						tableContainerClass='base-table'
						data={tableData}
						options={this.tableOptions}
						bodyStyle={{height: 'calc(100% - 42px)'}}
					>
						<TableHeaderColumn dataField='userName' isKey dataSort dataAlign='center' >Username</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort dataAlign='center'>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='delegatedRoles' dataAlign={'center'} dataFormat={roleVeiw}>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' dataAlign='center' >Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' dataAlign='center'>Date of Delegation To</TableHeaderColumn>
						<TableHeaderColumn dataField='delegateStatus' dataAlign='center'>Delegation Status</TableHeaderColumn>
						<TableHeaderColumn dataField='secondaryApprover' dataAlign='center'>Secondary Approver</TableHeaderColumn>
					</TableComponent>}
				</div>
			</div>
		)
	}
})

