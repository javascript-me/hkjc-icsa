import React from 'react'
import Moment from 'moment'
import ClassNames from 'classnames'
import PubSub from '../pubsub'
import BetType from '../bet-type'
import FilterBlock from '../filter-block'
import FilterPanel from '../filter-panel'
import FilterPanelRow from '../filter-panel/filter-panel-row'
import FilterPanelColumn from '../filter-panel/filter-panel-column'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import AuditlogStore from './auditlog-store'
import ExportService from './export-service'
import {TableHeaderColumn, TableComponent} from '../table'

import AuditlogService from './auditlog-service'

const selectdata = AuditlogService.getSelectDataSources()

const getOrginDateTimeFrom = function () {
	let dateTimeFrom = new Date()

	dateTimeFrom.setDate(dateTimeFrom.getDate() - 60)
	dateTimeFrom.setHours(0)
	dateTimeFrom.setMinutes(0)
	dateTimeFrom.setSeconds(0)
	dateTimeFrom.setMilliseconds(0)
	return Moment(dateTimeFrom)
}

const getOrginDateTimeTo = function () {
	let dateTimeTo = new Date()

	dateTimeTo.setHours(23)
	dateTimeTo.setMinutes(59)
	dateTimeTo.setSeconds(59)
	dateTimeTo.setMilliseconds(0)
	return Moment(dateTimeTo)
}

const getDefaultSelectedFilters = () => {
	return [{
		name: 'dateTimeFrom',
		value: getOrginDateTimeFrom()
	}, {
		name: 'dateTimeTo',
		value: getOrginDateTimeTo()
	}]
}

const doExport = async (format, filters) => {
	const file = ExportService.getFileURL(format, filters)
	if (file) {
		window.open(file, '_blank')
	}
}

let token = null
let DEFAULT_BET_TYPE = 'football'

