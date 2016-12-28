import React from 'react'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'OverflowFilter',

	propTypes: {
		// The text will display in the page
		dataText: React.PropTypes.string,
		// The filter real data related
		dataValue: React.PropTypes.object,
		// The event which will be triggerd when click on this component
		removeEvent: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			removeEvent: emptyFn
		}
	},

	getInitialState: function () {
		return {
		}
	},
	removeHandler: function () {
		this.props.removeEvent(this.props.dataValue)
	},
	render: function () {
		return <li>
			<span>{this.props.dataText || this.props.dataValue.value}</span>
			<i className='icon-more-filter-close'
				onClick={this.removeHandler} />
		</li>
	}
})
