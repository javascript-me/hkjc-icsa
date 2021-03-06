import React from 'react'
import FilterBlocksContainer from '../filter-block/filter-blocks-container'
import FilterPanel from '../filter-panel'
import FilterPanelRow from '../filter-panel/filter-panel-row'
import FilterPanelColumn from '../filter-panel/filter-panel-column'
import { TableComponent, TableHeaderColumn } from '../table'
import UserStore from './user-store'
import PubSub from '../pubsub'
import Moment from 'moment'

import UserListService from './user-list-service'

const selectdata = UserListService.getSelectDataSources()

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
	return Moment(dateTimeFrom)
}

const getOrginDateTimeTo = function () {
	let dateTimeTo = new Date()

	dateTimeTo.setHours(23)
	dateTimeTo.setMinutes(59)
	dateTimeTo.setSeconds(59)
	dateTimeTo.setMilliseconds(0)
	dateTimeTo.setFullYear(2018)
	return Moment(dateTimeTo)
}

const defaultDateFrom = getOrginDateTimeFrom()
const defaultDateTo = getOrginDateTimeTo()

export default React.createClass({
	displayName: 'UserProfileList',

	getInitialState () {
		return {
			pageTitle: 'Home \\ Global Tools & Administration \\ User',
			editMode: false,
			userprofiles: [],
			loading: false,
			isShowingMoreFilter: false,
			addingUserStep: 0,
			filterReflashFlag: true,
			tokens: {
				USERPROFILE_SEARCH: 'USERPROFILE_SEARCH',
				USERPROFILE_SEARCH_BY_KEY_PRESS: 'USERPROFILE_SEARCH_BY_KEY_PRESS',
				USERPROFILE_SEARCH_BY_REMOVE_FILTER: 'USERPROFILE_SEARCH_BY_REMOVE_FILTER'
			},
			keyword: '',
			isSearching: false,
			selectedKeyword: '',
			selectedFilters: [{
				name: 'dateTimeFrom',
				value: defaultDateFrom
			}, {
				name: 'dateTimeTo',
				value: defaultDateTo
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
		UserStore.addChangeListener(this.onChange)

		// Get Table Data
		this.searchUserProfileList()

		reFlashToken = PubSub.subscribe(PubSub.FliterRefreshEvent, () => {
			this.setState({filterReflashFlag: false})
			setTimeout(() => { this.setState({filterReflashFlag: true}) }, 0)
		})
		searchToken = PubSub.subscribe(PubSub[this.state.tokens.USERPROFILE_SEARCH], () => {
			this.searchUserProfileList()
		})
		document.addEventListener('click', this.pageClick, false)
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
			let role = item.assignedUserRoles ? item.assignedUserRoles.map((item) => (item.assignedUserRole)).join(', ') : ' '
			item.assignedUserRoles = role
		})

		this.setState({
			userprofiles: UserStore.userProfiles,
			hasData: hasData,
			loading: false
		})
	},
	pageClick: function (event) {
		if (!this.state.isShowingMoreFilter || this.state.isClickForSearching) {
			this.setState({isClickForSearching: false})
			return
		}

		this.hideMoreFilter()
	},

	clickForSearching: function () {
		this.setState({
			isClickForSearching: true
		})
	},

	showMoreFilter () {
		this.clickForSearching()

		this.setState({
			isShowingMoreFilter: true
		})
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
		this.setState({
			selectedKeyword: this.state.keyword,
			loading: true
		}, () => {
			let criteriaOption = this.getSearchCriterias()
			// Get Table Data
			UserStore.searchUsers(criteriaOption)
		})
	},

	getSearchCriterias: function () {
		let returnFilters = []
		let filterValue

		this.state.selectedFilters.forEach((filter) => {
			if (filter.name === 'dateTimeFrom' || filter.name === 'dateTimeTo') {
				filterValue = filter.value.format('DD MMM YYYY HH:mm')
			} else {
				filterValue = filter.value
			}

			returnFilters.push({
				name: filter.name,
				value: filterValue
			})
		})

		return {
			keyword: this.state.selectedKeyword,
			filters: returnFilters
		}
	},

	getFormattedFilters: function (filters) {
		const filterDisplayFormatting = (filter) => {
			let filterDisplayName = filter.value

			switch (filter.name) {
			case 'keyword':
				filterDisplayName = `${filter.name}: ${filter.value}`
				break
			case 'dateTimeFrom':
				filterDisplayName = `From: ${filter.value.format('DD MMM YYYY HH:mm')}`
				break
			case 'dateTimeTo':
				filterDisplayName = `To: ${filter.value.format('DD MMM YYYY HH:mm')}`
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
		})[0] || null
		let dateToFilter = filters.filter((f) => {
			return f.name === 'dateTimeTo'
		})[0] || null
		let filtersArrayWithoutDateRange = filters.filter((f) => {
			if (f.name === 'dateTimeFrom' || f.name === 'dateTimeTo') {
				return false
			}
			return true
		})

		let filtersArray = []
			.concat(this.state.selectedKeyword ? keywordFilter : [])
			.concat((!dateFromFilter || dateFromFilter.value.isSame(defaultDateTimeFrom)) ? [] : [dateFromFilter])
			.concat((!dateToFilter || dateToFilter.value.isSame(defaultDateTimeTo)) ? [] : [dateToFilter])
			.concat(filtersArrayWithoutDateRange)
		let formattedFilters = filtersArray.map((f, index) => {
			return {
				text: filterDisplayFormatting(f),
				value: f
			}
		})

		return formattedFilters
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
		if (rowItem.userID) {
			location.href = '#/page/userprofile/' + rowItem.userID
		}
	},

	render () {
		let formattedFilters = this.getFormattedFilters(this.state.selectedFilters)

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
							<input className='input-search' onClick={this.showMoreFilter} type='text' placeholder='Search with keywords' value={this.state.keyword}
								onChange={this.handleKeywordChange}
								onKeyPress={this.handleKeywordPress}
								ref='keyword' />
						</div>
						<FilterBlocksContainer filters={formattedFilters} onRemoveOneFilter={this.removeSearchCriteriaFilter} />
						<div style={{display: this.state.isShowingMoreFilter ? 'block' : 'none'}} onClick={this.clickForSearching} className='user-list-serch-pannel' ref='searchPannel'>
							<FilterPanel
								triggerSearchTopic={this.state.tokens.USERPROFILE_SEARCH_BY_KEY_PRESS}
								removeOneFilterTopic={this.state.tokens.USERPROFILE_SEARCH_BY_REMOVE_FILTER}
								onSubmit={this.setFilters}>
								<FilterPanelRow>
									<FilterPanelColumn filterName='position' filterTitle='Position / Title' ctrlType='select' dataSource={selectdata.position} />
									<FilterPanelColumn filterName='userRole' filterTitle='User Roles' ctrlType='select' dataSource={selectdata.userRole} />
									<FilterPanelColumn filterName='accountStatus' filterTitle='Account status' ctrlType='select' dataSource={selectdata.accountStatus} />
								</FilterPanelRow>
								<FilterPanelRow>
									<FilterPanelColumn filterName='dateTimeFrom'
										filterTitle='Date of Activation'
										filterValue={defaultDateFrom}
										ctrlType='calendar' />
									<FilterPanelColumn filterName='dateTimeTo'
										filterTitle='Date of Inactivation'
										filterValue={defaultDateTo}
										ctrlType='calendar' />
								</FilterPanelRow>
							</FilterPanel>
						</div>
					</div>
					<div className='content-header-right add-user-btn' onClick={() => { this.setAddStep(1) }} style={{display: this.state.editMode ? 'block' : 'none'}}>
						+ Add User
					</div>
				</div>
				<div className='content-table tableComponent-container'>
					<TableComponent data={this.state.userprofiles}
						loading={this.state.loading} pagination options={this.state.tableOptions} striped keyField='userID'
						tableHeaderClass='table-header' tableContainerClass='base-table' >
						<TableHeaderColumn dataField='displayName' dataSort>User Display Name</TableHeaderColumn>
						<TableHeaderColumn dataField='userID' dataSort>User ID</TableHeaderColumn>
						<TableHeaderColumn dataField='firstName' dataSort>User Name</TableHeaderColumn>
						<TableHeaderColumn dataField='staffID' dataSort>Staff ID</TableHeaderColumn>
						<TableHeaderColumn dataField='position' dataSort>Position</TableHeaderColumn>
						<TableHeaderColumn dataField='assignedUserRoles' dataSort>User Roles</TableHeaderColumn>
						<TableHeaderColumn dataField='status' dataSort>Account Status</TableHeaderColumn>
						<TableHeaderColumn dataField='activationDate' dataSort>Date of Activation</TableHeaderColumn>
						<TableHeaderColumn dataField='deactivationDate' dataSort>Date of Inactivation</TableHeaderColumn>
					</TableComponent>
				</div>
			</div>
		</div>
	}
})

// <div className='content-footer'>
// 	<div className='content-footer-left'>
// 		<button className='btn btn-primary btn-disable'>Delete</button>
// 	</div>
// 	<div className='content-footer-right'>
// 		{!this.state.editMode ? <button className='btn btn-primary' onClick={this.setEditMode}>Edit</button>
// 			: (<div><button className='btn btn-cancle' onClick={this.setEditMode}>Cancel</button>
// 				<button className='btn btn-primary' onClick={this.onChange}>Update</button></div>)
// 	}
// 	</div>
// </div>