export default React.createClass({
	displayName: 'Audit',

	getInitialState () {
		return {
			pageTitle: 'Home \\ Global Tools & Adminstration \\ Audit Trail',
			data: [],
			filters: [],
			hasData: false,
			exportFormat: 'pdf',
			tokens: {
				AUDITLOG_SEARCH: 'AUDITLOG_SEARCH',
				AUDITLOG_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS',
				AUDITLOG_SEARCH_BY_REMOVE_FILTER: 'AUDITLOG_SEARCH_BY_REMOVE_FILTER',
				AUDITLOG_SEARCH_BY_RESET_FILTERS: 'AUDITLOG_SEARCH_BY_RESET_FILTERS'
			},
			betTypes: ['football', 'basketball', 'horse-racing'],
			betType: DEFAULT_BET_TYPE,
			keyword: '',
			selectedKeyword: '',
			originDateRange: {
				dateTimeFrom: getOrginDateTimeFrom(),
				dateTimeTo: getOrginDateTimeTo()
			},
			selectedFilters: getDefaultSelectedFilters(),
			isShowingMoreFilter: false,
			isClickForSearching: false,
			tableOptions: {
				defaultSortName: 'date_time',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center'
			},
			auditlogs: []
		}
	},
	componentDidMount: function () {
		let criteriaOption = this.getSearchCriterias()

		// Get Table Data
		AuditlogStore.searchAuditlogs(criteriaOption)
		AuditlogStore.addChangeListener(this.onChange)

		token = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH], () => {
			this.searchAuditlog()
		})

		document.addEventListener('click', this.pageClick, false)
	},

	componentWillUnmount: function () {
		PubSub.unsubscribe(token)

		AuditlogStore.removeChangeListener(this.onChange)
		document.removeEventListener('click', this.pageClick, false)
	},

	pageClick: function (event) {
		if (!this.state.isShowingMoreFilter || this.state.isClickForSearching) {
			this.setState({isClickForSearching: false})
			return
		}

		this.hideMoreFilter()
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
			betType: this.state.betType,
			keyword: this.state.selectedKeyword,
			filters: returnFilters
		}
	},

	getBetTypeIconClassName: function (betType) {
		return ClassNames(
		'bet-type',
		'icon-' + betType,
			{
				'active': this.state.betType === betType
			})
	},

	changeBetType: function (betType) {
		this.setState({
			betType: betType,
			keyword: '',
			selectedKeyword: '',
			selectedFilters: getDefaultSelectedFilters(),
			isShowingMoreFilter: false
		})

		PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_RESET_FILTERS])
	},

	handleKeywordChange: function (event) {
		let newKeyword = event.target.value

		this.setState({
			keyword: newKeyword
		})
	},

	handleKeywordPress: function (event) {
		if (event.key === 'Enter') {
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS])
		}
	},

	removeSearchCriteriaFilter: function (filter) {
		const callback = () => {
			this.setState({
				isShowingMoreFilter: false
			})

			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_REMOVE_FILTER], filter)
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH])
		}

		switch (filter.name) {
		case 'keyword':
			this.removeKeywordFilter(filter, callback)
			break
		case 'dateTimeFrom,dateTimeTo':
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

	removeDateRangeFilter: function (dateRange, callback) {
		let selectedFilters = this.state.selectedFilters
		let originDateRange = this.state.originDateRange

		selectedFilters.forEach((filter) => {
			if (filter.name === 'dateTimeFrom') {
				filter.value = originDateRange.dateTimeFrom
			} else if (filter.name === 'dateTimeTo') {
				filter.value = originDateRange.dateTimeTo
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

	searchAuditlog: async function () {
		this.setState({
			selectedKeyword: this.state.keyword
		}, function () {
			let criteriaOption = this.getSearchCriterias()

			// Get Table Data
			AuditlogStore.searchAuditlogs(criteriaOption)
		})
	},

	clickForSearching: function () {
		this.setState({
			isClickForSearching: true
		})
	},

	showMoreFilter: function (event) {
		this.clickForSearching()

		this.setState({
			isShowingMoreFilter: true
		})
	},

	hideMoreFilter: function () {
		this.setState({
			isShowingMoreFilter: false
		})
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
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH])
		})
	},

	checkIsDateRangeNotChanged: function (filters) {
		let originDateRange = this.state.originDateRange
		let dateTimeFrom
		let dateTimeTo

		for (var i in filters) {
			if (filters[i].name === 'dateTimeFrom') {
				dateTimeFrom = filters[i].value
			} else if (filters[i].name === 'dateTimeTo') {
				dateTimeTo = filters[i].value
			}
		}

		return (!dateTimeFrom || dateTimeFrom.isSame(originDateRange.dateTimeFrom)) &&
			(!dateTimeTo || dateTimeTo.isSame(originDateRange.dateTimeTo))
	},

	openPopup: function () {
		this.setState({ exportFormat: 'pdf' })// reset the format value
		this.state.hasData ? this.refs.exportPopup.show() : null
	},

	export: function () {
		let criteriaOption = this.getSearchCriterias()
		const filters = AuditlogStore.buildRequest(criteriaOption)

		doExport(this.state.exportFormat, filters)
	},

	onChangeFormat: function (format) {
		this.setState({ exportFormat: format })
	},

	onChange: function () {
		const hasData = AuditlogStore.auditlogs.length > 0
		this.setState({
			auditlogs: AuditlogStore.auditlogs, hasData: hasData
		})
	},

	handleChangePage: function (selectedPageNumber, sortingObject, criteriaOption) {
		AuditlogStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
	},

	handleClickSorting: function (selectedPageNumber, sortingObject, criteriaOption) {
		AuditlogStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
	},

	generateFilterBlockesJsx: function (filters) {
		const filterDisplayFormatting = (filter) => {
			return filter.name === 'keyword'
				? `${filter.name}: ${filter.value}`
				: filter.value
		}

		let isDateRangeNotChanged = this.checkIsDateRangeNotChanged(filters)
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

		let formattedDateFrom = dateFromFilter ? dateFromFilter.value.format('DD MMM YYYY HH:mm') : ''
		let formattedDateTo = dateToFilter ? dateToFilter.value.format('DD MMM YYYY HH:mm') : ''
		let dateRangeFilter = {
			name: 'dateTimeFrom,dateTimeTo',
			value: `${formattedDateFrom} - ${formattedDateTo}`
		}
		let filtersArrayWithoutDateRange = filters.filter((f) => {
			if (f.name === 'dateTimeFrom' || f.name === 'dateTimeTo') {
				return false
			}
			return true
		})

		let filtersArray = []
			.concat(this.state.selectedKeyword ? keywordFilter : [])
			.concat(isDateRangeNotChanged ? [] : [dateRangeFilter])
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
	render: function () {
		let betTypesContainerClassName = ClassNames('bet-types', {
			'hover-enabled': !this.state.isShowingMoreFilter
		})
		let betTypes = this.state.betTypes.map((betType, index) => {
			return <BetType
				key={index}
				selectedBetType={this.state.betType}
				betType={betType}
				changeBetTypeEvent={this.changeBetType}
				changeEventTopic={this.state.tokens.AUDITLOG_SEARCH} />
		})
		let filterBlockes = this.generateFilterBlockesJsx(this.state.selectedFilters)
		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})
		let activeContent

		if (this.state.betType === 'football') {
			activeContent =
				<div>
					<div className='tableComponent-container'>
						<TableComponent data={AuditlogStore.auditlogs} pagination options={this.state.tableOptions} striped keyField='id'
							tableHeaderClass='table-header' tableContainerClass='base-table' >
							<TableHeaderColumn dataField='id' autoValue hidden>ID</TableHeaderColumn>
							<TableHeaderColumn dataField='date_time' dataSort>Date/Time</TableHeaderColumn>
							<TableHeaderColumn dataField='user_id' dataSort>User ID</TableHeaderColumn>
							<TableHeaderColumn dataField='user_name' dataSort>User Name</TableHeaderColumn>
							<TableHeaderColumn dataField='Type' dataSort>Type</TableHeaderColumn>
							<TableHeaderColumn dataField='function_module' dataSort>Function/Module</TableHeaderColumn>
							<TableHeaderColumn dataField='function_event_detail' dataSort>Function Event Detail</TableHeaderColumn>
							<TableHeaderColumn dataField='user_role' dataSort>User Role</TableHeaderColumn>
							<TableHeaderColumn dataField='ip_address' dataSort>IP Address</TableHeaderColumn>
							<TableHeaderColumn dataField='backend_id' dataSort>Back End ID</TableHeaderColumn>
							<TableHeaderColumn dataField='frontend_id' dataSort>Front End ID</TableHeaderColumn>
							<TableHeaderColumn dataField='home' dataSort>Home</TableHeaderColumn>
							<TableHeaderColumn dataField='away' dataSort>Away</TableHeaderColumn>
							<TableHeaderColumn dataField='ko_time_game_start_game' dataSort>K.O. Time/ Game Start Time</TableHeaderColumn>
							<TableHeaderColumn dataField='bet_type' dataSort>Bet Type</TableHeaderColumn>
							<TableHeaderColumn dataField='event_name' dataSort>Event Name</TableHeaderColumn>
							<TableHeaderColumn dataField='error_code' dataSort>Error Code</TableHeaderColumn>
							<TableHeaderColumn dataField='error_message_content' dataSort>Error Message Content</TableHeaderColumn>
							<TableHeaderColumn dataField='device' dataSort>Device</TableHeaderColumn>
						</TableComponent>
					</div>

					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className={this.state.hasData ? 'btn btn-primary pull-right' : 'btn btn-primary disabled pull-right'} onClick={this.openPopup}>Export</button>
							<Popup hideOnOverlayClicked ref='exportPopup' title='Audit Trail Export' onConfirm={this.export} >
								<ExportPopup onChange={this.onChangeFormat} />
							</Popup>
						</div>
					</div>
				</div>
		} else {
			activeContent = <div className='nopage'>Coming Soon</div>
		}

		return (
			<div className='auditlog'>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.state.pageTitle}</p>
					<h1>Audit Trail</h1>
				</div>
				<div className='row page-content'>
					{/* Search Critiria Row */}
					<div className='col-md-12'>
						<div className='search-criteria-container'>
							<div className='search-criteria-container-row'>
								<div className={betTypesContainerClassName}>
									{betTypes}
								</div>
								<div className='keyword-container'>
									<input type='text' placeholder='Search with keywords & filters'
										value={this.state.keyword}
										onClick={this.showMoreFilter}
										onChange={this.handleKeywordChange}
										onKeyPress={this.handleKeywordPress}
										ref='keyword' />
								</div>
								<div className='filter-block-container'>
									{filterBlockes}
								</div>
							</div>
							<div className={moreFilterContianerClassName} onClick={this.clickForSearching}>
								<FilterPanel
									triggerSearchTopic={this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS}
									resetFiltersTopic={this.state.tokens.AUDITLOG_SEARCH_BY_RESET_FILTERS}
									removeOneFilterTopic={this.state.tokens.AUDITLOG_SEARCH_BY_REMOVE_FILTER}
									onSubmit={this.setFilters}>
									<FilterPanelRow>
										<FilterPanelColumn filterName='dateTimeFrom'
											filterTitle='Date Time From'
											filterValue={this.state.originDateRange.dateTimeFrom}
											ctrlType='calendar'
											isRequired
											pairingVerify={[{
												operation: '<=',
												partners: ['dateTimeTo']
											}]} />
										<FilterPanelColumn filterName='dateTimeTo'
											filterTitle='Date Time To'
											filterValue={this.state.originDateRange.dateTimeTo}
											ctrlType='calendar'
											isRequired
											pairingVerify={[{
												operation: '>=',
												partners: ['dateTimeFrom']
											}]} />
										<FilterPanelColumn filterName='typeValue' filterTitle='Type' ctrlType='select' dataSource={selectdata.typeValue} />
										<FilterPanelColumn filterName='backEndID' filterTitle='Back End ID' />
									</FilterPanelRow>
									<FilterPanelRow>
										<FilterPanelColumn filterName='frontEndID' filterTitle='Front End ID' />
										<FilterPanelColumn filterName='eventLv1' filterTitle='Event Lv1' />
										<FilterPanelColumn filterName='homeValue' filterTitle='Home' />
										<FilterPanelColumn filterName='awayValue' filterTitle='Away' />
									</FilterPanelRow>
									<FilterPanelRow>
										<FilterPanelColumn filterName='dateTimeGameStart' filterTitle='K.O Time / Game Start Time' ctrlType='calendar' />
										<FilterPanelColumn filterName='userId' filterTitle='User ID' />
										<FilterPanelColumn filterName='userRole' filterTitle='User Role' ctrlType='select' dataSource={selectdata.userRole} />
										<FilterPanelColumn filterName='systemFunc' filterTitle='System Function' ctrlType='select' dataSource={selectdata.systemFunc} />
									</FilterPanelRow>
									<FilterPanelRow>
										<FilterPanelColumn filterName='betTypeFeature' filterTitle='Bet Type / Feature' ctrlType='select' dataSource={selectdata.betTypeFeature} />
										<FilterPanelColumn filterName='device' filterTitle='Device' ctrlType='select' dataSource={selectdata.device} />
										<FilterPanelColumn filterName='ipAddress'
											filterTitle='IP Address'
											customVerification={/^((25[0-5])|(2[0-4]\d)|(1\d\d)|\d{1,2})(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|\d{1,2})){2}(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|\d{1,2}))$/} />
										<FilterPanelColumn filterName='errorCode' filterTitle='Error Code' />
									</FilterPanelRow>
								</FilterPanel>
							</div>
						</div>
					</div>
				</div>
				{/* Active Content */}
				{ activeContent }
				{/* End Active Content */}
			</div>
			)
	}
})
