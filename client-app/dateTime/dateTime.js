import React from 'react'

export default class DateTime extends React.Component {
	render () {
		return <div className='form-group has-feedback date-time-compontent'>
			<input type='text' htmlFor={this.props.inputFor} className='form-control' placeholder='Select Time' value={this.props.dateTime} onChange={this.props.handleVal} />
			<span className='icon icon-date form-control-feedback' />
		</div>
	}
}

DateTime.propTypes = {
	inputFor: React.PropTypes.string,
	dateTime: React.PropTypes.string,
	handleVal: React.PropTypes.func
}
