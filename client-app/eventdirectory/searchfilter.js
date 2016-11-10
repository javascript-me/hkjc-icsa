import React, { PropTypes } from 'react'

export default React.createClass({
	displayName: 'SearchFilter',
	propTypes: {
		data: PropTypes.object
	},
	componentDidMount () {
		// $("#eventtype-select").multipleSelect();
	},
	render () {
		return (
			<form className='ed-filter' role='form'>
				<div className='form-group'>
					<input type='text' className='form-control' placeholder='Search' />
				</div>

				<div id='sf-advanced' className='form-group'>
					<label>Advanced Filters</label>
				</div>

				<div className='form-group'>
					<label>Event Type</label>
					<select id='eventtype-select' className='form-control'>
						{this.props.data && this.props.data.scenario.options.map((item, index) =>
							<option key={item} value={item}>{item}</option>
						)}
					</select>
				</div>

				<div className='form-group'>
					<label>Competition</label>
					<select className='form-control'>
						{this.props.data && this.props.data.competition.options.map((item, index) =>
							<option key={item} value={item}>{item}</option>
						)}
					</select>
				</div>
			</form>
			)
	}
})
