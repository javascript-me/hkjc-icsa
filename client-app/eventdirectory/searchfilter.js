import React, { PropTypes } from 'react'

import MultiSelect from '../muti-select'
import Calender from '../calendar'
import classnames from 'classnames'
import _ from 'lodash'
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
				reflashFlag: true,
				searchEnquiry: {}
			}
		)
	},

	handleFilterChange (field,value) {
		let nextEnquiry = _.cloneDeep(this.state.searchEnquiry)
		nextEnquiry[field] = value
		this.setState({searchEnquiry:nextEnquiry})
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
		this.setState({searchEnquiry: {},reflashFlag: false},() => {
			console.log(this.state.searchEnquiry.dataFrom)
			this.setState({reflashFlag: true})})
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
								  noSuggestionsText="No Results"
								  onItemSelected={this.onSearchItemSelected}
								  onItemsRequested={this.onSearchItemsRequested} />
                </div>

				<div id='ed-advanced' className='form-group' onClick={this.toggleFilterShowState}>
					<label>Advanced Filters<span className={'caret ' + (this.state.showFilter? 'caret-up':'caret-down')} /></label>
					<div className="filterIcon"></div>
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
						{this.state.reflashFlag && <Calender onChange={this.getChangeHandler('dateFrom')}
						value={this.state.searchEnquiry.dataFrom}
						/>}
					</div>

					<div className='form-group'>
						<label>Kick Off Time To</label>
						{this.state.reflashFlag && <Calender onChange={this.getChangeHandler('dateTo')}
						value={this.state.searchEnquiry.dataTo}
						/>}
					</div>

					<div className="todayIcon">
						<span className="clockIcon"></span>
						<span>Today</span>
					</div>

					<div className="action-part">
						<button className="button pull-right primany">Search</button>
						<button className="button pull-right blank" onClick={this.resetEnquiry}>Reset</button>
					</div>
				</div>
				
			</div>
		)
	}
})
