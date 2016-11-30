import React from 'react'

export default class FilterBlock extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
		}

		this.removeHandler = this.removeHandler.bind(this)
	}

	removeHandler () {
		this.props.removeEvent(this.props.filter)
	}

	render () {
		return (
			<span className='filter-block' onClick={this.removeHandler}>
				{this.props.filter.value}
			</span>
        )
	}
}

FilterBlock.propTypes = {
	filter: React.PropTypes.object,
	removeEvent: React.PropTypes.func
}