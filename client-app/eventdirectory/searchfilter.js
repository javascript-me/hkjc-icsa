import React, { PropTypes } from 'react'
import MultiSelect from '../muti-select'
import Calender from '../calendar'
import * as util from '../utility'

const MultiSelect_Event = util.FetchServerDataHoc({url:'api/eventdirectory/eventType'},
(data) => ({options:(data || [])}))(MultiSelect)

const mapDataToOption = (data) => {
	data = data || []
	let options = data.map((item) => ({label:item.value,value:item.id}))
	return { options }
}

const MultiSelect_Competition = util.FetchServerDataHoc({url:'api/eventdirectory/eventType'},mapDataToOption)(MultiSelect)

export default React.createClass({
	displayName: 'SearchFilter',
	propTypes: {
		onSearch: PropTypes.func.isRequired,
		filter: PropTypes.object
	},
	handlerKeyUp (event) {
		if (event.keyCode === 13) {
			this.props.onSearch({
				keyword: this.refs.search ? this.refs.search.value : '',
				scenario: this.refs.scenario ? this.refs.scenario.value : '',
				competition: this.refs.competition ? this.refs.competition.value : ''
			})
		}
	},

	getInitialState () {
		return (
			{
				showFilter: false
			}
		)
	},

	toggleFilterShowState () {
		this.setState({showFilter: !this.state.showFilter})
	},

	render () {
		return (
			<div rel='root' className='ed-filter'>
				<div id='ed-search' className='form-group'>
					<input id='ed-filter-keyword' ref='search' type='text' className='form-control' onKeyUp={this.handlerKeyUp} placeholder='Search' />
				</div>

				<div id='ed-advanced' className='form-group' onClick={this.toggleFilterShowState}>
					<label>Advanced Filters<span className='caret caret-up' /></label>
					<div className="filterIcon"></div>
				</div>

				

				<div style={{display:this.state.showFilter? 'block' : 'none'}}>
					
					<div className='form-group'>
						<label>Event Type</label>
						<MultiSelect_Event style={{width:'200px'}} placeHolder="Select Event"/>
					</div>

					<div className='form-group'>
						<label>Competition</label>
						<MultiSelect_Competition style={{width:'200px'}} placeHolder="Select Competition"/>
					</div>

					<div className='form-group'>
						<label>Kick Off Time From</label>
						<Calender />
					</div>

					<div className='form-group'>
						<label>Kick Off Time To</label>
						<Calender />
					</div>

					<div className="todayIcon">
						<span className="clockIcon"></span>
						<span>Today</span>
					</div>

					<div className="action-part">
						<button className="button pull-right primany">Search</button>
						<button className="button pull-right blank">Reset</button>
					</div>
				</div>
				
			</div>
		)
	}
})
