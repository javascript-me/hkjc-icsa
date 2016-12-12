import React from 'react'

export default class FilterBlock extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
		}

		this.removeHandler = this.removeHandler.bind(this)
	}

	removeHandler () {
		this.props.removeEvent(this.props.dataValue)
	}

	render () {
		let filterText = this.props.dataText || this.props.dataValue.value

		return (
			<span className='filter-block' onClick={this.removeHandler}>
				{filterText}
			</span>
        )
	}
}

FilterBlock.propTypes = {
	// The text will display in the page
	dataText: React.PropTypes.string,
	// The filter real data related
	dataValue: React.PropTypes.object,
	// The event which will be triggerd when click on this component
	removeEvent: React.PropTypes.func
}
