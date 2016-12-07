import React, { PropTypes } from 'react'
import classNames from 'classnames'

import Popup from '../popup'
import {TableComponent, TableHeaderColumn} from '../table'
// import UserProfileService from '../userprofile/userprofile-service'

function priceFormatter (cell, row) {
	return '$' + cell
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
				<div className='content'>
					<TableComponent data={tableData} bodyStyle={{height: 'calc(100% - 42px)'}}>
						<TableHeaderColumn dataField='id' isKey dataAlign='center' dataSort>Product ID</TableHeaderColumn>
						<TableHeaderColumn dataField='name' dataSort>Product Name</TableHeaderColumn>
						<TableHeaderColumn dataField='price' dataFormat={priceFormatter}>Product Price</TableHeaderColumn>
					</TableComponent>
				</div>
			</div>
		)
	}
})
