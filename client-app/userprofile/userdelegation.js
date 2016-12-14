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

let sampleRole = ['Trading User', 'Trading Support Analyst', 'Trading Supervisor']

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
			const handleChang = (value) => {
				let time = value
				if (typeof (value) !== 'string') {
					time = moment(value).format('DD/MM/YYYY')
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
		let placeHolder = 'Select Role'
		let selectedOption
		
		const options = sampleRole.map((item, idx) => ({label: item, value: item}))
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
					<MutiSelect options={[{label:1,value:1},{label:2,value:2},{label:3,value:3}]} placeHolder={'select'} selectedOptions={[{value:2,label:2}]}/>
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
						<TableHeaderColumn dataField='delegatedRoles' dataFormat={this.roleFormat} dataAlign={'center'} columnClassName={this.geterrClassNameFormat('userRole')}>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' dataAlign='center' dataFormat={this.getCalendarFormat('delegationFrom')} columnClassName={this.geterrClassNameFormat('delegationFrom')}>Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' dataAlign='center' dataFormat={this.getCalendarFormat('delegationTo')} columnClassName={this.geterrClassNameFormat('delegationTo')}>Date of Delegation To</TableHeaderColumn>
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

