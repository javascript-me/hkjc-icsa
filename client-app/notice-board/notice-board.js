import React from 'react'
import ExportService from '../auditlog/export-service'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import NoticeboardService from './noticeboard-service'
import {TableHeaderColumn, TableComponent} from '../table'
import PubSub from '../pubsub'
import Moment from 'moment'
import ClassNames from 'classnames'
import FilterPanel from '../filter-panel'
import FilterPanelRow from '../filter-panel/filter-panel-row'
import FilterPanelColumn from '../filter-panel/filter-panel-column'
import FilterBlock from '../filter-block'

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
const getDefaultSelectedFilters = () => {
	return [{
		name: 'dateTimeFrom',
		value: getOrginDateTimeFrom()
	}, {
		name: 'dateTimeTo',
		value: getOrginDateTimeTo()
	}]
}
let token = null
const doExport = async(format, filters) => {
	const file = ExportService.getNoticeboardFileURL(format, filters)
	if (file) {
		window.open(file, '_blank')
	}
}
export default React.createClass({
	propTypes: {
		someThing: React.PropTypes.bool
	},
	getInitialState () {
		let originDateTimeFrom = getOrginDateTimeFrom()
		let originDateTimeTo = getOrginDateTimeTo()
		return {
			data: [],
			pageTitle: 'Home \\ Global Tools & Adminstration \\ Communication ',
			exportFormat: 'pdf',
			keyword: '',
			selectedKeyword: '',
			isShowingMoreFilter: false,
			isClickForSearching: false,
			tokens: {
				NOTICEBOARD_SEARCH_BY_KEY_PRESS: 'NOTICEBOARD_SEARCH_BY_KEY_PRESS',
				NOTICEBOARD_SEARCH: 'NOTICEBOARD_SEARCH',
				NOTICEBOARD_SEARCH_BY_REMOVE_FILTER: 'NOTICEBOARD_SEARCH_BY_REMOVE_FILTER',
				NOTICEBOARD_SEARCH_BY_RESET_FILTERS: 'NOTICEBOARD_SEARCH_BY_RESET_FILTERS'
			},
			originDateRange: {
				dateTimeFrom: getOrginDateTimeFrom(),
				dateTimeTo: getOrginDateTimeTo()
			},
			selectedFilters: getDefaultSelectedFilters(),
			tableOptions: {
				defaultSortName: 'priority',  // default sort column name
				defaultSortOrder: 'desc', // default sort order
				hideSizePerPage: true,
				paginationClassContainer: 'text-center'
			},
			noticesList: [],
			categoriesList: [],
			competitionsList: [],
			continentsList: [],
			countriesList: [],
			inplaysList: [],
			matchesList: [],
			prioritiesList: [],
			sportsList: [],
			statusesList: []
		}
	},
	componentDidMount: function async() {
		let criteriaOption = this.getSearchCriterias()
		NoticeboardService.filterNoticeBoardTableData(criteriaOption)
		NoticeboardService.addChangeListener(this.onChange)
		/*All dropdownas data*/
		NoticeboardService.getAllCategories()
		NoticeboardService.getAllCompetitions()
		NoticeboardService.getAllContinents()
		NoticeboardService.getAllCountries()
		NoticeboardService.getAllInplays()
		NoticeboardService.getAllMatches()
		NoticeboardService.getAllPriorities()
		NoticeboardService.getAllSports()
		NoticeboardService.getAllStatuses()
		NoticeboardService.addChangeListener(this.onChange)
		token = PubSub.subscribe(PubSub[this.state.tokens.NOTICEBOARD_SEARCH], () => {
			this.searchNoticeboard()
		})
		document.addEventListener('click', this.pageClick, false)
	},
	searchNoticeboard: async function () {
		this.setState({
			selectedKeyword: this.state.keyword
		}, function () {
			let criteriaOption = this.getSearchCriterias()
			// Get Table Data
			NoticeboardService.filterNoticeBoardTableData(criteriaOption)
		})
	},
	getSearchCriterias: function () {
		return {
			keyword: this.state.selectedKeyword,
			filters: this.state.selectedFilters
		}
	},
	pageClick: function (event) {
		if (!this.state.isShowingMoreFilter || this.state.isClickForSearching) {
			this.setState({isClickForSearching: false})
			return
		}
		this.hideMoreFilter()
	},
	componentWillUnmount: function () {
		NoticeboardService.removeChangeListener(this.onChange.bind(this))
		document.removeEventListener('click', this.pageClick, false)
	},
	onChange () {
		this.setState({noticesList: NoticeboardService.noticesList})
	},
	openPopup () {
		this.setState({exportFormat: 'pdf'})// reset the format value
		this.refs.exportPopup.show()
	},
	export () {
		const filters = {
			username: "allgood",
			selectedPageNumber: 1,
			sortingObjectFieldName: "date_time",
			sortingObjectOrder: "DESCEND",
			betType: "football",
			keyword: "",
			dateTimeFrom: "09 Oct 2016 00:00",
			dateTimeTo: "08 Dec 2016 23:59"
		}
		doExport(this.state.exportFormat, filters)
	},
	onChangeFormat (format) {
		this.setState({exportFormat: format})
	},
	showMoreFilter: function (event) {
		this.clickForSearching()

		this.setState({
			isShowingMoreFilter: true
		})
	},
	clickForSearching: function () {
		this.setState({
			isClickForSearching: true
		})
	},
	handleKeywordChange: function (event) {
		var newKeyword = event.target.value

		this.setState({
			keyword: newKeyword
		})
	},
	generateFilterBlockesJsx: function (filters) {
		const filterDisplayFormatting = (filter) => {
			return filter.name === 'keyword'
				? `${filter.name}: ${filter.value}`
				: filter.value
		}

		let isDateRangeNotChanged = this.checkIsDateRangeNotChanged()
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
		let dateRangeFilter = {
			name: 'dateTimeFrom,dateTimeTo',
			value: `${dateFromFilter.value} - ${dateToFilter.value}`
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
					removeEvent={this.removeSearchCriteriaFilter}/>
			}) || []

		return filterBlockes
	},
	removeSearchCriteriaFilter: function (filter) {
		const callback = () => {
			this.setState({
				isShowingMoreFilter: false
			})
			PubSub.publish(PubSub[this.state.tokens.NOTICEBOARD_SEARCH_BY_REMOVE_FILTER], filter)
			PubSub.publish(PubSub[this.state.tokens.NOTICEBOARD_SEARCH])
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
	removeNormalFilter: function (filter, callback) {
		let selectedFilters = this.state.selectedFilters
		let filterIndex = selectedFilters.indexOf(filter)
		selectedFilters.splice(filterIndex, 1)
		this.setState({
			selectedFilters: selectedFilters
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
	removeKeywordFilter: function (keyword, callback) {
		this.setState({
			keyword: '',
			selectedKeyword: ''
		}, callback)
	},
	checkIsDateRangeNotChanged: function () {
		let filters = this.state.selectedFilters
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
		return dateTimeFrom === originDateRange.dateTimeFrom && dateTimeTo === originDateRange.dateTimeTo
	},
	handleKeywordPress: function (event) {
		if (event.key === 'Enter') {
			PubSub.publish(PubSub[this.state.tokens.NOTICEBOARD_SEARCH_BY_KEY_PRESS])
		}
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
			PubSub.publish(PubSub[this.state.tokens.NOTICEBOARD_SEARCH])
		})
	},
	statusFormatter(cell, row) {
		if (cell === 'Acknowledged')  return '<img src="notice-board/Tick.svg" />'
		return '<img src="notice-board/Mail.svg" />'
	},
	priorityFormatter(cell, row) {
		if (cell === 'Critical') return '<img src="notice-board/Critical.svg" />'
		if (cell === 'High') return '<img src="notice-board/High.svg" />'
		if (cell === 'Medium') return '<img src="notice-board/Medium.svg" />'
		if (cell === 'Low') return '<img src="notice-board/Low.svg" />'
	},
	detailFormatter(cell, row){
		if (row.priority === 'Critical') return <span className='critical-message-detail'>{cell}</span>
		return cell
	},

	render () {
		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})
		let filterBlockes = this.generateFilterBlockesJsx(this.state.selectedFilters)
		return (

			<div className='conatainer-alert '>
				<div className='row page-header'>
					<p className='hkjc-breadcrumb'>{this.state.pageTitle}</p>
					<h1>Noticeboard Monitor</h1>
				</div>
				<div className='row page-content'>
					{/* Search Critiria Row */}
					<div className='col-md-12'>
						<div className='search-criteria-container'>
							<div className='search-criteria-container-row'>
								<div className='keyword-container'>
									<input type='text' placeholder='Search with keywords & filters'
										   value={this.state.keyword}
										   onClick={this.showMoreFilter}
										   onChange={this.handleKeywordChange}
										   onKeyPress={this.handleKeywordPress}
										   ref='keyword'/>
								</div>
								<div className='filter-block-container'>
									{filterBlockes}
								</div>
							</div>
							<div className={moreFilterContianerClassName} onClick={this.clickForSearching}>
								<FilterPanel triggerSearchTopic={this.state.tokens.NOTICEBOARD_SEARCH_BY_KEY_PRESS}
											 resetFiltersTopic={this.state.tokens.NOTICEBOARD_SEARCH_BY_RESET_FILTERS}
											 removeOneFilterTopic={this.state.tokens.NOTICEBOARD_SEARCH_BY_REMOVE_FILTER}
											 onSubmit={this.setFilters}>
									<FilterPanelRow>
										<FilterPanelColumn filterName="priority" filterTitle="Priority"
														   ctrlType="multi-select"
														   dataSource={NoticeboardService.prioritiesList}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName='dateTimeFrom'
														   filterTitle='Distribution Date & Time From'
														   filterValue={this.state.originDateRange.dateTimeFrom}
														   ctrlType='calendar'
														   isRequired
														   pairingVerify={[{
															   operation: '<=',
															   partners: ['dateTimeTo']
														   }]}/>
										<FilterPanelColumn filterName='dateTimeTo'
														   filterTitle='Distribution Date & Time To'
														   filterValue={this.state.originDateRange.dateTimeTo}
														   ctrlType='calendar'
														   isRequired
														   pairingVerify={[{
															   operation: '>=',
															   partners: ['dateTimeFrom']
														   }]}/>

										<FilterPanelColumn filterName="sportsType" filterTitle="Sports Type"
														   ctrlType="multi-select" dataSource={NoticeboardService.sportsList}>
										</FilterPanelColumn>
									</FilterPanelRow>
									<FilterPanelRow>
										<FilterPanelColumn filterName="competition" filterTitle="Competition"
														   ctrlType="multi-select"
														   dataSource={NoticeboardService.competitionsList}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="match" filterTitle="Match (Race for HR)"
														   ctrlType="multi-select"
														   dataSource={NoticeboardService.matchesList}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="inPlay" filterTitle="In-Play" ctrlType="multi-select"
														   dataSource={NoticeboardService.inplaysList}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="continent" filterTitle="Continent"
														   ctrlType="multi-select"
														   dataSource={NoticeboardService.continentsList}>
										</FilterPanelColumn>
									</FilterPanelRow>
									<FilterPanelRow>
										<FilterPanelColumn filterName="country" filterTitle="Country" ctrlType="multi-select"
														   dataSource={NoticeboardService.countriesList}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="messageCategory" filterTitle="Category"
														   ctrlType="multi-select"
														   dataSource={NoticeboardService.categoriesList}>
										</FilterPanelColumn>
										<FilterPanelColumn filterName="alertStatus" filterTitle="Alert Status"
														   ctrlType="multi-select"
														   dataSource={NoticeboardService.statusesList}>
										</FilterPanelColumn>
									</FilterPanelRow>

								</FilterPanel>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className='tableComponent-container'>
						<TableComponent data={ NoticeboardService.noticesList } pagination={true}
										options={this.state.tableOptions}
										striped={true} keyField='id' tableHeaderClass="table-header"
										tableContainerClass='base-table'>
							<TableHeaderColumn dataField='id' autoValue hidden>ID</TableHeaderColumn>
							<TableHeaderColumn dataField='priority' dataSort={true}
											   dataFormat={ this.priorityFormatter }>Priority</TableHeaderColumn>
							<TableHeaderColumn dataField='system_distribution_time' dataSort={true}> Distribution Date &
								Time</TableHeaderColumn>
							<TableHeaderColumn dataField='alert_status' dataSort={true}
											   dataFormat={ this.statusFormatter }>Status</TableHeaderColumn>
							<TableHeaderColumn dataField='message_category' dataSort={true}>Category</TableHeaderColumn>
							<TableHeaderColumn dataField='alert_name' dataSort={true}>Name</TableHeaderColumn>
							<TableHeaderColumn dataField='message_detail' dataSort={true}
											   dataFormat={ this.detailFormatter }>Detail</TableHeaderColumn>
							<TableHeaderColumn dataField='recipient' dataSort={true}>Recipient</TableHeaderColumn>
						</TableComponent>
					</div>
					<div className='vertical-gap'>
						<div className='pull-right'>
							<button className='btn btn-primary pull-right' onClick={this.openPopup}>Export</button>
							<Popup hideOnOverlayClicked ref='exportPopup' title='Noticeboard Export'
								   onConfirm={this.export}>
								<ExportPopup onChange={this.onChangeFormat}/>
							</Popup>
						</div>
					</div>
				</div>
			</div>

		)
	}
})
