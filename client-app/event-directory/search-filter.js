import React, { PropTypes } from 'react'

import MultiSelect from '../muti-select'
import Calender from '../calendar'
// import classnames from 'classnames'
import Session from '../session'
import _ from 'lodash'
import moment from 'moment'
import * as util from '../utility'

const MultiSelectEvent = util.FetchServerDataHoc({url: 'api/eventdirectory/eventType'},
(data) => ({options: (data || [])}))(MultiSelect)

const MultiSelectCompetition = util.FetchServerDataHoc({url: 'api/eventdirectory/competition'},
		(data) => ({options: (data || [])}))(MultiSelect)

import AutoComplete from '../autocomplete'
import EventDirectoryService from './event-directory-service'

async function doSearch (searchFn, searchEnquiry) {
	return await searchFn({
		keyword: searchEnquiry.keyword,
		eventType: searchEnquiry.eventType,
		competition: searchEnquiry.competition,
		from: searchEnquiry.dateFrom,
		to: searchEnquiry.dateTo
	})
}

export default React.createClass({
	displayName: 'SearchFilter',
	propTypes: {
		onSearch: PropTypes.func
	},

	async onSearchItemsRequested (text) {
		if (!text) return []

		if (!this.items) {
			this.items = await EventDirectoryService.getFootballAutosuggestions()
			this.items.sort((a, b) => a.localeCompare(b)) // in asc
			this.items = this.items.map((text, value) => ({text, value}))
		}

		text = text.toLowerCase()
		return this.items.filter(i => i.text.toLowerCase().indexOf(text) === 0)
	},

	getInitialState () {
		return (
			{
				showFilter: false,
				hasFilter: false,
				searchEnquiry: {},
				searchValidationFalse: []
			}
		)
	},

	handleFilterChange (field, value) {
		let nextEnquiry = _.cloneDeep(this.state.searchEnquiry)
		if (!value || (Array.isArray(value) && !value.length)) {
			delete nextEnquiry[field]
		} else {
			nextEnquiry[field] = value
		}
		this.setState({
			searchEnquiry: nextEnquiry,
			hasFilter: Object.keys(nextEnquiry).length > 0
		})
	},

	handleKeywordChange (value) {
		this.handleFilterChange('keyword', value)
	},

	getChangeHandler (field) {
		return (value) => {
			this.handleFilterChange(field, value)
		}
	},

	toggleFilterShowState () {
		this.setState({showFilter: !this.state.showFilter})
	},

	searchValidation () {
		let { dateFrom, dateTo } = this.state.searchEnquiry
		if ((!dateFrom && !dateTo) || (dateFrom && dateTo && moment.max(dateFrom, dateTo) === dateTo)) {
			this.setState({searchValidationFalse: []})
			return true
		} else {
			this.setState({searchValidationFalse: ['dateTo', 'dateFrom']})
			return false
		}
	},

	resetEnquiry () {
		this.setState({searchEnquiry: {}, hasFilter: false, searchValidationFalse: []})
		Session.setItem(Session.VALUES.ED_SEARCH_FILTER, null)
	},

	getSearchEnquiry () {
		let resultEnquiry = {
			eventType: '',
			competition: ''
		}
		let searchEnquiry = this.state.searchEnquiry
		searchEnquiry.dateFrom && (resultEnquiry.dateFrom = searchEnquiry.dateFrom.format('DD MMM YYYY HH:mm'))
		searchEnquiry.dateTo && (resultEnquiry.dateTo = searchEnquiry.dateTo.format('DD MMM YYYY HH:mm'))
		if (searchEnquiry.eventType && searchEnquiry.eventType.length) {
			resultEnquiry.eventType = searchEnquiry.eventType.map(item => item.value).join(',')
		}
		if (searchEnquiry.competition && searchEnquiry.competition.length) {
			resultEnquiry.competition = searchEnquiry.competition.map(item => item.value).join(',')
		}
		resultEnquiry.keyword = this.refs.autoSuggestion.getValue()
		return resultEnquiry
	},

	async componentDidMount () {
		let sessionState = Session.getItem(Session.VALUES.ED_SEARCH_FILTER)
		if (!sessionState) return

		let searchEnquiry = _.cloneDeep(sessionState.searchEnquiry)
		await doSearch(this.props.onSearch, searchEnquiry)

		// restore search state
		if (searchEnquiry.dateFrom) searchEnquiry.dateFrom = moment(searchEnquiry.dateFrom)
		if (searchEnquiry.dateTo) searchEnquiry.dateTo = moment(searchEnquiry.dateTo)
		if (searchEnquiry.competition) searchEnquiry.competition = searchEnquiry.competition.split(',').map(i => ({label: i, value: i}))
		if (searchEnquiry.eventType) searchEnquiry.eventType = searchEnquiry.eventType.split(',').map(i => ({label: i, value: i}))
		this.setState({
			showFilter: sessionState.showFilter,
			hasFilter: sessionState.hasFilter,
			searchEnquiry: searchEnquiry
		})
	},

	async onSearch () {
		const resultEnquiry = this.getSearchEnquiry()
		if (this.searchValidation()) {
			await doSearch(this.props.onSearch, resultEnquiry)
			Session.setItem(Session.VALUES.ED_SEARCH_FILTER, {
				showFilter: this.state.showFilter,
				hasFilter: this.state.hasFilter,
				searchEnquiry: resultEnquiry
			})
		}
	},

	setToday () {
		let todayStart = new Date()
		let todayEnd = new Date()
		todayStart.setHours(0)
		todayStart.setMinutes(0)
		todayEnd.setHours(23)
		todayEnd.setMinutes(59)
		let nextEnquiry = _.cloneDeep(this.state.searchEnquiry)
		nextEnquiry.dateFrom = moment(todayStart)
		nextEnquiry.dateTo = moment(todayEnd)
		this.setState({searchEnquiry: nextEnquiry, hasFilter: true})
	},

	render () {
		return (
			<div rel='root' className='ed-filter'>
				<div id='ed-search' className='form-group' onClick={() => { this.setState({showFilter: true}) }}>
					<AutoComplete displayName='AutoComplete'
						className='form-control search-input'
						itemClassName='search-autocomplete-item'
						placeholder='Search'
						maxResults={6}
						value={this.state.searchEnquiry.keyword}
						onEnter={this.onSearch}
						onChange={this.handleKeywordChange}
						noSuggestionsText='No Results'
						onItemsRequested={this.onSearchItemsRequested}

						ref='autoSuggestion' />

				</div>

				<div id='ed-advanced' className='form-group' onClick={this.toggleFilterShowState}>
					<label>Advanced Filters<span className={'caret ' + (this.state.showFilter ? 'caret-up' : 'caret-down')} /></label>
					<div className='filterIcon' style={{display: this.state.hasFilter ? 'block' : 'none'}} />
				</div>

				<div style={{display: this.state.showFilter ? 'block' : 'none'}}>

					<div className='form-group'>
						<label>Event Type</label>
						<MultiSelectEvent style={{width: '200px'}} placeHolder='Select Event'
							onChange={this.getChangeHandler('eventType')}
							selectedOptions={this.state.searchEnquiry.eventType}
						/>
					</div>

					<div className='form-group'>
						<label>Competition</label>
						<MultiSelectCompetition style={{width: '200px'}} placeHolder='Select Competition'
							onChange={this.getChangeHandler('competition')}
							selectedOptions={this.state.searchEnquiry.competition}
						/>
					</div>

					<div className='form-group'>
						<label>Kick Off Time From</label>
						<Calender onChange={this.getChangeHandler('dateFrom')}
							warning={this.state.searchValidationFalse.indexOf('dateFrom') > -1}
							value={this.state.searchEnquiry.dateFrom}
						/>
					</div>

					<div className='form-group'>
						<label>Kick Off Time To</label>
						<Calender onChange={this.getChangeHandler('dateTo')}
							warning={this.state.searchValidationFalse.indexOf('dateFrom') > -1}
							value={this.state.searchEnquiry.dateTo}
						/>
					</div>

					<div className='todayIcon' onClick={this.setToday}>
						<span className='clockIcon' />
						<span>Today</span>
					</div>

					<div className='action-part'>
						<button className='button pull-right primany' onClick={this.onSearch}>Search</button>
						<button className='button pull-right blank' onClick={this.resetEnquiry}>Reset</button>
					</div>
				</div>

			</div>
		)
	}
})
