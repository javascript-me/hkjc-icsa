import React from 'react'
// import classnames from 'classnames'
import FilterBlock from '../filter-block'
import { TableComponent, TableHeaderColumn } from '../table'
import UserStore from './user-store'
import SearchEnquiryPanel from '../account-list-filter/searchEnquiryPanel'
// import AddingUserCmp from '../add-account'
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
	dateTimeFrom.setFullYear(2015)
	return Moment(dateTimeFrom).format('DD MMM YYYY HH:mm')
}

const getOrginDateTimeTo = function () {
	let dateTimeTo = new Date()

	dateTimeTo.setHours(23)
	dateTimeTo.setMinutes(59)
	dateTimeTo.setSeconds(59)
	dateTimeTo.setMilliseconds(0)
	dateTimeTo.setFullYear(2018)
	return Moment(dateTimeTo).format('DD MMM YYYY HH:mm')
}

export default React.createClass({
	displayName: 'UserProfileList',

	getInitialState () {
		return {
			pageTitle: 'Home \\ Global Tools & Administration \\ User',
			editMode: false,
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
			selectedKeyword: '',
			selectedFilters: [{
				name: 'dateTimeFrom',
				value: getOrginDateTimeFrom()
			}, {
				name: 'dateTimeTo',
				value: getOrginDateTimeTo()
			}],
			tableOptions: {
				defaultSortName: 'displayName',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center',
				onRowClick: this.onClickRow
			}
		}
	},

	componentDidMount () {
		let sortingObject = {fieldName: 'userID', order: 'DESCEND'}
		// Get Table Data
		UserStore.searchAuditlogs(1, sortingObject, null)
		UserStore.addChangeListener(this.onChange)
		reFlashToken = PubSub.subscribe(PubSub.FliterRefreshEvent, () => {
			this.setState({filterReflashFlag: false})
			setTimeout(() => { this.setState({filterReflashFlag: true}) }, 0)
		})
		searchToken = PubSub.subscribe(PubSub[this.state.tokens.USERPROFILE_SEARCH], () => {
			this.searchUserProfileList()
		})
	},

	componentWillUnmount: function () {
		UserStore.removeChangeListener(this.onChange)
		document.removeEventListener('click', this.pageClick, false)
		PubSub.unsubscribe(reFlashToken)
		PubSub.unsubscribe(searchToken)
	},

	onChange () {
		const hasData = UserStore.userProfiles.length > 0

		UserStore.userProfiles.forEach((item) => {
			let role = item.assignedUserRoles ? item.assignedUserRoles.map((item) => (item.assignedUserRole)).join(',') : ' '
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
		const callback = () => {
			this.setState({
				isShowingMoreFilter: false
			})

			PubSub.publish(PubSub[this.state.tokens.USERPROFILE_SEARCH_BY_REMOVE_FILTER], filter)
			PubSub.publish(PubSub[this.state.tokens.USERPROFILE_SEARCH])
		}

		switch (filter.name) {
		case 'keyword':
			this.removeKeywordFilter(filter, callback)
			break
		case 'dateTimeFrom':
		case 'dateTimeTo':
			this.removeDateRangeFilter(filter, callback)
			break
		default:
			this.removeNormalFilter(filter, callback)
			break
		}
	},
	removeKeywordFilter: function (keyword, callback) {
		this.setState({
			keyword: '',
			selectedKeyword: ''
		}, callback)
	},
	removeDateRangeFilter: function (dateTime, callback) {
		let selectedFilters = this.state.selectedFilters

		selectedFilters.forEach((filter) => {
			if (filter.name === 'dateTimeFrom' && filter.name === dateTime.name) {
				filter.value = getOrginDateTimeFrom()
			} else if (filter.name === 'dateTimeTo' && filter.name === dateTime.name) {
				filter.value = getOrginDateTimeTo()
			}
		})

		this.setState({
			selectedFilters: selectedFilters
		}, callback)
	},
	removeNormalFilter: function (filter, callback) {
		let selectedFilters = this.state.selectedFilters
		let filterIndex = selectedFilters.indexOf(filter)

		selectedFilters.splice(filterIndex, 1)

		this.setState({
			selectedFilters: selectedFilters
		}, callback)
	},

	setAddStep (step) {
		this.setState({addingUserStep: step})
	},

	hideMoreFilter: function () {
		this.setState({
			isShowingMoreFilter: false
		})
	},

	searchUserProfileList: async function () {
		let criteriaOption = this.getSearchCriterias()

		this.setState({
			selectedKeyword: this.state.keyword
		})

		// Get Table Data
		UserStore.searchAuditlogs(1, null, criteriaOption)
	},

	getSearchCriterias: function () {
		return {
			keyword: this.state.selectedKeyword,
			filters: this.state.selectedFilters
		}
	},

	generateFilterBlockesJsx: function (filters) {
		const filterDisplayFormatting = (filter) => {
			let filterDisplayName = filter.value

			switch (filter.name) {
			case 'keyword':
				filterDisplayName = `${filter.name}: ${filter.value}`
				break
			case 'dateTimeFrom':
				filterDisplayName = `From: ${filter.value}`
				break
			case 'dateTimeTo':
				filterDisplayName = `To: ${filter.value}`
				break
			}

			return filterDisplayName
		}

		let defaultDateTimeFrom = getOrginDateTimeFrom()
		let defaultDateTimeTo = getOrginDateTimeTo()

		let keywordFilter = {
			name: 'keyword',
			value: this.state.selectedKeyword
		}
		let dateFromFilter = filters.filter((f) => {
			return f.name === 'dateTimeFrom'
		})[0] || {}
		let dateToFilter = filters.filter((f) => {
			return f.name === 'dateTimeTo'
		})[0] || {}
		let filtersArrayWithoutDateRange = filters.filter((f) => {
			if (f.name === 'dateTimeFrom' || f.name === 'dateTimeTo') {
				return false
			}
			return true
		})

		let filtersArray = []
			.concat(this.state.selectedKeyword ? keywordFilter : [])
			.concat(dateFromFilter.value === defaultDateTimeFrom ? [] : [dateFromFilter])
			.concat(dateToFilter.value === defaultDateTimeTo ? [] : [dateToFilter])
			.concat(filtersArrayWithoutDateRange)

		let filterBlockes = filtersArray.map((f, index) => {
			return <FilterBlock
				key={index}
				dataText={filterDisplayFormatting(f)}
				dataValue={f}
				removeEvent={this.removeSearchCriteriaFilter} />
		}) || []

		return filterBlockes
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

	setEditMode () {
		this.setState({editMode: !this.state.editMode})
	},

	onClickRow (rowItem) {
		if (rowItem.user_id) {
			location.href = '#/page/userprofile/' + rowItem.user_id
		}
	},

	render () {
		// let moreFilterContianerClassName = classnames('more-filter-popup', {
		// 	'active': this.state.isShowingMoreFilter
		// })

		let filterBlockes = this.generateFilterBlockesJsx(this.state.selectedFilters)

		// {this.state.filterReflashFlag && <AddingUserCmp step={this.state.addingUserStep} setStep={this.setAddStep} />}

		return <div className='row userlist-page'>
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
						<div style={{display: this.state.isShowingMoreFilter ? 'block' : 'none'}} onClick={this.clickForSearching} className='user-list-serch-pannel'>
							<SearchEnquiryPanel setFilterEvent={this.setFilters} />
						</div>
					</div>
					<div className='content-header-right add-user-btn' onClick={() => { this.setAddStep(1) }} style={{display: this.state.editMode ? 'block' : 'none'}}>
						+ Add User
					</div>
				</div>
				<div className='content-table tableComponent-container'>
					<TableComponent data={this.state.userprofiles} pagination options={this.state.tableOptions} striped keyField='userID'
						tableHeaderClass='table-header' tableContainerClass='base-table' selectRow={{ mode: 'checkbox' }}>
						<TableHeaderColumn dataField='displayName' dataSort={true}>User Display Name</TableHeaderColumn>
						<TableHeaderColumn dataField='userID' dataSort={true}>User ID</TableHeaderColumn>
						<TableHeaderColumn dataField='firstName' dataSort={true}>User Name</TableHeaderColumn>
						<TableHeaderColumn dataField='staffID' dataSort={true}>Staff ID</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort={true}>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='assignedUserRoles' dataSort={true}>User Roles</TableHeaderColumn>
						<TableHeaderColumn dataField='status' dataSort={true}>Account Status</TableHeaderColumn>
						<TableHeaderColumn dataField='activationDate' dataSort={true}>Date of Activation</TableHeaderColumn>
						<TableHeaderColumn dataField='deactivationDate' dataSort={true}>Date of Inactivation</TableHeaderColumn>
					</TableComponent>
				</div>
				<div className='content-footer'>
					<div className='content-footer-left' />
					<div className='content-footer-right' />
				</div>
			</div>
		</div>
	}
})

// <div className='content-footer-left'>
// 	<button className='btn btn-primary btn-disable'>Delete</button>
// </div>

// <div className='content-footer-right'>
// 	{!this.state.editMode ? <button className='btn btn-primary' onClick={this.setEditMode}>Edit</button>
// 		: (<div><button className='btn btn-cancle' onClick={this.setEditMode}>Cancel</button>
// 			<button className='btn btn-primary' onClick={this.onChange}>Update</button></div>)
// }

// </div>
