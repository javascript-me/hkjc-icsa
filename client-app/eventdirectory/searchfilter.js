import React, { PropTypes } from 'react'
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

				<div id='ed-advanced' className='form-group'>
					<label>Advanced Filters<span className='caret caret-up' /></label>
				</div>

				<div className='form-group'>
					<label>Event Type</label>
					<select ref='scenario' id='eventtype-select' className='form-control' defaultValue='Assigned'>
						{this.props.filter && this.props.filter.scenario.options.map((item, index) =>
							<option key={item} value={item}>{item}</option>
						)}
					</select>
				</div>

				<div className='form-group'>
					<label>Competition</label>
					<select ref='competition' className='form-control'>
						{this.props.filter && this.props.filter.competition.options.map((item, index) =>
							<option key={item} value={item}>{item}</option>
						)}
					</select>
				</div>
			</div>
		)
	}
})
