import React, { PropTypes } from 'react'
import classNames from 'classnames'
import MutiSelect from '../muti-select'
import Calendar from '../calendar'
// import moment from 'moment'

import Popup from '../popup'
import {TableComponent, TableHeaderColumn} from '../table'
// import UserProfileService from '../userprofile/userprofile-service'
import AddDelegation from './adddelegation'

let sampleRole = ['Trading User', 'Trading Support Analyst', 'Trading Supervisor']
const roleFormat = (cell, row, enumObject, index) => {
	let placeHolder = cell.map(item => item.delegatedRole).join(' ')
	const options = sampleRole.map((item, idx) => ({label: item, value: item}))
	const style = {
		position: 'absulute',
		width: '90%',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 'auto',
		height: '30px'

	}
	return (<MutiSelect placeHolder={placeHolder} options={options} style={style} />)
}

const roleVeiw = (cell, row, enumObject, index) => {
	let text = cell.map((item) => (item.delegatedRole)).join(' ')
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
				const next = this.state.userDelegation
				next[index][field] = time
				this.setState({userDelegation: next})
			}
			return (<Calendar value={row[field]} onChange={handleChang} />)
		}

		return calendarFormat
	},
	onAddClick (popupCmp) {
		popupCmp.show()
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
			this.setState({userDelegation: nextProps.userDelegation})
		}
	},

	onUpdateClick () {
	},
	onAddDelegation (delegationShow) {
		const delegation = delegationShow.getDelegation()
		return delegation
	},
	render () {
		if (!this.props.userDelegation) {
			return this.renderNone()
		} else {
			return this.renderNormal(this.state.userDelegation)
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
			<div ref='root' className='user-delegation mid-overlay'>
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
						bodyStyle={{height: 'calc(100% - 42px)'}}
					>
						<TableHeaderColumn dataField='userName' dataSort dataAlign='center' >Username</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort dataAlign='center'>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='delegatedRoles' dataFormat={roleFormat} dataAlign={delegationUpdate ? 'left' : 'center'}>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' dataAlign='center' dataFormat={this.getCalendarFormat('delegationFrom')} >Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' dataAlign='center' dataFormat={this.getCalendarFormat('delegationTo')}>Date of Delegation To</TableHeaderColumn>
						<TableHeaderColumn dataField='delegateStatus' dataAlign='center'>Delegation Status</TableHeaderColumn>
						<TableHeaderColumn dataField='secondaryApprover' dataAlign='center'>Secondary Approver</TableHeaderColumn>
					</TableComponent>
					: <TableComponent
						striped
						keyField='delegationID'
						tableHeaderClass='table-header'
						tableContainerClass='base-table'
						data={tableData}
						options={this.tableOptions}
						bodyStyle={{height: 'calc(100% - 42px)'}}
					>
						<TableHeaderColumn dataField='userName' dataSort dataAlign='center' >Username</TableHeaderColumn>
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

