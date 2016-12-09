import React, { PropTypes } from 'react'
import classNames from 'classnames'
import MutiSelect from '../muti-select'

import Popup from '../popup'
import {TableComponent, TableHeaderColumn} from '../table'
// import UserProfileService from '../userprofile/userprofile-service'

function roleFormatter (cell, row) {
	return cell.map(item => item.delegatedRole).join(',')
}
let sampleRole = ['Trading User','Trading Support Analyst','Trading Supervisor']
const roleFormat = (cell, row, enumObject, index) => {
	let placeHolder = cell.map(item => item.delegatedRole).join(',')
	const options = sampleRole.map(item => ({label:item}))
	const style = {
		
		position:'absulute',
		width:'90%',
		
		top:0,
		bottom:0,
		left:0,
		right:0,
		margin:'auto',
		textAlign:'left',
		
	}
	return (<MutiSelect placeHolder={placeHolder} options={options} style={style}/>)
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
		this.selectRowProp = {
			mode: 'checkbox'
			// clickToSelect: true,
			// selected: [], // default select on table
			// bgColor: 'rgb(238, 193, 213)',
			// onSelect: onRowSelect,
			// onSelectAll: onSelectAll
		}
		return {}
	},
	onAddClick (popupCmp) {
		popupCmp.show()
	},
	onDeleteClick () {
	},
	onUpdateClick () {
	},
	render () {
		if (!this.props.userDelegation) {
			return this.renderNone()
		// } else if (this.props.delegationUpdate) {
		// 	return this.renderUpdate(this.props.userDelegation)
		} else {
			return this.renderNormal(this.props.userDelegation)
		}
	},
	renderNone () {
		return (
			<div ref='root' className='user-delegation' />
		)
	},
	// renderNormal (tableData) {
	// 	return (
	// 		<div ref='root' className='user-delegation'>
	// 			<div className='header'>
	// 				<h2>User Delegation</h2>
	// 			</div>
	// 			<div className='content'>
	// 				<TableComponent data={tableData} bodyStyle={{height: 'calc(100% - 42px)'}}>
	// 						<TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
	// 						<TableHeaderColumn dataField="name" dataSort={true}>Product Name</TableHeaderColumn>
	// 						<TableHeaderColumn dataField="price" dataFormat={priceFormatter}>Product Price</TableHeaderColumn>
	// 				</TableComponent>
	// 			</div>
	// 		</div>
	// 	)
	// },
	renderNormal (tableData) {
		return (
			<div ref='root' className='user-delegation'>
				<div className='header'>
					<h2>User Delegation</h2>
					<div className={classNames('action', {hidden: !this.props.delegationUpdate})} onClick={() => { this.onAddClick(this.refs.addDelegation) }}>
						+ Add Delegation
					</div>
					<Popup hideOnOverlayClicked ref='addDelegation' title='Add Delegation' onConfirm={() => {}} confirmBtn='Add'>
						<div>come soon</div>
					</Popup>
				</div>
				<div className='content user-delegation-table' >
					<TableComponent
						data={tableData}
						bodyStyle={{height: 'calc(100% - 42px)'}}
						
						// selectRow={this.selectRowProp}
						
					>
						<TableHeaderColumn dataField='userName' isKey dataSort dataAlign='center' >Username</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort dataAlign='center'>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='delegatedRoles' dataFormat={roleFormat} dataAlign='center'>Delegate Role</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationFrom' dataAlign='center'>Date of Delegation From</TableHeaderColumn>
						<TableHeaderColumn dataField='delegationTo' dataAlign='center'>Date of Delegation To</TableHeaderColumn>
						<TableHeaderColumn dataField='delegateStatus' dataAlign='center'>Delegation Status</TableHeaderColumn>
						<TableHeaderColumn dataField='secondaryApprover' dataAlign='center'>Secondary Approver</TableHeaderColumn>
					</TableComponent>
				</div>
			</div>
		)
	}
})

