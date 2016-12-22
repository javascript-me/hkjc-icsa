import React from 'react'
import ClassNames from 'classnames'

const emptyFn = () => {}

export default React.createClass({
	displayName: 'OverflowFilter',

	propTypes: {
		// The text will display in the page
		dataText: React.PropTypes.string,
		// The filter real data related
		dataValue: React.PropTypes.object,
		// The event which will be triggerd when click on this component
		onRemove: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			filters: [],
			onRemove: emptyFn
		}
	},

	getInitialState: function () {
		return {
		}
	},
	removeHandler: function () {
		this.props.onRemove(this.props.dataValue)
	},
	render: function() {
		return <li>
			<span>{this.props.dataText}</span>
			<i className="icon-more-filter-close"
				onClick={this.removeHandler}></i>
		</li>
	}
})