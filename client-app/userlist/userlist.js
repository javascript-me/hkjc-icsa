import React from 'react'
// import classnames from 'classnames'
import TabularData from '../tabulardata/tabulardata'
import Paging from '../paging/paging'
import UserStore from './user-store'
import SearchEnquiryPanel from '../account-list-filter/searchEnquiryPanel'
import AddingUserCmp from '../add-account'

export default React.createClass({
	displayName: 'UserProfileList',

	headers: [
		{'id': 1, label: 'User Display Name', fieldName: 'displayName', sortingClass: 'down-arrow', addCheckBox: false},
		{'id': 2, label: 'User ID', fieldName: 'userID', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 3, label: 'User Name', fieldName: 'firstName', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 4, label: 'Staff ID', fieldName: 'staffID', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 5, label: 'Position / Title', fieldName: 'position', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 6, label: 'User Roles', fieldName: 'assignedUserRoles', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 7, label: 'Account Status', fieldName: 'status', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 8, label: 'Date of Activation', fieldName: 'activationDate', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 9, label: 'Date of Inactivation', fieldName: 'deactivationDate', sortingClass: 'no-arrow', addCheckBox: false}
	],

	getInitialState () {
		return {
			pageTitle: 'Home \\ Tool & Administration \\ User',
			userprofiles: [],
			isShowingMoreFilter: false,
			addingUserStep: 0
		}
	},

	componentDidMount () {
		let sortingObject = {fieldName: 'activationDate', order: 'DESCEND'}
		// Get Table Data
		UserStore.searchAuditlogs(1, sortingObject, null)
		UserStore.addChangeListener(this.onChange)
	},

	componentWillUnmount: function () {
		UserStore.removeChangeListener(this.onChange.bind(this))
		document.removeEventListener('click', this.pageClick, false)
	},

	onChange () {

		const hasData = UserStore.userProfiles.length > 0

		UserStore.userProfiles.forEach((item) =>{
			let role = item.assignedUserRoles.map((item) => (item.assignedUserRole)).join(',')
			item.assignedUserRoles = role
		})

		console.log(UserStore.userProfiles,'ddd')
		this.setState({
			userprofiles: UserStore.userProfiles, hasData: hasData
		})
	},

	handleChangePage (selectedPageNumber, sortingObject, criteriaOption) {
		UserStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
	},

	handleClickSorting  (selectedPageNumber, sortingObject, criteriaOption) {
		UserStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
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
					<TabularData displayCheckBox={true} headers={this.headers} dataCollection={this.state.userprofiles} onClickSorting={this.handleClickSorting} />
				</div>
				<div className='content-footer'>
					<div className='content-footer-left'>
						<button className='btn btn-primary btn-disable'>Delete</button>
					</div>
					<div className='content-footer-center'>
						<Paging pageData={UserStore.pageData} onChangePage={this.handleChangePage} />
					</div>
					<div className='content-footer-right'>
						<button className='btn btn-primary' onClick={this.onChange}>Update</button>
					</div>
				</div>
			</div>
		</div>
	}
})
