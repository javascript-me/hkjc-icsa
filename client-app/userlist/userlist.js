import React from 'react'
// import classnames from 'classnames'
import TabularData from '../tabulardata/tabulardata'
import SearchEnquiryPanel from '../account-list-filter/searchEnquiryPanel'
import AddingUserCmp from '../add-account'

export default React.createClass({
	displayName: 'UserProfileList',

	headers: [
		{'id': 1, label: 'User Display Name', fieldName: 'date_time', sortingClass: 'down-arrow', addCheckBox: true},
		{'id': 2, label: 'User ID', fieldName: 'user_id', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 3, label: 'User Name', fieldName: 'user_name', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 4, label: 'Staff ID', fieldName: 'Type', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 5, label: 'Position / Title', fieldName: 'function_module', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 6, label: 'User Roles', fieldName: 'function_event_detail', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 7, label: 'Account Status', fieldName: 'user_role', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 8, label: 'Date of Activation', fieldName: 'ip_address', sortingClass: 'no-arrow', addCheckBox: true},
		{'id': 9, label: 'Date of Inactivation', fieldName: 'backend_id', sortingClass: 'no-arrow', addCheckBox: true}
	],

	getInitialState () {
		return {
			pageTitle: 'Home \\ Tool & Administration \\ User',
			auditlogs: [],
			isShowingMoreFilter: false,
			addingUserStep: 0
		}
	},

	showMoreFilter () {
		this.setState({isShowingMoreFilter: !this.state.isShowingMoreFilter})
	},
	startAddingUser () {
		this.setState({addingUserStep: 1})
	},

	render () {
		// let moreFilterContianerClassName = classnames('more-filter-popup', {
		// 	'active': this.state.isShowingMoreFilter
		// })
		return <div className='row userlist-page'>
			<AddingUserCmp step={this.state.addingUserStep} />
			<div className='page-header'>
				<p>{this.state.pageTitle}</p>
				<h1>User Account Profile List</h1>
			</div>
			<div className='page-content'>
				<div className='content-header'>
					<div className='content-header-left'>
						<i className='icon icon-search' />
						<input className='input-search' onClick={this.showMoreFilter} type='text' placeholder='Search with keywords & filters' />
						<div style={{display: this.state.isShowingMoreFilter ? 'block' : 'none'}} onClick={this.clickForSearching}>
							<SearchEnquiryPanel setFilterEvent={this.setFilters} />
						</div>
					</div>
					<div className='content-header-right' onClick={this.startAddingUser}>
						add user
					</div>
				</div>
				<div className='content-table'>
					<TabularData displayCheckBox={false} headers={this.headers} dataCollection={this.state.auditlogs} />
				</div>
				<div className='content-footer'>
					<div className='content-footer-left'>
						<button className='btn btn-primary btn-disable'>Delete</button>
					</div>
					<div className='content-footer-center'>
						Page Component
					</div>
					<div className='content-footer-right'>
						<button className='btn btn-primary'>Update</button>
					</div>
				</div>
			</div>
		</div>
	}
})
