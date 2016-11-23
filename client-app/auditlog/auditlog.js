import React from 'react'
import Moment from 'moment'
import Calendar from 'rc-calendar'
import ClassNames from 'classnames'
import PubSub from '../pubsub'
import BetType from './betType'
import FilterBlock from './filterBlock'
import SearchEnquiryPanel from '../searchEnquiryPanel/searchEnquiryPanel'
import Paging from '../paging/paging'
import Popup from '../popup'
import ExportPopup from '../exportPopup'
import TabularData from '../tabulardata/tabulardata'
import AuditlogStore from './auditlog-store'
import ExportService from './export-service'

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

	headers: [
		{'id': 1, label: 'Date/Time', fieldName: 'date_time', sortingClass: 'down-arrow', addCheckBox: false},
		{'id': 2, label: 'User ID', fieldName: 'user_id', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 3, label: 'User Name', fieldName: 'user_name', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 4, label: 'Type', fieldName: 'Type', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 5, label: 'Function/Module', fieldName: 'function_module', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 6, label: 'Function Event Detail', fieldName: 'function_event_detail', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 7, label: 'User Role', fieldName: 'user_role', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 8, label: 'IP Address', fieldName: 'ip_address', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 9, label: 'Back End ID', fieldName: 'backend_id', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 10, label: 'Front End ID', fieldName: 'frontend_id', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 11, label: 'Home', fieldName: 'home', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 12, label: 'Away', fieldName: 'away', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 13, label: 'K.O. Time/ Game Start Time', fieldName: 'ko_time_game_start_game', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 14, label: 'Bet Type', fieldName: 'bet_type', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 15, label: 'Event Name', fieldName: 'event_name', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 16, label: 'Error Code', fieldName: 'error_code', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 17, label: 'Error Message Content', fieldName: 'error_message_content', sortingClass: 'no-arrow', addCheckBox: false},
		{'id': 18, label: 'Device', fieldName: 'device', sortingClass: 'no-arrow', addCheckBox: false}
	],

	getInitialState () {
		let originDateTimeFrom = getOrginDateTimeFrom()
		let originDateTimeTo = getOrginDateTimeTo()

		return {
			pageTitle: 'Home \\ Global Tools & Adminstration \\ Audit Trail',
			data: [],
			filters: [],
			hasData: false,
			exportFormat: 'pdf',
			tokens: {
				AUDITLOG_SEARCH: 'AUDITLOG_SEARCH',
				AUDITLOG_SEARCH_BY_KEY_PRESS: 'AUDITLOG_SEARCH_BY_KEY_PRESS',
				AUDITLOG_SEARCH_BY_REMOVE_FILTER: 'AUDITLOG_SEARCH_BY_REMOVE_FILTER'
			},
			betTypes: ['football', 'basketball', 'horse-racing'],
			betType: DEFAULT_BET_TYPE,
			keyword: '',
			originDateRange: {
				dateTimeFrom: originDateTimeFrom,
				dateTimeTo: originDateTimeTo
			},
			selectedFilters: [{
				name: 'dateTimeFrom',
				value: originDateTimeFrom
			}, {
				name: 'dateTimeTo',
				value: originDateTimeTo
			}],
			isShowingMoreFilter: false,
			isClickForSearching: false,
			auditlogs: []
		}
	},
	componentDidMount: function () {
		let sortingObject = {fieldName: 'date_time', order: 'DESCEND'}
		let criteriaOption = this.getSearchCriterias()

		// Get Table Data
		AuditlogStore.searchAuditlogs(1, sortingObject, criteriaOption)
		AuditlogStore.addChangeListener(this.onChange)

		token = PubSub.subscribe(PubSub[this.state.tokens.AUDITLOG_SEARCH], () => {
			this.searchAuditlog()
		})

		document.addEventListener('click', this.pageClick, false)
	},

	componentWillUnmount: function () {
		PubSub.unsubscribe(token)

		AuditlogStore.removeChangeListener(this.onChange.bind(this))
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
		return {
			betType: this.state.betType,
			keyword: this.state.keyword,
			filters: this.state.selectedFilters
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
			selectedFilters: [],
			isShowingMoreFilter: false
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
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_KEY_PRESS])
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
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH_BY_REMOVE_FILTER], filter)
			PubSub.publish(PubSub[this.state.tokens.AUDITLOG_SEARCH])
		})
	},

	searchAuditlog: async function () {
		let criteriaOption = this.getSearchCriterias()

		// Get Table Data
		AuditlogStore.searchAuditlogs(1, null, criteriaOption)
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

	checkIsDateRangeChanged: function () {
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

	// function to mock the event of loading data from the table
	mockLoadData: function () {
		this.setState({hasData: true})
	},

	openPopup () {
		this.setState({ exportFormat: 'pdf' })// reset the format value
		this.state.hasData ? this.refs.exportPopup.show() : null
	},

	export () {
		let criteriaOption = this.getSearchCriterias()
		const filters = AuditlogStore.buildRequest(1, null, criteriaOption)

		doExport(this.state.exportFormat, filters)
	},

	onChangeFormat (format) {
		this.setState({ exportFormat: format })
	},

	onChange () {
		const hasData = AuditlogStore.auditlogs.length > 0
		this.setState({
			auditlogs: AuditlogStore.auditlogs, hasData: hasData
		})
	},

	handleChangePage (selectedPageNumber, sortingObject, criteriaOption) {
		AuditlogStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
	},

	handleClickSorting  (selectedPageNumber, sortingObject, criteriaOption) {
		AuditlogStore.searchAuditlogs(selectedPageNumber, sortingObject, criteriaOption)
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
		let isDateRangeChanged = this.checkIsDateRangeChanged()

		let filterBlockes = this.state.selectedFilters.filter((f) => {
			if ((f.name === 'dateTimeFrom' || f.name === 'dateTimeTo') && isDateRangeChanged) {
				return false
			}
			return true
		}).map((f, index) => {
			return <FilterBlock
				key={index}
				filter={f}
				removeEvent={this.removeSearchCriteriaFilter}
				removeEventTopic={this.state.tokens.AUDITLOG_SEARCH} />
		})

		let moreFilterContianerClassName = ClassNames('more-filter-popup', {
			'active': this.state.isShowingMoreFilter
		})
		let activeContent

		if (this.state.betType === 'football') {
			activeContent = <div>
				<div className='table-container '>
					<TabularData displayCheckBox={false} headers={this.headers} dataCollection={AuditlogStore.auditlogs} onClickSorting={this.handleClickSorting} />
				</div>
				<div className='col-md-12 vertical-gap'>
					<Paging pageData={AuditlogStore.pageData} onChangePage={this.handleChangePage} />
					{/* START FOOTER EXPORT */}
					<div className='col-md-4'>
						<div className='pull-right'>
							<button className={this.state.hasData ? 'btn btn-primary pull-right' : 'btn btn-primary disabled pull-right'} onClick={this.openPopup}>Export</button>
							<Popup hideOnOverlayClicked ref='exportPopup' title='Audit Trail Export' onConfirm={this.export} >
								<ExportPopup onChange={this.onChangeFormat} />
							</Popup>
						</div>
					</div>
				</div>
				{/* END FOOTER EXPORT */}
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
					<div className='col-md-6'>
						<Calendar className='hidden' />
					</div>
					{/* Search Critiria Row */}
					<div className='col-md-12'>
						<div className='search-criteria-container'>
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
							<div className={moreFilterContianerClassName} onClick={this.clickForSearching}>
								<SearchEnquiryPanel setFilterEvent={this.setFilters} />
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
