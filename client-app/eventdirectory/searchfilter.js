import React, { PropTypes } from 'react'

export default React.createClass({
	displayName: 'SearchFilter',
	propTypes: {
		onSearch: PropTypes.func.isRequired,
		filter: PropTypes.object
	},
	handlerKeyUp (event) {
		if (event.keyCode === 13) {
			this.props.onSearch({
				keyword: this.refs.search.value,
				scenario: this.refs.scenario.value,
				competition: this.refs.competition.value
			})
		}
	},
	render () {
		return (
			<div rel='root' className='ed-filter'>
				<div id='ed-search' className='form-group'>
					<input ref='search' type='text' className='form-control' onKeyUp={this.handlerKeyUp} placeholder='Search' />
				</div>

				<div id='ed-advanced' className='form-group'>
					<label>Advanced Filters<span className='caret' /></label>
				</div>

				<div className='form-group'>
					<label>Event Type</label>
					<select ref='scenario' id='eventtype-select' className='form-control'>
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
