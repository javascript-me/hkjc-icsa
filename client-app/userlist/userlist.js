import React from 'react'
// import classnames from 'classnames'
import FilterBlock from '../filter-block'
import TabularData from '../tabulardata/tabulardata'
import Paging from '../paging/paging'
import UserStore from './user-store'
import SearchEnquiryPanel from '../account-list-filter/searchEnquiryPanel'
import AddingUserCmp from '../add-account'
import PubSub from '../pubsub'
import Moment from 'moment'

let reFlashToken = null
let searchToken = null

const getOrginDateTimeFrom = function () {
	let dateTimeFrom = new Date()

	dateTimeFrom.setDate(dateTimeFrom.getDate() - 60)
	dateTimeFrom.setHours(0)
	dateTimeFrom.setMinutes(0)
	dateTimeFrom.setSeconds(0)
	dateTimeFrom.setMilliseconds(0)
	return Moment(dateTimeFrom).format('DD MMM YYYY HH:mm')
}

const getOrginDateTimeTo = function () {
	let dateTimeTo = new Date()

	dateTimeTo.setHours(23)
	dateTimeTo.setMinutes(59)
	dateTimeTo.setSeconds(59)
	dateTimeTo.setMilliseconds(0)
	return Moment(dateTimeTo).format('DD MMM YYYY HH:mm')
}

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
			addingUserStep: 0,
			filterReflashFlag: true,
			tokens: {
				USERPROFILE_SEARCH: 'USERPROFILE_SEARCH',
				USERPROFILE_SEARCH_BY_KEY_PRESS: 'USERPROFILE_SEARCH_BY_KEY_PRESS',
				USERPROFILE_SEARCH_BY_REMOVE_FILTER: 'USERPROFILE_SEARCH_BY_REMOVE_FILTER'
			},
			keyword: '',
			selectedFilters: [{
				name: 'dateTimeFrom',
				value: getOrginDateTimeFrom()
			}, {
				name: 'dateTimeTo',
				value: getOrginDateTimeTo()
			}]
		}
	},

	componentDidMount () {
		let sortingObject = {fieldName: 'activationDate', order: 'DESCEND'}
		// Get Table Data
		UserStore.searchAuditlogs(1, sortingObject, null)
		UserStore.addChangeListener(this.onChange)
		reFlashToken = PubSub.subscribe(PubSub.FliterRefreshEvent, () => {
			this.setState({filterReflashFlag: false})
			setTimeout(() => { this.setState({filterReflashFlag: true}) }, 0)
		})
		searchToken = PubSub.subscribe(PubSub[this.state.tokens.USERPROFILE_SEARCH], () => {
			this.searchAuditlog()
		})
	},

	componentWillUnmount: function () {
		UserStore.removeChangeListener(this.onChange.bind(this))
		document.removeEventListener('click', this.pageClick, false)
		PubSub.unsubscribe(reFlashToken)
		PubSub.unsubscribe(searchToken)
	},

	onChange () {
		const hasData = UserStore.userProfiles.length > 0

		UserStore.userProfiles.forEach((item) => {
			let role = item.assignedUserRoles.map((item) => (item.assignedUserRole)).join(',')
			item.assignedUserRoles = role
		})

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

	handleKeywordChange: function (event) {
		var newKeyword = event.target.value

		this.setState({
			keyword: newKeyword
		})
	},

	handleKeywordPress: function (event) {
		if (event.key === 'Enter') {
			PubSub.publish(PubSub[this.state.tokens.USERPROFILE_SEARCH_BY_KEY_PRESS])
		}
	},

	removeSearchCriteriaFilter: function (filter) {
		let selectedFilters = this.state.selectedFilters
		let filterIndex = selectedFilters.indexOf(filter)

		selectedFilters.splice(filterIndex, 1)

		this.setState({
			selectedFilters: selectedFilters,
			isShowingMoreFilter: false
		}, () => {
			PubSub.publish(PubSub[this.state.tokens.USERPROFILE_SEARCH_BY_REMOVE_FILTER], filter)
			PubSub.publish(PubSub[this.state.tokens.USERPROFILE_SEARCH])
		})
	},

	setAddStep (step) {
		this.setState({addingUserStep: step})
	},

	hideMoreFilter: function () {
		this.setState({
			isShowingMoreFilter: false
		})
	},

	searchAuditlog: async function () {
		let criteriaOption = this.getSearchCriterias()
		// Get Table Data
		UserStore.searchAuditlogs(1, null, criteriaOption)
	},

	getSearchCriterias: function () {
		return {
			keyword: this.state.keyword,
			filters: this.state.selectedFilters
		}
	},

	setFilters: function (filters) {
		this.hideMoreFilter()

		let newFilters = []

		for (let attr in filters) {
			newFilters.push({
				'name': attr,
				'value': filters[attr]
			})
		}

		this.setState({
			selectedFilters: newFilters
		}, () => {
			PubSub.publish(PubSub[this.state.tokens.USERPROFILE_SEARCH])
		})
	},

	onClickRow (rowItem) {
		if (rowItem.userID) {
			location.href = '#/page/userprofile/' + rowItem.userID
		}
	},

	render () {
		// let moreFilterContianerClassName = classnames('more-filter-popup', {
		// 	'active': this.state.isShowingMoreFilter
		// })

		let filterBlockes = this.state.selectedFilters.map((f, index) => {
			return <FilterBlock
				key={index}
				filter={f}
				removeEvent={this.removeSearchCriteriaFilter}
				removeEventTopic={this.state.tokens.USERPROFILE_SEARCH} />
		}) || []

		return <div className='row userlist-page'>
			{this.state.filterReflashFlag && <AddingUserCmp step={this.state.addingUserStep} setStep={this.setAddStep} />}
			<div className='page-header'>
				<p>{this.state.pageTitle}</p>
				<h1>User Account Profile List</h1>
			</div>
			<div className='page-content'>
				<div className='content-header'>
					<div className='content-header-left'>
						<div className='keyword-search'>
							<i className='icon icon-search' />
							<input className='input-search' onClick={this.showMoreFilter} type='text' placeholder='Search with keywords & filters' value={this.state.keyword}
								onChange={this.handleKeywordChange}
								onKeyPress={this.handleKeywordPress}
								ref='keyword' />
						</div>
						<div className='filter-block-container'>
							{filterBlockes}
						</div>
						<div style={{display: this.state.isShowingMoreFilter ? 'block' : 'none'}} onClick={this.clickForSearching}>
							<SearchEnquiryPanel setFilterEvent={this.setFilters} />
						</div>
					</div>
					<div className='content-header-right' onClick={() => { this.setAddStep(1) }}>
						add user
					</div>
				</div>
				<div className='content-table'>
					<TabularData displayCheckBox headers={this.headers} dataCollection={this.state.userprofiles} onClickSorting={this.handleClickSorting} onClickRow={this.onClickRow} />
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
