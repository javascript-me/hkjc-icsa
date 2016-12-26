import React, { PropTypes } from 'react'

import MultiSelect from '../muti-select'
import Calender from '../calendar'
import classnames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import * as util from '../utility'

const MultiSelect_Event = util.FetchServerDataHoc({url:'api/eventdirectory/eventType'},
(data) => ({options:(data || [])}))(MultiSelect)

const mapDataToOption = (data) => {
	data = data || []
	let options = data.map((item) => ({label:item.value,value:item.id}))
	return { options }
}

const MultiSelect_Competition = util.FetchServerDataHoc({url:'api/eventdirectory/competition'},mapDataToOption)(MultiSelect)

import AutoComplete from '../autocomplete'
import EventDirectoryService from './eventdirectory-service'


export default React.createClass({
	displayName: 'SearchFilter',
	propTypes: {
		filter: PropTypes.object
	},
	onSearchItemSelected(item) {
		this.selectedItem = item;
	},
	async onSearchItemsRequested(text) {
		if (!text) return [];

		if (!this.items) {
			this.items = await EventDirectoryService.getFootballAutosuggestions();
			this.items.sort((a,b) => a.localeCompare(b)); // in asc
			this.items = this.items.map((text, value) => ({text, value}));
		}

		text = text.toLowerCase();
		return this.items.filter(i => i.text.toLowerCase().indexOf(text) === 0);
	},

	getInitialState () {
		return (
			{
				showFilter: false,
				hasFilter: false,
				searchEnquiry: {}
			}
		)
	},

	handleFilterChange (field,value) {
		let nextEnquiry = _.cloneDeep(this.state.searchEnquiry)
		nextEnquiry[field] = value
		this.setState({searchEnquiry:nextEnquiry,hasFilter:true})
	},

	getChangeHandler (field) {
		return (value) => {
			this.handleFilterChange(field,value)
		} 
	},

	toggleFilterShowState () {
		this.setState({showFilter: !this.state.showFilter})
	},

	resetEnquiry () {
		this.setState({searchEnquiry: {},hasFilter:false})
	},

	getSearchEnquiry () {
		let resultEnquiry = {}
		let searchEnquiry = this.state.searchEnquiry
		searchEnquiry.dateFrom && (resultEnquiry.dateFrom = searchEnquiry.dateFrom.format('DD MMM YYYY HH:mm'))
		searchEnquiry.dateTo && (resultEnquiry.dateFrom = searchEnquiry.dateTo.format('DD MMM YYYY HH:mm'))
		if (searchEnquiry.eventType && searchEnquiry.eventType.length) {
			resultEnquiry.eventType = searchEnquiry.eventType.map(item => item.value)
		}
		if (searchEnquiry.competition && searchEnquiry.competition.length) {
			resultEnquiry.competition = searchEnquiry.competition.map(item => item.value)
		}
		resultEnquiry.keyword = this.refs.autoSuggestion.getValue()
		return resultEnquiry

	},

	onSearch () {
		const resultEnquiry = this.getSearchEnquiry()
		console.log(resultEnquiry)
	},

	setToday () {
		let todayStart = new Date()
		let todayEnd = new Date()
		todayStart.setHours(0)
		todayStart.setMinutes(0)
		todayEnd.setHours(23)
		todayEnd.setMinutes(59)
		let nextEnquiry = _.cloneDeep(this.state.searchEnquiry)
		nextEnquiry.dateFrom = moment(todayStart).format('DD MMM YYYY HH:mm')
		nextEnquiry.dateTo = moment(todayEnd).format('DD MMM YYYY HH:mm')
		this.setState({searchEnquiry:nextEnquiry,hasFilter:true})
	},

	render () {
		return (
			<div rel='root' className='ed-filter'>
                <div id='ed-search' className='form-group'>
                    <AutoComplete displayName="AutoComplete"
						          className="form-control search-input"
								  itemClassName="search-autocomplete-item"
								  placeholder="Search"
								  maxResults={6}
								  onChange={this.handleKeywordChange}
								  noSuggestionsText="No Results"
								  onItemSelected={this.onSearchItemSelected}
								  onItemsRequested={this.onSearchItemsRequested} ref="autoSuggestion"/>
                </div>

				<div id='ed-advanced' className='form-group' onClick={this.toggleFilterShowState}>
					<label>Advanced Filters<span className={'caret ' + (this.state.showFilter? 'caret-up':'caret-down')} /></label>
					<div className="filterIcon" style={{display:this.state.hasFilter?'block':'none'}}></div>
				</div>

				

				<div style={{display:this.state.showFilter? 'block' : 'none'}}>
					
					<div className='form-group'>
						<label>Event Type</label>
						<MultiSelect_Event style={{width:'200px'}} placeHolder="Select Event" 
						onChange={this.getChangeHandler('eventType')}
						selectedOptions={this.state.searchEnquiry.eventType}
						/>
					</div>

					<div className='form-group'>
						<label>Competition</label>
						<MultiSelect_Competition style={{width:'200px'}} placeHolder="Select Competition"  
						onChange={this.getChangeHandler('competition')}
						selectedOptions={this.state.searchEnquiry.competition}
						/>
					</div>

					<div className='form-group'>
						<label>Kick Off Time From</label>
						<Calender onChange={this.getChangeHandler('dateFrom')}
						value={this.state.searchEnquiry.dateFrom}
						/>
					</div>

					<div className='form-group'>
						<label>Kick Off Time To</label>
						<Calender onChange={this.getChangeHandler('dateTo')}
						value={this.state.searchEnquiry.dateTo}
						/>
					</div>

					<div className="todayIcon" onClick={this.setToday}>
						<span className="clockIcon"></span>
						<span>Today</span>
					</div>

					<div className="action-part">
						<button className="button pull-right primany" onClick={this.onSearch}>Search</button>
						<button className="button pull-right blank" onClick={this.resetEnquiry}>Reset</button>
					</div>
				</div>
				
			</div>
		)
	}
})
